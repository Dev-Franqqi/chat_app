type Message = {
  id: number;
  createdAt: Date;
  content: string;
  senderId: number;
  chatRoomId: number;
  sender: {
    id: number;
    email: string;
  };
};

export default async function getChatRoomMessages(token:string,room:string){
    if(!token){
        throw new Error("Login required")
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/getChatRoomMessages?room=${room}`, {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            Authorization:`Bearer ${token}`
        }
        })

        if(!response.ok){
            const errorMessage = await response.text()
            throw new Error(`Error ${response.status}: ${errorMessage}`)
        }
        const data:Message[] = await response.json()
        if(data.length < 1){
            throw new Error('No messages found')
        }
        return data
}