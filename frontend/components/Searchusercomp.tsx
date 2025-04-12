'use client'
import { Input } from "./ui/input"
import { useState } from "react"
import { Button } from "./ui/button"
import { FaAngleLeft } from "react-icons/fa6";
export default function Searchusercomp({setActiveComp}:{setActiveComp:React.Dispatch<React.SetStateAction<string>>}){
    const [chats,setChats] = useState([])

    return(
        <main style={{ height: 'calc(var(--vh, 1vh) * 84)' }} className="relative border border-gray-200 rounded-md mt-6 p-2 mx-2 ">
            <div>
            <div onClick={()=>setActiveComp('chat')} className="flex gap-x-2 items-center text-[#8670FD] font-semibold cursor-pointer">
            <FaAngleLeft className="" size={20} />
            <p className="text-xs text-black">Back to chat</p>
            </div>
            <h1 className="text-[#8670FD] font-extrabold text-xl text-center mt-4">Start a new chat</h1>
            <Input className="border-[#8670FD] mt-2" placeholder="Enter email or username" />
            <Button className="bg-[#8670FD] mt-4 block mx-auto w-3/5 font-semibold">Search</Button>
            </div>

            

        </main>
    )
}