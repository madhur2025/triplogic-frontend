"use client"
import { useAuth } from "@/context/UserContext"
import authGuard from "@/hooks/authGuard"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
export default function Profile() {
    authGuard()
    const router = useRouter()
    const { user, setUser } = useAuth()
    const [userProfile, setUserProfile] = useState(null)

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("name")
        localStorage.removeItem("username")
        localStorage.removeItem("role")
        setUser(null)
        router.push("/")
    }

    const handleDeleteAccount = async (id) => {
        if (!confirm("Delete Account ?")) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/delete/${id}`, { method: "DELETE" })
            localStorage.removeItem("token")
            localStorage.removeItem("name")
            localStorage.removeItem("username")
            localStorage.removeItem("role")
            setUser(null)
            router.push("/")
        }
        catch (error) {
            alert(error)
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token")

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()
            setUserProfile(data)
        }

        fetchProfile()
    }, [])

    if (!userProfile) return <Loader />

    return (

        <div className="min-h-[80vh] max-w-md mx-auto p-4 sm:p-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">

                {/* 1. Header Card: Name & Username */}
                <div className="bg-blue-50 rounded-2xl p-5 mb-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-blue-900">{userProfile.name}</h2>
                        <p className="text-blue-600 text-sm">@{userProfile.username}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                        {userProfile.name.charAt(0)}
                    </div>
                </div>

                {/* 2. Detail Card: Email, Verification, Date */}
                <div className="bg-gray-100 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <span className="text-gray-500 text-sm font-medium">Email</span>
                        <span className="text-gray-900 font-semibold text-sm">{userProfile.email}</span>
                    </div>

                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                        <span className="text-gray-500 text-sm font-medium">Account Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${userProfile.isVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {userProfile.isVerified ? "Verified" : "Pending"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-medium">Joined On</span>
                        <span className="text-gray-900 font-semibold text-sm">
                            {new Date(userProfile.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <button className="w-full mt-4 bg-red-50 text-red-600 py-3 rounded-2xl font-semibold hover:bg-red-100 transition-all active:scale-95 cursor-pointer border border-red-100" onClick={() => { handleDeleteAccount(userProfile._id) }}> Delete Account</button>

                {/* 3. Action Button */}
                <button className="w-full mt-4 bg-black text-white py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all active:scale-95 cursor-pointer" onClick={handleLogout}>
                    Logout Account</button>



            </div>
        </div>
    )
}


const Loader = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        {/* Outer Ring */}
        <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-gray-100"></div>
            {/* Animated Spinner */}
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 animate-pulse">
            Fetching Profile
        </p>
    </div>
);