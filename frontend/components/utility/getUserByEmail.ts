export async function getUserByEmail(email: string,token:string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getUserByEmail`, {
        body: JSON.stringify({ email }),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`
        }
    })

    if (!response.ok) {
        const data: { message: string } = await response.json()
        throw new Error(data.message)
    }

    const data = await response.json()
    return data
}
