"use client"
import Link from "next/link"
import { useAuth } from "@/context/UserContext"
import { useRouter } from "next/navigation"
export default function Navbar() {
    const router = useRouter()

    const { user, setUser } = useAuth()

    // ye function profile me set kr diya hai taki user waha se bhi logout kr ske
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("name")
        localStorage.removeItem("username")
        localStorage.removeItem("role")
        setUser(null)
        router.push("/")
    }

    return (
        <nav className="bg-gray-200 p-4 h-[10vh] flex items-center justify-between">
            <h1>Trip logic</h1>
            <ul className="flex gap-4 items-center">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/places">Explore</Link></li>
                {
                    user?.role == "admin" && <li><Link href="/dashboard">Dashboard</Link></li>
                }

                {user ? (
                    <>
                        {/* <button className="cursor-pointer" onClick={handleLogout}>Logout</button> */}
                        <Link className="bg-green-300 hover:bg-green-400 h-9 w-9 rounded-3xl flex items-center justify-center font-semibold text-gray-700" href="/profile" title="profile">{user.name.charAt(0).toUpperCase()}</Link>
                    </>
                ) : (
                    <>
                        <Link href="/login">Login</Link>
                        {/* <Link href="/register">Register</Link> */}
                    </>
                )}

            </ul>
        </nav>
    )
}