'use client'
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { FaAngleLeft } from "react-icons/fa6";
import { getUserByEmail } from "./utility/getUserByEmail";
import { MdOutlineMessage } from "react-icons/md";
import { useState } from "react";
export default function Searchusercomp({setActiveComp}:{setActiveComp:React.Dispatch<React.SetStateAction<string>>}){
    const [email,setEmail] = useState('')
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [foundUser,setFoundUser] = useState<any>('')
    // const [chats,setChats] = useState([])
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        console.log('handleSubmit')
        e.preventDefault()
        setError('')
        setFoundUser('')
        setLoading(true)
        if(!email){
            setError('Please enter a valid email or username')
            setLoading(false)
            return
        }
        try{
            const searchedUser:{message:string,user:string} = await getUserByEmail(email)
           setFoundUser(searchedUser.user)
            setLoading(false)

        }
        catch(error:any){
            console.log(error)
            setError(error.message)
            setLoading(false)
        }
    }

    return(
        <main style={{ height: 'calc(var(--vh, 1vh) * 84)' }} className="relative border border-gray-200 rounded-md mt-6 p-2 mx-2 ">
            <div>
            <div onClick={()=>setActiveComp('chat')} className="flex gap-x-2 items-center text-[#8670FD] font-semibold cursor-pointer">
            <FaAngleLeft className="" size={20} />
            <p className="text-xs text-black">Back to chat</p>
            </div>
            <h1 className="text-[#8670FD] font-extrabold text-xl text-center mt-4">Start a new chat</h1>
            <form onSubmit={handleSubmit}>

            <Input  onChange={(e)=>{setEmail(e.target.value)}} value={email} className={error?"border-red-600 border-2 mt-2":"border-[#8670FD] mt-2"} placeholder="Enter email or username" />
           {error && <p className="text-red-500 text-center border border-red-500 mt-4 font-medium p-2 rounded-md">{error}</p>}
            <Button disabled={loading} type="submit" className="bg-[#8670FD] mt-4 block mx-auto w-3/5 font-semibold">Search</Button>

            </form>
            </div>
            
            
           {foundUser &&  <div className="mt-5">
           <p className="text-green-500 font-semibold text-center">User Found</p>
            
            <div className="flex items-center justify-center h-4/5">
  <div className="w-full p-2 mx-auto h-fit border shadow-md mt-4 rounded-md flex gap-x-5 items-center">
    <div className="w-14 h-14 rounded-full bg-gray-200"></div>
    {foundUser}
    <MdOutlineMessage className="w-1/5" />
  </div>
</div></div>}


            

        </main>
    )
}