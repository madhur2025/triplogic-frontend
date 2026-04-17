"use client"
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen text-[#1a1a1a] selection:bg-blue-100 font-sans">



            {/* HERO */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto text-center space-y-8">

                    <div className="inline-flex items-center px-4 py-1 rounded-full bg-blue-50 border border-blue-100">
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                            Precision Engine
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight">
                        The Intelligence Behind <br />
                        <span className="text-blue-600">Every Journey</span>
                    </h1>

                    <p className="max-w-xl mx-auto text-gray-500 text-base leading-relaxed">
                        A smart discovery tool that finds hidden gems near you with high accuracy and builds optimized routes.
                    </p>

                    <button
                        onClick={() => router.push('/places')}
                        className="px-8 py-4 bg-black text-white rounded-2xl font-semibold text-sm hover:shadow-xl transition"
                    >
                        Launch Radar
                    </button>

                </div>
            </section>

            {/* 🛡️ CORE ARCHITECTURE (Compact Grid) */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SmallCard
                        title="Secure Auth"
                        desc="Email-based verification with secure session management for every user."
                        icon="🔑"
                    />
                    <SmallCard
                        title="Role Systems"
                        desc="Defined access levels for Regular Users and Verified Admin contributors."
                        icon="🎭"
                    />
                    <SmallCard
                        title="Geo-Precision"
                        desc="Filtering logic that hunts for accuracy under 250m before fetching data."
                        icon="🛰️"
                    />
                </div>
            </section>

            {/* 👑 ADMIN CAPABILITIES (Premium Dark Section) */}
            <section className="py-5 px-6">
                <div className="max-w-7xl mx-auto bg-[#0a0a0a] rounded-[2.5rem] p-10 md:p-20 text-white relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Command Center</span>
                            <h2 className="text-4xl font-bold tracking-tight">Powerful Dashboard <br /> for Content Admins.</h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Our Admin Suite gives you total control. Manage the community, monitor user roles, and curate the map with precision tools.
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <AdminFeature label="Place Management" sub="Add, Edit, or Delete" />
                                <AdminFeature label="User Controls" sub="Manage Roles & Access" />
                                <AdminFeature label="Live Updates" sub="Instant Data Sync" />
                                <AdminFeature label="Media Storage" sub="High-Res Image Hosting" />
                            </div>
                        </div>
                        {/* Abstract UI Mockup */}
                        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                            <div className="flex gap-2 mb-6">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-1/3 bg-white/20 rounded"></div>
                                <div className="h-10 w-full bg-white/5 rounded-lg border border-white/5"></div>
                                <div className="h-10 w-full bg-white/5 rounded-lg border border-white/5"></div>
                                <div className="h-24 w-full bg-blue-600/10 rounded-lg border border-blue-600/30"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* 🗺️ EASY JOURNEY PLANNER */}
            <section className="py-24 px-6 ">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                            Plan your day <br />
                            <span className="text-blue-600 italic">in one click.</span>
                        </h2>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed">
                            Why jump between apps? Select your favorite spots and Trip Logic will create the smartest route for you. We calculate the distances so you don't have to.
                        </p>

                        <div className="grid grid-cols-1 gap-4 pt-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">✓</div>
                                <p className="text-sm font-bold text-gray-700">Auto-calculate distances between spots</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">✓</div>
                                <p className="text-sm font-bold text-gray-700">Get your complete travel plan via Email</p>
                            </div>
                        </div>
                    </div>

                    {/* Visual Mockup */}
                    <div className="flex-1 w-full bg-gray-50 rounded-[3rem] p-8 md:p-12 border border-gray-100">
                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Your Route</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm">3 Destinations Selected</span>
                                    <span className="text-xs text-gray-400">Total: 12.4 KM</span>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-100">
                                Send Itinerary to Email
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 👤 PERSONAL TRAVEL HUB */}
            <section className="py-24 bg-gray-950 text-white rounded-[4rem] mx-6">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Your Travel, <br /> Your Way.</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                        Create your account to save your favorite locations, manage your profile, and keep track of your past routes. It’s your personalized travel dashboard.
                    </p>
                    <div className="flex justify-center gap-12 pt-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-500 mb-1">Save</p>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500">Favorite Places</p>
                        </div>
                        <div className="text-center border-x border-white/10 px-12">
                            <p className="text-3xl font-bold text-blue-500 mb-1">Update</p>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500">Profile Details</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-500 mb-1">Sync</p>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500">Across Devices</p>
                        </div>
                    </div>
                </div>
            </section>

            

        </div>
    )
}

// Reusable Small Components
function SmallCard({ title, desc, icon }) {
    return (
        <div className="p-8 bg-white border border-gray-100 rounded-3xl hover:border-blue-200 transition-all group">
            <div className="text-2xl mb-4 grayscale group-hover:grayscale-0 transition-all">{icon}</div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-2">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">{desc}</p>
        </div>
    )
}

function AdminFeature({ label, sub }) {
    return (
        <div className="border-l-2 border-blue-600 pl-4 py-1">
            <p className="text-xs font-bold text-white uppercase tracking-tight">{label}</p>
            <p className="text-[10px] text-gray-500 font-medium">{sub}</p>
        </div>
    )
}