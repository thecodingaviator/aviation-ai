'use client';

import React from 'react';
import Message from '@/components/Message';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  // 1) Local UI state for the settings modal
  const [isModalOpen, setModalOpen] = React.useState(false);

  // 2) Chat hook setup: messages, current input, and handlers
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    onError(err) { console.error('chat error', err); },
    onResponse(res) { console.log('got response', res); }
  });

  // 3) Helper to insert METAR text into the chat input
  const insertMetar = (value: string) => {
    handleInputChange({
      target: { value }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div>
      {/* 4) Chat header and introduction */}
      <div className='font-mono flex flex-col w-full max-w-md py-24 mx-auto stretch'>
        <h1 className='text-center text-xl'>Aviation AI</h1>
        <p className='text-center w-full text-sm mb-4 text-gray-500'>
          Ask me about flight procedures and maneuvers
        </p>

        {/* 5) Render chat message list */}
        {messages.map(msg => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>

      {/* 6) Fixed input bar for sending new messages */}
      <div className='fixed bottom-0 w-full bg-white'>
        <form onSubmit={handleSubmit}>
          <input
            className='mx-auto block dark:bg-zinc-900 w-full max-w-md p-2 mt-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl'
            value={input}
            placeholder='Ask away...'
            onChange={handleInputChange}
          />
        </form>
      </div>

      {/* 7) Fixed toolbar: settings button and modal */}
      <div className='fixed bottom-0 w-full bg-white'>
        <Button
          variant='default'
          className='fixed bottom-0 right-10 mb-8'
          onClick={() => setModalOpen(true)}
        >
          🔧
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onInsert={insertMetar}
        />
      </div>
    </div>
  );
}
