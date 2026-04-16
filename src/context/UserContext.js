"use client"
import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        const name = localStorage.getItem("name")
        const username = localStorage.getItem("username")
        const role = localStorage.getItem("role")

        if (token && name && username && role) {
            setUser({ name, username, role })
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
export const useAuth = () => useContext(UserContext)