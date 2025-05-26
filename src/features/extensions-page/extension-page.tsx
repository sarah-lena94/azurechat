import { FC } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { AddExtension } from "./add-extension/add-new-extension";
import { ExtensionCard } from "./extension-card/extension-card";
import { ExtensionHero } from "./extension-hero/extension-hero";
import { ExtensionModel } from "./extension-services/models";

interface Props {
  extensions: ExtensionModel[];
}

export const ExtensionPage: FC<Props> = (props) => {
  return (
    <ScrollArea className="flex-1">
      <main className="flex flex-1 flex-col bg-gradient-to-b from-white dark:from-[#061826] to-[#F0F0F0]/50 dark:to-[#0A234B]/50 transition-colors duration-200 h-screen">
        <ExtensionHero />
        <div className="container max-w-4xl py-3">
          <div className="grid grid-cols-3 gap-3">
            {props.extensions.map((extension) => {
              return (
                <ExtensionCard
                  extension={extension}
                  key={extension.id}
                  showContextMenu
                />
              );
            })}
          </div>
        </div>
        <AddExtension />
      </main>
    </ScrollArea>
  );
};
