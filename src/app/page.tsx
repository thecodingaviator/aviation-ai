"use client";

import Message from "@/components/Message";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    onError(err) { console.error("chat error", err); },
    onResponse(res) { console.log("got response", res); }
  });
  
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1 className="text-center text-xl">Aviation AI</h1>
      <p className="text-center w-full text-sm mb-4 text-gray-500">
        Ask me about flight procedures and maneuvers
      </p>

      {messages.map((message) => (
        Message({ message })
      ))}

      <div className="fixed bottom-0 w-full bg-white">
        <form onSubmit={handleSubmit}>
          <input
            className="dark:bg-zinc-900 w-full max-w-md p-2 mt-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={input}
            placeholder="Type away..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
}
