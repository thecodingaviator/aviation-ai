import React from "react";
import { Message as MessageType } from "@ai-sdk/react";

interface MessageProps {
    message: MessageType;
}

const Message = ({ message }: MessageProps) => {
    return (
        <div
            key={message.id}
            className={`p-4 my-2 rounded-2xl
                ${message.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-800"}`
            }
        >
            <div className="font-semibold mb-2">
                {message.role === "user" ? "You" : "Aviation AI"}
            </div>
            <div className="whitespace-pre-wrap leading-relaxed text-sm text-justify">
                {message.parts?.map((part, i) => {
                    if (part.type === "text") {
                        return <div key={`${message.id}-${i}`}>{part.text}</div>;
                    }
                })}
            </div>
        </div>
    );
}

export default Message;