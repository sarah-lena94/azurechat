"use client";

import { sortByTimestamp } from "@/features/common/util";
import { FC } from "react";
import {
  ChatThreadModel,
  MenuItemsGroup,
  MenuItemsGroupName,
} from "../chat-services/models";
import { ChatGroup } from "./chat-group";
import { ChatMenuItem } from "./chat-menu-item";

interface ChatMenuProps {
  menuItems: Array<ChatThreadModel>;
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/ui/select";
import { useState } from "react";

export const ChatMenu: FC<ChatMenuProps> = (props) => {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const menuItemsGrouped = GroupChatThreadByType(props.menuItems, sortOrder);

  return (
    <div className="px-3 flex flex-col gap-8 overflow-hidden">
      <Select onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest to Oldest</SelectItem>
          <SelectItem value="oldest">Oldest to Newest</SelectItem>
        </SelectContent>
      </Select>
      {Object.entries(menuItemsGrouped).map(
        ([groupName, groupItems], index) => (
          <ChatGroup key={index} title={groupName}>
            {groupItems?.map((item) => (
              <ChatMenuItem
                key={item.id}
                href={`/chat/${item.id}`}
                chatThread={item}
              >
                {item.name.replace("\n", "")}
              </ChatMenuItem>
            ))}
          </ChatGroup>
        )
      )}
    </div>
  );
};

export const GroupChatThreadByType = (
  menuItems: Array<ChatThreadModel>,
  sortOrder: "newest" | "oldest"
) => {
  const groupedMenuItems: Array<MenuItemsGroup> = [];

  // todays date
  const today = new Date();
  // 7 days ago
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const sortedMenuItems = [...menuItems].sort(sortByTimestamp);

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
