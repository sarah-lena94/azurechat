import { FC } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { AddNewPersona } from "./add-new-persona";
import { PersonaCard } from "./persona-card/persona-card";
import { PersonaHero } from "./persona-hero/persona-hero";
import { PersonaModel } from "./persona-services/models";

interface ChatPersonaProps {
  personas: PersonaModel[];
}

export const ChatPersonaPage: FC<ChatPersonaProps> = (props) => {
  return (
    <ScrollArea className="flex-1">
      <div className="flex-1 flex flex-col bg-gradient-to-b from-white dark:from-[#061826] to-[#F0F0F0]/50 dark:to-[#0A234B]/50 transition-colors duration-200 h-screen">
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <PersonaHero />

            {/* Persona Cards */}
            <div className="grid grid-cols-3 gap-3">
              {props.personas.map((persona) => (
                <PersonaCard
                  persona={persona}
                  key={persona.id}
                  showContextMenu
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
