'use client';

import React from 'react';
import Message from '@/utils/components/Message';
import Modal from '@/components/Modal';
import Button from '@/utils/components/Button';
import { useChat } from '@ai-sdk/react';

const Chat = () => {
  // Local UI state for the settings modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Chat hook setup: messages, current input, and handlers
  const { messages, input, handleInputChange, handleSubmit: chatSubmit } = useChat({
    api: '/api/chat',
    onError(err) { console.error('chat error', err); },
    onResponse() { setIsLoading(false); }
  });

  // Chat submit handler
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    chatSubmit(e);
  };

  // Helper to insert METAR text into the chat input
  const insertMetar = (value: string) => {
    handleInputChange({
      target: { value }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div>
      {/* Chat header and introduction */}
      <div className='font-mono flex flex-col w-full max-w-md py-24 mx-auto stretch'>
        <h1 className='text-center text-xl'>Aviation AI</h1>
        <p className='text-center w-full text-sm mb-4 text-gray-500'>
          Ask me about flight procedures and maneuvers
        </p>

        {/* Render chat message list */}
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

      {/* Chat input and settings button */}
      <div className="fixed bottom-0 w-full bg-white p-2">
        <div
          className="
            flex items-center justify-between space-x-2
            max-[660px]:flex-col max-[660px]:space-y-2 max-[660px]:space-x-0
            md:mx-auto md:max-w-md
          "
        >
          {/* chat input */}
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

          {/* settings button */}
          <Button
            variant="default"
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto"
          >
            🔧
          </Button>
        </div>
        {/* Settings modal for METAR input */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onInsert={insertMetar}
        />
      </div>
    </div>
  );
}

export default Chat;
