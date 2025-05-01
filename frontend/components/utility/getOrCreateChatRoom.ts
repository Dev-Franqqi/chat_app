type ChatRoomResponse = {
  id:number,
  name:string,
  createdAt:string
}
export default async function getOrCreateChatRoom(token: string, email1: string, email2: string):Promise<string> {
  if(!email1  ){
    throw new Error('Email1 required')

  }
  if(!email2  ){
    throw new Error('Email2 is required')

  }
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/getOrCreateChatRoom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email1, email2 }),
      cache:'force-cache'
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }
  
    const data:ChatRoomResponse = await response.json();
    return data.name;
  }
  