"use client";

import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    onError(err) { console.error("chat error", err); },
    onResponse(res) { console.log("got response", res); }
  });
  
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          <strong>{m.role === "user" ? "You: " : "AI: "}</strong>
          {m.parts.map((p, i) => p.type === "text" && <span key={i}>{p.text}</span>)}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
