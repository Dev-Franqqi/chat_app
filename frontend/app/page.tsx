'use client'
import useWebSocket from "./hooks/useWebSocket";
import { FormEvent, useEffect,useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function Home() {
  const socket = useWebSocket()
  const [message,setMessage] = useState('')
  const [messages,setMessages] = useState<string[]>([])
  const handleSubmit = (e:FormEvent)=>{
    e.preventDefault()
    socket.emit('message',message)
    setMessage('')
  }
  useEffect(()=>{
    socket.on('connect',()=>{
      console.log("Connected to gateway")
    })
    socket.on('message',(data)=>{
        console.log('message event triggerd')
        console.log(data)
        setMessages((prevMessages) => [...prevMessages, data.content]);

        console.log(messages)
    })

    return ()=>{
      socket.off('connect')
      socket.off('message')
    }
  },[socket])
  return (<div className="flex flex-col h-screen mx-auto md:w-2/5">
    <div className="fixed top-0 md:w-2/5 w-full bg-gray-800 text-white h-14 flex items-center justify-center shadow-md">
      Navbar
    </div>
  
    <div className="flex-1 overflow-y-auto mt-14 mb-14 p-4 bg-gray-100">
      <div className="space-y-4">
      {messages && messages.map((chatMessage,index)=>(
        <div key={index} className="p-3 bg-blue-500 text-white rounded-lg shadow self-end">{chatMessage}</div>


      ))}
      </div>
    </div>
  
    <form onSubmit={handleSubmit} className="fixed bottom-0 md:w-2/5 bg-white h-14 flex items-center px-4 shadow-md">
      
      <Input value={message} onChange={(e)=>setMessage(e.target.value)} type="text" placeholder="Type a message..." className="flex-1 p-2 border rounded-lg focus:outline-none" />
      <Button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">Send</Button>
    </form>
  </div>
  
  );
}
