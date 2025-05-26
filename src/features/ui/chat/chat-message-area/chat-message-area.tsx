"use client";
import { cn } from "@/ui/lib";
import {
  CheckIcon,
  ClipboardIcon,
  PocketKnife,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../../avatar";
import { Button } from "../../button";

export const ChatMessageArea = (props: {
  children?: React.ReactNode;
  profilePicture?: string | null;
  profileName?: string;
  role: "function" | "user" | "assistant" | "system" | "tool";
  onCopy: () => void;
}) => {
  const [isIconChecked, setIsIconChecked] = useState(false);

  const handleButtonClick = () => {
    props.onCopy();
    setIsIconChecked(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsIconChecked(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isIconChecked]);

  let profile = null;

  switch (props.role) {
    case "assistant":
    case "user":
      if (props.profilePicture) {
        profile = (
          <Avatar className="w-8 h-8 border-2 border-aithoria-blue-medium shadow-md transition-shadow duration-300 hover:shadow-lg">
            <AvatarImage src={props.profilePicture} />
          </Avatar>
        );
      } else {
        profile = (
          <UserCircle
            size={28}
            strokeWidth={1.4}
            className="text-muted-foreground"
          />
        );
      }
      break;
    case "tool":
    case "function":
      profile = (
        <PocketKnife
          size={28}
          strokeWidth={1.4}
          className="text-muted-foreground"
        />
      );
      break;
    default:
      break;
  }

  return (
    <div className="flex flex-col">
      <div className="h-7 flex items-center justify-between">
        <div className="flex gap-3">
          {profile}
          <div
            className={cn(
              "text-primary capitalize items-center flex font-medium",
              props.role === "function" || props.role === "tool"
                ? "text-muted-foreground text-sm"
                : "",
              props.role === "user" ? "text-aithoria-orange" : "",
              props.role === "assistant" ? "text-aithoria-blue-medium" : ""
            )}
          >
            {props.profileName}
          </div>
        </div>
        <div className=" h-7 flex items-center justify-between">
          <div>
            <Button
              variant={"ghost"}
              size={"sm"}
              title="Copy text"
              className="justify-right flex"
              onClick={handleButtonClick}
            >
              {isIconChecked ? (
                <CheckIcon size={16} />
              ) : (
                <ClipboardIcon size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1 px-10">
        <div className={cn("text-foreground dark:text-foreground rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card dark:bg-card")}>
          {props.children}
        </div>
      </div>
    </div>
  );
};
