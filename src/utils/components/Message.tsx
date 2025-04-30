import React from 'react';
import { Message as MessageType } from '@ai-sdk/react';

interface MessageProps {
  message: MessageType;
}

// 1) Message component: renders a single chat bubble
const Message = ({ message }: MessageProps) => {
  // 2) Determine if this message came from the user
  const isUser = message.role === 'user';

  return (
    // 3) Outer container with conditional styling based on sender
    <div
      key={message.id}
      className={`
        p-4 my-2 rounded-2xl border
        ${isUser
          ? 'border-blue-200 bg-blue-100 bg-opacity-90 text-blue-900 shadow-[0_0_10px_rgba(150,200,255,0.7)]'
          : 'border-gray-200 bg-gray-50 bg-opacity-90 text-gray-800 shadow-[0_0_10px_rgba(200,200,200,0.7)]'
        }
      `}
    >
      {/* 4) Header: show “You” for user, “Aviation AI” otherwise */}
      <div className='font-mono uppercase tracking-wider mb-2'>
        {isUser ? 'You' : 'Aviation AI'}
      </div>

      {/* 5) Body: render each text part in its own div */}
      <div className='font-mono text-sm leading-relaxed whitespace-pre-wrap'>
        {message.parts?.map((part, i) => {
          if (part.type === 'text') {
            return <div key={`${message.id}-${i}`}>{part.text}</div>;
          }
        })}
      </div>
    </div>
  );
};

// 6) Export the Message component
export default Message;
