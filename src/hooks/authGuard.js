"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function authGuard(requiredRole = null) {

    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        const role = localStorage.getItem("role")
        if (!token) {
            router.push("/login")
        }
        else if (requiredRole && role !== requiredRole) {
            router.push("/")
        }
    }, [])
}