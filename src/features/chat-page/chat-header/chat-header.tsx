import { ExtensionModel } from "@/features/extensions-page/extension-services/models";
import { CHAT_DEFAULT_PERSONA } from "@/features/theme/theme-config";
import { FC } from "react";
import { ChatDocumentModel, ChatThreadModel } from "../chat-services/models";
import { DocumentDetail } from "./document-detail";
import { ExtensionDetail } from "./extension-detail";
import { PersonaDetail } from "./persona-detail";

interface Props {
  chatThread: ChatThreadModel;
  chatDocuments: Array<ChatDocumentModel>;
  extensions: Array<ExtensionModel>;
}

export const ChatHeader: FC<Props> = (props) => {
  const persona =
    props.chatThread.personaMessageTitle === "" ||
    props.chatThread.personaMessageTitle === undefined
      ? CHAT_DEFAULT_PERSONA
      : props.chatThread.personaMessageTitle;
  return (
    <div className="p-4 bg-gradient-to-r from-[#F0F0F0]/50 to-white/50 dark:from-[#0E2E70]/50 dark:to-[#061826]/50 backdrop-blur-md transition-colors duration-200 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-2">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-semibold text-[#061826] dark:text-white tracking-tight">
            {props.chatThread.name}
          </span>
        </div>
        <div className="flex gap-2">
          <PersonaDetail chatThread={props.chatThread} />
          <DocumentDetail chatDocuments={props.chatDocuments} />
          <ExtensionDetail
            disabled={props.chatDocuments.length !== 0}
            extensions={props.extensions}
            installedExtensionIds={props.chatThread.extension}
            chatThreadId={props.chatThread.id}
          />
        </div>
      </div>
    </div>
  );
};
