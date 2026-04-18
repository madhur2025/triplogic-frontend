"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/UserContext"
import Link from "next/link"
export default function Login() {

    const [form, setForm] = useState({ username: "", password: "" })
    const router = useRouter()
    const { setUser } = useAuth()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/users/login`,
                { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }
            )
            const data = await res.json()

            if (!res.ok) throw new Error(data.message)
            localStorage.setItem("token", data.token)
            localStorage.setItem("name", data.user.name)
            localStorage.setItem("username", data.user.username)
            localStorage.setItem("role", data.user.role)
            setUser({
                name: data.user.name,
                username: data.user.username,
                role: data.user.role
            })
            // console.log("data", data)
            alert("Login Successfully")
            setForm({ username: "", password: "" })
            router.push("/")
        }
        catch (error) {
            alert(error.message)
        }
    }

    return (
        <div className="h-[87vh] flex items-center justify-center">
            <div className="bg-white/80 p-8 rounded-2xl shadow-md w-[350px]">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required className="border p-2 rounded" />
                    <input name="password" value={form.password} onChange={handleChange} placeholder="Password" required className="border p-2 rounded" />
                    <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800 cursor-pointer" >Login</button>
                    <p className="text-sm text-center text-gray-600">Don't have an account ? <Link className="font-semibold" href="/register">Signup</Link> </p>
                </form>
            </div>
        </div>
    )
}











// "use client"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { useAuth } from "@/context/UserContext"
// import Link from "next/link"
// export default function Login() {

//     const [form, setForm] = useState({ identifier: "", password: "" })
//     const router = useRouter()
//     const { setUser } = useAuth()

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value })
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         try {
//             const res = await fetch(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/users/login`,
//                 { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }
//             )
//             const data = await res.json()

//             if (!res.ok) throw new Error(data.message)
//             localStorage.setItem("token", data.token)
//             localStorage.setItem("name", data.user.name)
//             localStorage.setItem("username", data.user.username)
//             localStorage.setItem("email", data.user.email)
//             localStorage.setItem("role", data.user.role)
//             setUser({
//                 name: data.user.name,
//                 username: data.user.username,
//                 email: data.user.email,
//                 role: data.user.role
//             })
//             console.log("data", data)
//             alert("Login Successfully")
//             setForm({ identifier: "", password: "" })
//             router.push("/")
//         }
//         catch (error) {
//             alert(error.message)
//         }
//     }

//     return (
//         <div className="min-h-[90vh] flex items-center justify-center bg-gray-100">
//             <div className="bg-white p-8 rounded-2xl shadow-md w-[350px]">
//                 <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
//                 <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//                     <input name="identifier" value={form.identifier} onChange={handleChange} placeholder="Username / Email" required className="border p-2 rounded" />
//                     <input name="password" value={form.password} onChange={handleChange} placeholder="Password" required className="border p-2 rounded" />
//                     <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800 cursor-pointer" >Login</button>
//                     <p className="text-sm text-center text-gray-600">Don't have an account ? <Link className="font-semibold" href="/register">Register</Link> </p>
//                 </form>
//             </div>
//         </div>
//     )
// }