'use client'
import { Input } from "./ui/input"
export default function Chatcomp({setActiveComp}:{setActiveComp:React.Dispatch<React.SetStateAction<string>>}){
    const chats =[]

    return(
        <main style={{ height: 'calc(var(--vh, 1vh) * 84)' }} className="relative border border-gray-200 rounded-md mt-6 p-2 mx-2 ">
            <div>

            <h1 className="text-[#8670FD] font-extrabold text-xl">Chats</h1>
            <Input className="border-[#8670FD] mt-2" placeholder="Search or start a new chat" />
            </div>

            {chats.length===0 && <div className="flex flex-col items-center justify-center h-4/5">
                
                <p className="text-xl font-medium">No Chat available</p>
                <p className="text-[#8670FD] text-sm font-semibold" onClick={()=>setActiveComp('search')}>Start a conversation</p>
                </div>}

        </main>
    )
}