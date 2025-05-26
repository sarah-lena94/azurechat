"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/ui/dropdown-menu";
import { LoadingIndicator } from "@/features/ui/loading";
import { cn } from "@/ui/lib";
import { BookmarkCheck, MoreVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { ChatThreadModel } from "../chat-services/models";
import {
  BookmarkChatThread,
  DeleteChatThreadByID,
  UpdateChatThreadTitle,
} from "./chat-menu-service";

interface ChatMenuItemProps {
  href: string;
  chatThread: ChatThreadModel;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ChatMenuItem: FC<ChatMenuItemProps> = (props) => {
  const path = usePathname();
  const { isLoading, handleAction } = useDropdownAction({
    chatThread: props.chatThread,
  });

  return (
    <div className="flex justify-between group w-full pr-3 text-muted-foreground rounded-sm hover:text-muted-foreground text-sm">
      <Link
        href={props.href}
        className={cn(
          "flex-1 flex items-center gap-2 p-3 overflow-hidden hover:text-aithoria-orange",
          path.startsWith(props.href) && props.href !== "/"
            ? "text-aithoria-blue-medium"
            : ""
        )}
      >
        {props.children}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={isLoading}>
          {isLoading ? (
            <LoadingIndicator isLoading={isLoading} />
          ) : (
            <MoreVertical size={18} aria-label="Chat Menu Item Dropdown Menu" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItemWithIcon
            onClick={async () => await handleAction("bookmark")}
          >
            <BookmarkCheck size={18} />
            <span>
              {props.chatThread.bookmarked ? "Remove bookmark" : "Bookmark"}
            </span>
          </DropdownMenuItemWithIcon>
          <DropdownMenuItemWithIcon
            onClick={async () => await handleAction("rename")}
          >
            <Pencil size={18} />
            <span>Rename</span>
          </DropdownMenuItemWithIcon>
          <DropdownMenuSeparator />
          <DropdownMenuItemWithIcon
            onClick={async () => await handleAction("delete")}
          >
            <Trash size={18} />
            <span>Delete</span>
          </DropdownMenuItemWithIcon>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

type DropdownAction = "bookmark" | "rename" | "delete";

const useDropdownAction = (props: { chatThread: ChatThreadModel }) => {
  const { chatThread } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: DropdownAction) => {
    setIsLoading(true);
    switch (action) {
      case "bookmark":
        await BookmarkChatThread({ chatThread });
        break;
      case "rename":
        const name = window.prompt("Enter the new name for the chat thread:");
        if (name !== null) {
          await UpdateChatThreadTitle({ chatThread, name });
        }
        break;
      case "delete":
        if (
          window.confirm("Are you sure you want to delete this chat thread?")
        ) {
          await DeleteChatThreadByID(chatThread.id);
        }
        break;
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    handleAction,
  };
};

export const DropdownMenuItemWithIcon: FC<{
  children?: React.ReactNode;
  onClick?: () => void;
}> = (props) => {
  return (
    <DropdownMenuItem className="flex gap-2" onClick={props.onClick}>
      {props.children}
    </DropdownMenuItem>
  );
};
