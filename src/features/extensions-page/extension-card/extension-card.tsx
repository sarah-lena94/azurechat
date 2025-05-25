"use client";

import { Pencil } from "lucide-react";
import { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../../ui/card";
import { ExtensionModel } from "../extension-services/models";

interface Props {
  extension: ExtensionModel;
  showContextMenu: boolean;
}

export const ExtensionCard: FC<Props> = (props) => {
  const { extension } = props;
  return (
    <Card
      key={extension.id}
      className="cursor-pointer hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gradient-to-br from-[#0A234B] to-[#1E3A8A] rounded-lg overflow-hidden shadow-md transform hover:scale-105 motion-reduce:transform-none"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-aithoria-blue-medium/10`}>
            {/* Assuming extension.icon is a React component */}
            <Pencil className={`w-6 h-6 text-aithoria-blue-medium`} />
          </div>
          <CardTitle className={`text-xl font-semibold text-aithoria-blue-medium dark:text-white`}>
            {extension.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {extension.description}
      </CardContent>
    </Card>
  );
};
