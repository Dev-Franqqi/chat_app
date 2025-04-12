'use client';
import { useState } from "react";
import Chatcomp from "@/components/Chatcomp";
import Navbarcomp from "@/components/Navbarcomp";
import Searchusercomp from "@/components/Searchusercomp";
export default function ChatHomepage(){
    const [activeComp,setActiveComp] = useState('chat')
    return(<>
    <Navbarcomp />
    {activeComp ==='chat' && <Chatcomp setActiveComp={setActiveComp} />}
    {activeComp ==='search' && <Searchusercomp setActiveComp={setActiveComp} />}

        
    
    
    
    </>)
}