export async function getUserByEmail(email: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getUserByEmail`, {
        body: JSON.stringify({ email }),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (!response.ok) {
        const data: { message: string } = await response.json()
        throw new Error(data.message)
    }

    const data = await response.json()
    return data
}
