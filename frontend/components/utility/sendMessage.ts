

export default async function sendMessage(token:string,room:string,message:string,senderId:number){
    console.log(token,room,message,senderId)
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat/sendPrivateMessage`, {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({room,message,senderId}),

    })

    if(!response.ok){
        const errorMessage = await response.text()
        throw new Error(`Error ${response.status}: ${errorMessage}`)
    }

    const data = await response.json()
    return data
}