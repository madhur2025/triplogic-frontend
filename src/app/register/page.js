"use client"
import toast from "react-hot-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
export default function Register() {
    const router = useRouter()
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({ name: "", username: "", email: "", password: "" })

    const [otp, setOtp] = useState("")

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const sendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch(`${BASE_URL}/users/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email })
        })

        const data = await res.json()

        if (!res.ok) {
            toast.error(data.message)
            setLoading(false)
            return
        }
        toast.success("OTP sent successfully")
        setStep(2)
        setLoading(false)
    }

    const verifyOtp = async () => {
        if (!otp) {
            toast.error("Enter OTP")
            return
        }

        setLoading(true)

        const res = await fetch(`${BASE_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, otp })
        })

        const data = await res.json()

        if (!res.ok) {
            toast.error(data.message)
            setLoading(false)
            return
        }

        setForm({ name: "", username: "", email: "", password: "" })

        router.push("/login")
    }

    return (
        // <div className="min-h-[90vh] flex items-center justify-center bg-gray-100">
        //     <div className="bg-white p-8 rounded-2xl shadow-md w-[350px]">
        //         <h2 className="text-2xl font-bold text-center mb-6">
        //             Register
        //         </h2>

        //         {step === 1 && (
        //             <form onSubmit={sendOtp} className="flex flex-col gap-3">
        //                 <input name="name" value={form.name} placeholder="Name" onChange={handleChange} className="border p-2 rounded" required />

        //                 <input name="username" value={form.username} placeholder="Username" onChange={handleChange} className="border p-2 rounded" required />

        //                 <input name="email" type="email" value={form.email} placeholder="Email" onChange={handleChange} className="border p-2 rounded" required />

        //                 <input name="password" type="password" value={form.password} placeholder="Password" onChange={handleChange} className="border p-2 rounded" required />

        //                 <button className="bg-black text-white p-2 rounded hover:bg-gray-800" disabled={loading}>
        //                     {loading ? "Sending OTP..." : "Send OTP"}
        //                 </button>

        //                 <p className="text-sm text-center text-gray-600">Already have an account ? <Link className="font-semibold" href="/login">Login</Link> </p>
        //             </form>
        //         )}

        //         {step === 2 && (
        //             <div className="flex flex-col gap-4">
        //                 <p className="text-sm text-gray-600 text-center">
        //                     Enter OTP sent to your email
        //                 </p>

        //                 <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)}
        //                     className="border p-2 rounded text-center tracking-widest" />

        //                 <button className="bg-black text-white p-2 rounded hover:bg-gray-800" onClick={verifyOtp} disabled={loading}>
        //                     {loading ? "Verifying..." : "Verify & Register"}
        //                 </button>

        //                 <button onClick={() => setStep(1)} className="text-blue-500 text-sm"> Edit details</button>
        //             </div>
        //         )}

        //     </div>
        // </div>

        <div className="min-h-[87vh] flex items-center justify-center">
            <div className="bg-white/80 p-8 rounded-2xl shadow-md w-[350px]">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Signup
                </h2>

                {step === 1 && (
                    <form onSubmit={sendOtp} className="flex flex-col gap-3">
                        <input name="name" value={form.name} placeholder="Name" onChange={handleChange} className="border p-2 rounded" required />

                        <input name="email" type="email" value={form.email} placeholder="Email" onChange={handleChange} className="border p-2 rounded" required />

                        <button className="bg-black text-white p-2 rounded hover:bg-gray-800" disabled={loading}>
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>

                        <p className="text-sm text-center text-gray-600">Already have an account ? <Link className="font-semibold text-blue-600" href="/login">Login</Link> </p>
                    </form>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-gray-600 text-center">
                            Enter OTP sent to your email
                        </p>
                        <input name="username" value={form.username} placeholder="Username" onChange={handleChange} className="border p-2 rounded" required />

                        <input name="password" type="password" value={form.password} placeholder="Password" onChange={handleChange} className="border p-2 rounded" required />

                        <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)}
                            className="border p-2 rounded text-center tracking-widest" />

                        <button className="bg-black text-white p-2 rounded hover:bg-gray-800" onClick={verifyOtp} disabled={loading}>
                            {loading ? "Verifying..." : "Verify & Register"}
                        </button>

                        <button onClick={() => setStep(1)} className="text-blue-500 text-sm"> Edit details</button>
                    </div>
                )}

            </div>
        </div>
    )
}