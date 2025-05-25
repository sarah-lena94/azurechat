"use client";

import { sortByTimestamp } from "@/features/common/util";

import { FC, useCallback, useEffect, useRef } from "react";
import {
  ChatThreadModel,
  MenuItemsGroup,
  MenuItemsGroupName,
} from "../chat-services/models";

import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ChatGroup as OriginalChatGroup } from "./chat-group";
import { ChatMenuItem } from "./chat-menu-item";
import { arrayMove } from "@dnd-kit/sortable";

interface ChatMenuProps {
  menuItems: Array<ChatThreadModel>;
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/ui/select";
import { useState } from "react";

export const ChatMenu: FC<ChatMenuProps> = (props) => {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [activeMenuItems, setActiveMenuItems] = useState<ChatThreadModel[]>(
    props.menuItems
  );

  useEffect(() => {
    setActiveMenuItems(props.menuItems);
  }, [props.menuItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const updatedItems = [...activeMenuItems];
    const oldIndex = updatedItems.findIndex((item) => item.id === active.id);
    const newIndex = updatedItems.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(updatedItems, oldIndex, newIndex);
    setActiveMenuItems(reordered);

    localStorage.setItem(
      "chatMenuOrder",
      JSON.stringify(reordered.map((item) => item.id))
    );
  }, [activeMenuItems]);

  const menuItemsGrouped = GroupChatThreadByType(
    activeMenuItems,
    sortOrder
  );

  return (
    <div className="px-3 flex flex-col gap-8 overflow-hidden">
      <Select
        onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest to Oldest</SelectItem>
          <SelectItem value="oldest">Oldest to Newest</SelectItem>
        </SelectContent>
      </Select>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {Object.entries(menuItemsGrouped).map(
          ([groupName, groupItems], index) => (
            <ChatGroupComponent key={index} title={groupName} items={groupItems} />
          )
        )}
      </DndContext>
    </div>
  );
};

interface SortableItemProps {
  item: ChatThreadModel;
}

export function SortableItem({ item }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const draggingRef = useRef(false);

  const handleDragStart = () => {
    draggingRef.current = true;
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="flex items-center">
      <div {...listeners} className="drag-handle cursor-grab p-3">
        ⠿
      </div>
      <ChatMenuItem
        key={item.id}
        href={`/chat/${item.id}`}
        chatThread={item}
        onClick={(e) => {
          if (draggingRef.current) {
            e.preventDefault();
          }
        }}
      >
        {item.name.replace("\n", "")}
      </ChatMenuItem>
    </div>
  );
}

interface ChatGroupProps {
  title: string;
  items: ChatThreadModel[];
}

export const ChatGroupComponent: FC<ChatGroupProps> = ({ title, items }) => {
  return (
    <ChatGroupWrapper title={title} items={items}></ChatGroupWrapper>
  );
};

interface ChatGroupWrapperProps {
  title: string;
  items: ChatThreadModel[];
}

const ChatGroupWrapper: FC<ChatGroupProps> = ({ title, items }) => {
  return (
    <div key={title}>
      <h3>{title}</h3>
      <SortableContext items={items.map((item) => item.id)}>
        {items?.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}
      </SortableContext>
    </div>
  );
};

export const GroupChatThreadByType = (
  menuItems: Array<ChatThreadModel>,
  sortOrder: "newest" | "oldest"
) => {
  const groupedMenuItems: Array<MenuItemsGroup> = [];
  const storedOrder = localStorage.getItem("chatMenuOrder");
  let orderedMenuItems: ChatThreadModel[] = [...menuItems];

  if (storedOrder) {
    const order = JSON.parse(storedOrder) as string[];
    orderedMenuItems = order
      .map((id) => menuItems.find((item) => item.id === id))
      .filter(Boolean) as ChatThreadModel[];

    // Add any missing items to the end of the ordered list
    menuItems.forEach((item) => {
      if (!orderedMenuItems.find((orderedItem) => orderedItem.id === item.id)) {
        orderedMenuItems.push(item);
      }
    });
  }

  // todays date
  const today = new Date();
  // 7 days ago
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const sortedMenuItems = [...orderedMenuItems].sort(sortByTimestamp);

  if (sortOrder === "oldest") {
    sortedMenuItems.reverse();
  }

  sortedMenuItems.forEach((el) => {
    if (el.bookmarked) {
      groupedMenuItems.push({
        ...el,
        groupName: "Bookmarked",
      });
    } else if (new Date(el.lastMessageAt) > sevenDaysAgo) {
      groupedMenuItems.push({
        ...el,
        groupName: "Past 7 days",
      });
    } else {
      groupedMenuItems.push({
        ...el,
        groupName: "Previous",
      });
    }
  });

  const menuItemsGrouped = groupedMenuItems.reduce((acc, el) => {
    const key = el.groupName;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(el);
    return acc;
  }, {} as Record<MenuItemsGroupName, Array<MenuItemsGroup>>);

  const records: Record<MenuItemsGroupName, Array<MenuItemsGroup>> = {
    Bookmarked:
      menuItemsGrouped["Bookmarked"]?.sort(sortByTimestamp) ?? [],
    "Past 7 days":
      menuItemsGrouped["Past 7 days"]?.sort(sortByTimestamp) ?? [],
    Previous: menuItemsGrouped["Previous"]?.sort(sortByTimestamp) ?? [],
  };

  if (sortOrder === "oldest") {
    records["Bookmarked"]?.reverse();
    records["Past 7 days"]?.reverse();
    records["Previous"]?.reverse();
  }

  return records;
};
