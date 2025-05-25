"use client";

import {
  ResetInputRows,
  onKeyDown,
  onKeyUp,
  useChatInputDynamicHeight,
} from "@/features/chat-page/chat-input/use-chat-input-dynamic-height";

import { AttachFile } from "@/features/ui/chat/chat-input-area/attach-file";
import {
  ChatInputActionArea,
  ChatInputForm,
  ChatInputPrimaryActionArea,
  ChatInputSecondaryActionArea,
} from "@/features/ui/chat/chat-input-area/chat-input-area";
import { ChatTextInput } from "@/features/ui/chat/chat-input-area/chat-text-input";
import { ImageInput } from "@/features/ui/chat/chat-input-area/image-input";
import { Microphone } from "@/features/ui/chat/chat-input-area/microphone";
import { StopChat } from "@/features/ui/chat/chat-input-area/stop-chat";
import { SubmitChat } from "@/features/ui/chat/chat-input-area/submit-chat";
import React, { useRef } from "react";
import { chatStore, useChat } from "../chat-store";
import { fileStore, useFileStore } from "./file/file-store";
import { PromptSlider } from "./prompt/prompt-slider";
import {
  speechToTextStore,
  useSpeechToText,
} from "./speech/use-speech-to-text";
import {
  textToSpeechStore,
  useTextToSpeech,
} from "./speech/use-text-to-speech";

export const ChatInput = () => {
  const { loading, input, chatThreadId } = useChat();
  const { uploadButtonLabel } = useFileStore();
  const { isPlaying } = useTextToSpeech();
  const { isMicrophoneReady } = useSpeechToText();
  const { rows } = useChatInputDynamicHeight();

  const submitButton = React.useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const submit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="border-t border-border p-4 bg-background dark:bg-input transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="relative animate-in fade-in duration-75">
          <ChatInputForm
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              chatStore.submitChat(e);
            }}
            status={uploadButtonLabel}
          >
            <ChatTextInput
              onBlur={(e) => {
                if (e.currentTarget.value.replace(/\s/g, "").length === 0) {
                  ResetInputRows();
                }
              }}
              onKeyDown={(e) => {
                onKeyDown(e, submit);
              }}
              onKeyUp={(e) => {
                onKeyUp(e);
              }}
              value={input}
              rows={rows}
              onChange={(e) => {
                chatStore.updateInput(e.currentTarget.value);
              }}
              className="pr-24 border-border focus:border-primary focus:ring-primary/20 dark:focus:border-chart-1 dark:focus:ring-chart-1/20 bg-background dark:bg-input text-foreground dark:text-background shadow-sm hover:shadow-md transition-shadow duration-200"
            />
            <ChatInputActionArea>
              <ChatInputSecondaryActionArea>
                <AttachFile
                  onClick={(formData) =>
                    fileStore.onFileChange({ formData, chatThreadId })
                  }
                />
                <PromptSlider />
              </ChatInputSecondaryActionArea>
              <ChatInputPrimaryActionArea>
                <ImageInput />
                <Microphone
                  startRecognition={() => speechToTextStore.startRecognition()}
                  stopRecognition={() => speechToTextStore.stopRecognition()}
                  isPlaying={isPlaying}
                  stopPlaying={() => textToSpeechStore.stopPlaying()}
                  isMicrophoneReady={isMicrophoneReady}
                />
                {loading === "loading" ? (
                  <StopChat stop={() => chatStore.stopGeneratingMessages()} />
                ) : (
                  <SubmitChat ref={submitButton} />
                )}
              </ChatInputPrimaryActionArea>
            </ChatInputActionArea>
          </ChatInputForm>
        </div>
      </div>
    </div>
  );
};
