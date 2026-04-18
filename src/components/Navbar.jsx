// "use client"
// import Link from "next/link"
// import { useAuth } from "@/context/UserContext"
// import { useRouter } from "next/navigation"
// export default function Navbar() {
//     const router = useRouter()

//     const { user, setUser } = useAuth()

//     // ye function profile me set kr diya hai taki user waha se bhi logout kr ske
//     const handleLogout = () => {
//         localStorage.removeItem("token")
//         localStorage.removeItem("name")
//         localStorage.removeItem("username")
//         localStorage.removeItem("role")
//         setUser(null)
//         router.push("/")
//     }

//     return (
//         <nav className="sticky top-0 bg-gray-200 p-4 h-[10vh] flex items-center justify-between sticky top-0 w-full z-2">
//             <h1>Trip logic</h1>
//             <ul className="flex gap-4 items-center">
//                 <li><Link href="/">Home</Link></li>
//                 <li><Link href="/places">Explore</Link></li>
//                 {
//                     user?.role == "admin" && <li><Link href="/dashboard">Dashboard</Link></li>
//                 }

//                 {user ? (
//                     <>
//                         {/* <button className="cursor-pointer" onClick={handleLogout}>Logout</button> */}
//                         <Link className="bg-green-300 hover:bg-green-400 h-9 w-9 rounded-3xl flex items-center justify-center font-semibold text-gray-700" href="/profile" title="profile">{user.name.charAt(0).toUpperCase()}</Link>
//                     </>
//                 ) : (
//                     <>
//                         <Link href="/login">Login</Link>
//                         {/* <Link href="/register">Register</Link> */}
//                     </>
//                 )}

//             </ul>
//         </nav>
//     )
// }




// "use client"
// import Link from "next/link"
// import { useAuth } from "@/context/UserContext"
// import { useRouter, usePathname } from "next/navigation"

// export default function Navbar() {
//     const router = useRouter()
//     const pathname = usePathname() // Active link highlight karne ke liye
//     const { user, setUser } = useAuth()

//     const handleLogout = () => {
//         localStorage.removeItem("token")
//         localStorage.removeItem("name")
//         localStorage.removeItem("username")
//         localStorage.removeItem("role")
//         setUser(null)
//         router.push("/")
//     }

//     // Active link style helper
//     const isActive = (path) => pathname === path

//     return (
//         <nav className="sticky top-0 left-0 right-0 z-50 flex items-center justify-center px-4 h-[13vh]">
//             {/* Glassmorphism Container */}
//             <div className="w-full h-16 backdrop-blur-[4px] bg-white/40 border border-white/20 rounded-2xl shadow-lg px-6 flex items-center justify-between">

//                 {/* Logo Section */}
//                 <Link href="/" className="flex items-center gap-2 group">
//                     <h1 className="text-xl font-bold tracking-2 text-gray-900 uppercase">
//                         Trip<span className="text-blue-600"> Logic</span>
//                     </h1>
//                 </Link>

//                 {/* Navigation Links */}
//                 <ul className="hidden md:flex items-center gap-8">
//                     <li>
//                         <Link href="/" className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}>
//                             Home
//                         </Link>
//                     </li>
//                     <li>
//                         <Link href="/places" className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive('/places') ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}>
//                             Explore
//                         </Link>
//                     </li>
//                     {user?.role === "admin" && (
//                         <li>
//                             <Link href="/dashboard" className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive('/dashboard') ? 'text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}>
//                                 Dashboard
//                             </Link>
//                         </li>
//                     )}
//                 </ul>

//                 {/* Right Side: Auth/Profile */}
//                 <div className="flex items-center gap-4">
//                     {user ? (
//                         <div className="flex items-center gap-3">



//                             {/* Profile Avatar */}
//                             <Link
//                                 href="/profile"
//                                 className="h-10 w-10 rounded-3xl bg-gradient-to-br from-blue-500/70 to-indigo-600/50 flex items-center justify-center text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all"
//                                 title="My Profile"
//                             >
//                                 {user.name.charAt(0).toUpperCase()}
//                             </Link>
//                         </div>
//                     ) : (
//                         <Link
//                             href="/login"
//                             className="px-6 py-2.5 bg-gray-800 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
//                         >
//                             Login
//                         </Link>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     )
// }


"use client"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/UserContext"
import { useRouter, usePathname } from "next/navigation"

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const { user, setUser } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleLogout = () => {
        localStorage.clear()
        setUser(null)
        router.push("/")
        setIsMenuOpen(false)
    }

    const isActive = (path) => pathname === path

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 flex items-center justify-center px-2 md:px-4 h-[10vh] md:h-[13vh]">
            {/* Glassmorphism Container */}
            <div className="relative w-full h-16 backdrop-blur-[4px] bg-white/40 border border-white/20 rounded-2xl shadow-lg px-6 flex items-center justify-between">

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group">
                    <h1 className="text-xl font-bold tracking-2 text-gray-900 uppercase">
                        Trip<span className="text-blue-600"> Logic</span>
                    </h1>
                </Link>

                {/* 💻 Desktop Navigation Links (Hidden on Mobile) */}
                <ul className="hidden md:flex items-center gap-8">
                    <li>
                        <Link href="/" className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/places" className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive('/places') ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}`}>
                            Explore
                        </Link>
                    </li>
                    
                    {user?.role === "admin" && (
                        <li>
                            <Link href="/dashboard" className={`text-xs font-bold uppercase tracking-widest transition-colors ${isActive('/dashboard') ? 'text-blue-700' : 'text-gray-700 hover:text-gray-900'}`}>
                                Dashboard
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Desktop Profile / Login (Hidden on Mobile) */}
                <div className="hidden md:flex items-center">
                    {user ? (
                        <Link
                            href="/profile"
                            className="h-10 w-10 rounded-3xl bg-gradient-to-br from-blue-500/70 to-indigo-600/50 flex items-center justify-center text-white font-semibold shadow-md border border-white/20 hover:scale-105 transition-all"
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Link>
                    ) : (
                        <Link href="/login" className="px-6 py-2.5 bg-gray-800 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-gray-200">
                            Login
                        </Link>
                    )}
                </div>

                {/* 🍔 Mobile Burger Button (Only visible on Mobile) */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none z-[60]"
                >
                    <span className={`block w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>

                {/* 📱 Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="absolute top-[75px] left-0 right-0 bg-white/90 border border-white/20 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 md:hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                        
                        {/* Mobile Links */}
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest pb-2 border-b border-gray-100 ${isActive('/') ? 'text-blue-600' : 'text-gray-700'}`}>
                            Home
                        </Link>
                        <Link href="/places" onClick={() => setIsMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest pb-2 border-b border-gray-100 ${isActive('/places') ? 'text-blue-600' : 'text-gray-700'}`}>
                            Explore
                        </Link>
                        
                        {user?.role === "admin" && (
                            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest pb-2 border-b border-gray-100 ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700'}`}>
                                Dashboard
                            </Link>
                        )}

                        {/* Mobile Profile Link */}
                        {user ? (
                            <>
                                <Link href="/profile" onClick={() => setIsMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest pb-2 border-b border-gray-100 ${isActive('/profile') ? 'text-blue-600' : 'text-gray-700'}`}>
                                    My Profile
                                </Link>
                                <button onClick={handleLogout} className="text-sm font-bold uppercase tracking-widest text-red-500 text-left pt-2">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-gray-700 pt-2">
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}