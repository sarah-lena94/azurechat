"use client";

import { FC, useCallback, useRef, useState } from "react";
import {
  ChatThreadModel,
  MenuItemsGroupName,
} from "../chat-services/models";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { arrayMove } from "@dnd-kit/sortable";
import { ChatMenuItem } from "./chat-menu-item";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/ui/select";

interface ChatMenuProps {
  menuItems: Array<ChatThreadModel>;
}

export const ChatMenu: FC<ChatMenuProps> = (props) => {
  const [sortOrder, setSortOrder] = useState<"custom" | "newest" | "oldest">("newest");
  const [activeMenuItems, setActiveMenuItems] = useState<ChatThreadModel[]>(() => {
    const storedOrder = localStorage.getItem("chatMenuOrder");
    if (storedOrder) {
      const orderIds = JSON.parse(storedOrder) as string[];
      const ordered = orderIds
        .map(id => props.menuItems.find(item => item.id === id))
        .filter(Boolean) as ChatThreadModel[];

      props.menuItems.forEach(item => {
        if (!ordered.find(i => i.id === item.id)) {
          ordered.push(item);
        }
      });
      return ordered;
    }
    return props.menuItems;
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        return;
      }

      if (active.id === over.id) {
        return;
      }

      const grouped = GroupChatThreadByType(activeMenuItems, sortOrder);

      let foundGroupName: MenuItemsGroupName | null = null;

      for (const groupName in grouped) {
        const ids = grouped[groupName as MenuItemsGroupName].map((i) =>
          i.id.toString()
        );
        if (ids.includes(active.id.toString()) && ids.includes(over.id.toString())) {
          foundGroupName = groupName as MenuItemsGroupName;
          break;
        }
      }

      if (!foundGroupName) {
        return;
      }

      const groupItems = grouped[foundGroupName];
      const oldIndex = groupItems.findIndex((item) => item.id.toString() === active.id.toString());
      const newIndex = groupItems.findIndex((item) => item.id.toString() === over.id.toString());

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const reorderedGroup = arrayMove(groupItems, oldIndex, newIndex);

      const updatedMenuItems: ChatThreadModel[] = [];
      (["Bookmarked", "Past 7 days", "Previous"] as MenuItemsGroupName[]).forEach(
        (group) => {
          if (group === foundGroupName) {
            updatedMenuItems.push(...reorderedGroup);
          } else {
            updatedMenuItems.push(...grouped[group]);
          }
        }
      );

      setActiveMenuItems(updatedMenuItems);
      setSortOrder("custom");

      localStorage.setItem(
        "chatMenuOrder",
        JSON.stringify(updatedMenuItems.map((item) => item.id))
      );
    },
    [activeMenuItems, sortOrder]
  );

  const sortMenuItemsByDate = (items: ChatThreadModel[], order: "newest" | "oldest") => {
    const sorted = [...items].sort((a, b) => {
      const dateA = new Date(a.lastMessageAt).getTime();
      const dateB = new Date(b.lastMessageAt).getTime();
      return order === "newest" ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  };

  const menuItemsGrouped = GroupChatThreadByType(activeMenuItems, sortOrder);

  return (
    <div className="px-3 flex flex-col overflow-hidden">
      <div className="w-full flex flex-end mr-2 mt-3">
        <Select
          value={sortOrder}
          onValueChange={(value) => {
            const newSortOrder = value as "newest" | "oldest";
            setSortOrder(newSortOrder);
            setActiveMenuItems((prevItems) => {
              return [...prevItems].sort((a, b) => {
                const dateA = new Date(a.lastMessageAt).getTime();
                const dateB = new Date(b.lastMessageAt).getTime();
                return newSortOrder === "newest" ? dateB - dateA : dateA - dateB;
              });
            });
          }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest to Oldest</SelectItem>
            <SelectItem value="oldest">Oldest to Newest</SelectItem>
            <SelectItem value="custom">Custom Order</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-8">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          {Object.entries(menuItemsGrouped).map(([groupName, groupItems]) => (
            <ChatGroupComponent key={groupName} title={groupName} items={groupItems} />
          ))}
        </DndContext>
      </div>
    </div>
  );
};

interface SortableItemProps {
  item: ChatThreadModel;
}

export function SortableItem({ item }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const draggingRef = useRef(false);

  const handleDragStart = () => {
    draggingRef.current = true;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center"
      onDragStart={handleDragStart}
    >
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
  return <ChatGroupWrapper title={title} items={items} />;
};

const ChatGroupWrapper: FC<ChatGroupProps> = ({ title, items }) => {
  return (
      <div key={title}>
        <h3>{title}</h3>
        <SortableContext items={items.map((item) => item.id.toString())}>
          {items.map((item) => (
            <SortableItem key={item.id.toString()} item={item} />
          ))}
        </SortableContext>
    </div>
  );
};

export const GroupChatThreadByType = (
  menuItems: Array<ChatThreadModel>,
  sortOrder: "custom" | "newest" | "oldest"
) => {
  let orderedMenuItems: ChatThreadModel[] = [...menuItems];

  if (sortOrder === "custom") {
    const storedOrder = localStorage.getItem("chatMenuOrder");
    if (storedOrder) {
      const order = JSON.parse(storedOrder) as string[];
      orderedMenuItems = order
        .map((id) => menuItems.find((item) => item.id.toString() === id.toString()))
        .filter(Boolean) as ChatThreadModel[];

      menuItems.forEach((item) => {
        if (!orderedMenuItems.find((orderedItem) => orderedItem.id === item.id)) {
          orderedMenuItems.push(item);
        }
      });
    }
  } else {
    orderedMenuItems = [...menuItems].sort((a, b) => {
      const dateA = new Date(a.lastMessageAt).getTime();
      const dateB = new Date(b.lastMessageAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const menuItemsGrouped: Record<MenuItemsGroupName, ChatThreadModel[]> = {
    Bookmarked: [],
    "Past 7 days": [],
    Previous: [],
  };

  orderedMenuItems.forEach((el) => {
    if (el.bookmarked) {
      menuItemsGrouped["Bookmarked"].push(el);
    } else if (new Date(el.lastMessageAt) > sevenDaysAgo) {
      menuItemsGrouped["Past 7 days"].push(el);
    } else {
      menuItemsGrouped["Previous"].push(el);
    }
  });

  return menuItemsGrouped;
};

