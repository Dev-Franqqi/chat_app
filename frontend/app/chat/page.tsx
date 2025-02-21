'use client'
import useWebSocket from "../hooks/useWebSocket";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
export default function Home() {
  const socket = useWebSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ message: string; clientId: string; type: string }[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const router =useRouter();
   
   useEffect(() => {
    const uid = Cookies.get('uid')
    if(!uid){
        router.push('/')
      return
    }
  
    
    socket.connect();

    socket.on('connect', () => {
      console.log("Connected to gateway");
    });

    // Receive and store the client ID
     socket.on('your_id', (id: string) => {
      setClientId(id)
      console.log(clientId)

     })

    socket.on('message', (data: { message: string; clientId: string }) => {
      // setMessages(prev => [...prev, { ...data}]);
      setMessages(prev=>[...prev,{...data,type:'message' }])
    });

    socket.on('connection', (data: string) => {
      setMessages(prev => [...prev, { message: data, clientId: 'System', type: 'connection' }]);
    });
    socket.on('uniqueId', (uid)=>{console.log(` your uid is ${uid}` )
    Cookies.set("uid",uid)
    
  })

    socket.on('disconnection', (data: string) => {
      setMessages(prev => [...prev, { message: data, clientId: 'System', type: 'disconnection' }]);
    });

    return () => {
      socket.off();
      socket.disconnect();
      console.log("Cleanup: Socket disconnected");
    };
  },[]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen mx-auto md:w-2/5">
      <div className="fixed top-0 md:w-2/5 w-full bg-gray-800 text-white h-14 font-bold flex items-center justify-center shadow-md">
        CHAT APP
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mt-14 mb-14 p-4 bg-gray-100">
  {messages.map((message, index) => (
    <div key={index} className="mb-2">
      {message.type === 'message' && (
        <div className="text-gray-500 text-xs mb-1">{message.clientId}</div>
      )}
      <div 
        className={
          message.type === 'message'
            ? "bg-blue-500 text-white max-w-[80%] rounded-lg p-2"
            : message.type === 'connection'
            ? "text-green-600 text-center text-xs"
            : "text-center text-red-600 text-xs"
        }
      >

        {message.message}
      </div>
    </div>
  ))}
</div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="fixed bottom-0 md:w-2/5 bg-white h-14 flex items-center px-4 shadow-md">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none"
        />
        <Button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">Send</Button>
      </form>
    </div>
  );
}
