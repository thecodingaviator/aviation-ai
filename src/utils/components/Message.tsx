import React from "react";
import { Message as MessageType } from "@ai-sdk/react";

// Importing the Message type from the AI SDK
interface MessageProps {
  message: MessageType;
}

// Message component: renders a single chat bubble
const Message = ({ message }: MessageProps) => {
  // Determine if this message came from the user
  const isUser = message.role === "user";

  return (
    // Outer container with conditional styling based on sender
    <div
      key={message.id}
      className={`my-2 rounded-2xl border p-4 ${
        isUser
          ? "bg-opacity-90 border-blue-200 bg-blue-100 text-blue-900 shadow-[0_0_10px_rgba(150,200,255,0.7)]"
          : "bg-opacity-90 border-gray-200 bg-gray-50 text-gray-800 shadow-[0_0_10px_rgba(200,200,200,0.7)]"
      } `}
    >
      {/* Header: show “You” for user, “Aviation AI” otherwise */}
      <div className="mb-2 font-mono tracking-wider uppercase">
        {isUser ? "You" : "Aviation AI"}
      </div>

      {/* Body: render each text part in its own div */}
      <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {message.parts?.map((part, i) => {
          if (part.type === "text") {
            return <div key={`${message.id}-${i}`}>{part.text}</div>;
          }
        })}
      </div>
    </div>
  );
};

// Export the Message component
export default Message;
