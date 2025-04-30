'use client';

import React, { useState } from 'react';
import Message from '@/components/Message';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  // 1) Local UI state for the settings modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 2) Chat hook setup: messages, current input, and handlers
  const { messages, input, handleInputChange, handleSubmit: chatSubmit } = useChat({
    api: '/api/chat',
    onError(err) { console.error('chat error', err); },
    onResponse() { setIsLoading(false); }
  });

  // 3) Chat submit handler
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    chatSubmit(e);
  };

  // 4) Helper to insert METAR text into the chat input
  const insertMetar = (value: string) => {
    handleInputChange({
      target: { value }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div>
      {/* 5) Chat header and introduction */}
      <div className='font-mono flex flex-col w-full max-w-md py-24 mx-auto stretch'>
        <h1 className='text-center text-xl'>Aviation AI</h1>
        <p className='text-center w-full text-sm mb-4 text-gray-500'>
          Ask me about flight procedures and maneuvers
        </p>

        {/* 6) Render chat message list */}
        {messages.map(msg => (
          <Message key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <Message
            key='Thinking...'
            message={{
              id: 'Thinking...',
              role: 'assistant',
              content: 'Thinking...',
              parts: [{ type: 'text', text: 'Thinking...' }],
            }}
          />
        )}
      </div>

      {/* 7) Chat input and settings button */}
      <div className="fixed bottom-0 w-full bg-white p-2">
        <div
          className="
            flex items-center justify-between space-x-2
            max-[660px]:flex-col max-[660px]:space-y-2 max-[660px]:space-x-0
            md:mx-auto md:max-w-md
          "
        >
          {/* 7.1) chat input */}
          <form onSubmit={handleFormSubmit} className="w-full">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask away..."
              className="
                w-full p-2 border border-zinc-300 rounded shadow-xl
                dark:bg-zinc-900 dark:border-zinc-800
              "
            />
          </form>

          {/* 7.2) settings button */}
          <Button
            variant="default"
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto"
          >
            🔧
          </Button>
        </div>
        {/* 8) Settings modal for METAR input */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onInsert={insertMetar}
        />
      </div>
    </div>
  );
}
