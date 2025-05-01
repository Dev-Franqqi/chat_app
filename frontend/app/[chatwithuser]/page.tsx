'use client';
import Navbarcomp from "@/components/Navbarcomp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, FormEvent } from "react";
import { usePathname } from 'next/navigation';
import useWebSocket from "../hooks/useWebSocket";
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import { useRouter } from "next/navigation";
import getOrCreateChatRoom from "@/components/utility/getOrCreateChatRoom";
import { MdToken } from "react-icons/md";

export default function ChatWithUser() {
  const router = useRouter();
  const [secUser, setSecUser] = useState('');
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<any>();
  const [clientId, setClientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ message: string; clientId: string; type: string }[]>([]);
  const [chatRoom, setChatRoom] = useState('');
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef(null);

  useEffect(() => {
    console.log(chatRoom + 'this is chat room');
    setSecUser(pathname.replace('/', ''));

    const token = Cookies.get('token');
    const user = Cookies.get('user');

    if (!token || !user) {
      router.push('/');
      throw new Error('User not authenticated');
    }
    setClientId(user);

    if (!socket) {
      const token = Cookies.get('token');
      console.log(token);

      if (token) {
        const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
          query: { token },
          withCredentials: true,
        });
        console.log('socket created');
        setSocket(newSocket);
        return;
      }

      router.push('');
    }

    if (socket && !socket.connected) {
      socket.connect();
    }

    const handlePrivateMessage = (data: { message: string; clientId: string }) => {
      console.log('handling');
      console.log(data);
      setMessages((prev) => [...prev, { message: data.message, clientId: data.clientId, type: 'message' }]);
    };

    const handleId = (id: string) => {
      setClientId(id);
    };

    socket?.on('privateMessage', handlePrivateMessage);
    socket?.on('your_id', handleId);

    return () => {
      socket?.off('privateMessage', handlePrivateMessage);
      socket?.off('your_id', handleId);
    };
  }, [pathname, socket]);

  useEffect(() => {
    if (socket?.connected) {
      console.log('Socket connected');
    }
  }, [socket]);

  useEffect(() => {
    const token = Cookies.get('token');
    const user = Cookies.get('user');

    if (!token || !user) {
      router.push('/');
      throw new Error('User not authenticated');
    }
    if (secUser) {
      async function getChatRoom(token: string, user: string, secUser: string) {
        const newChatRoom = await getOrCreateChatRoom(token, user, secUser);
        setChatRoom(newChatRoom);
        console.log('chat room is: ');
        console.log(newChatRoom);
        socket.emit('join_room', newChatRoom);
      }
      getChatRoom(token, user, secUser);
    }
  }, [secUser]);

  useEffect(() => {
    console.log('Messages updated:', messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socket) {
      throw new Error('Socket not connected');
    }
    if (!message.trim()) return;
    try {
      const user = Cookies.get('user');
      const token = Cookies.get('token');
      if (!user || !token) {
        router.push('/');
        throw new Error('User not authenticated');
      }
      if (!chatRoom) {
        const newChatRoom = await getOrCreateChatRoom(token, user, secUser);
        if (!newChatRoom) {
          console.log('No chat room found');
        }
        console.log('chat room is: ');
        console.log(newChatRoom);
        setChatRoom(newChatRoom);
        console.log(chatRoom);
        socket.emit('join_room', chatRoom);
        socket.emit('privateMessage', {
          room: `${chatRoom}`,
          message: message,
        });
        setMessage('');
        return;
      }
      socket.emit('privateMessage', {
        room: `${chatRoom}`,
        message: message,
      });
      setMessage('');
      return;
    } catch (error) {
      console.log(error);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as any);
    }
  };

  return (
    <div className="relative flex flex-col gap-y-4 h-[95dvh] bg-gradient-to-b from-gray-100 to-gray-200">
      <Navbarcomp />
      <main className="flex flex-col h-full w-full max-w-2xl mx-auto border-t-2 border-gray-300">
        <header className="h-fit px-4 py-3 bg-white shadow-md border-b border-gray-200">
          <h1 className="text-[#8670FD] font-extrabold text-lg text-center">{secUser}</h1>
        </header>

        {/* Message List */}
        <div
          className="flex-1 p-4 text-sm font-semibold overflow-y-auto"
          ref={messageListRef}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                message.type === 'message' && message.clientId === clientId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`
                  relative inline-block px-3 py-2 rounded-2xl max-w-xs text-sm
                  ${
                    message.type === 'message'
                      ? message.clientId === clientId
                        ? 'bg-[#8670FD] text-white shadow-md'
                        : 'bg-white text-gray-800 border border-gray-200 shadow-md'
                      : message.type === 'connection'
                      ? 'text-green-600 text-center text-xs w-full'
                      : 'text-red-600 text-center text-xs w-full'
                  }
                  ${
                    message.type === 'message'
                      ? message.clientId === clientId
                        ? 'rounded-br-sm after:content-[""] after:absolute after:-bottom-1 after:right-1 after:border-8 after:border-transparent after:border-l-[#8670FD] after:border-t-[#8670FD]'
                        : 'rounded-bl-sm after:content-[""] after:absolute after:-bottom-1 after:left-1 after:border-8 after:border-transparent after:border-r-white after:border-t-white'
                      : ''
                  }
                `}
              >
                {message.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={sendMessage}
          className="w-full bg-white h-16 flex items-center px-4 shadow-lg sticky bottom-0 z-10 border-t border-gray-200"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8670FD] text-sm"
          />
          <Button
            type="submit"
            className="ml-2 bg-[#8670FD] hover:bg-[#7360d8] text-white px-4 py-2 rounded-full text-sm"
          >
            Send
          </Button>
        </form>
      </main>
    </div>
  );
}