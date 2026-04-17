"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
export default function Home() {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const { id } = useParams()
    const [place, setPlace] = useState({})
    const [similarPlaces, setSimilarPlaces] = useState([])
    const [nearbyPlaces, setNearbyPlaces] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getPlace() {
            const res = await fetch(`${BASE_URL}/places/get/${id}`)
            const data = await res.json()
            console.log("main place", data)
            setPlace(data.data)
        }
        getPlace()
    }, [id])

    async function getNearbyPlaces() {

        if (!place?.location?.coordinates) return
        const [lng, lat] = place.location.coordinates

        const params = {
            lat: lat,
            lng: lng,
            distance: 5 // 5km
        }

        const query = new URLSearchParams(params).toString()
        const res = await fetch(`${BASE_URL}/places/filter?${query}`)
        const data = await res.json()
        const filtered = data.filter(item => item._id !== place._id)
        setNearbyPlaces(filtered.slice(0, 5))
    }

    async function getSimilarPlaces() {
        if (!place?.categories) return
        const [lng, lat] = place.location.coordinates

        const params = {
            lat: lat,
            lng: lng,
            categories: place.categories.join(",")
        }

        const query = new URLSearchParams(params).toString()
        const res = await fetch(`${BASE_URL}/places/filter?${query}`)
        const data = await res.json()

        const filtered = data.filter(item => item._id !== place._id)
        setSimilarPlaces(filtered.slice(0, 5))
    }

    useEffect(() => {
        getNearbyPlaces()
        getSimilarPlaces()
    }, [place])

    return (
        <div className="bg-gradient-to-br from-blue-400 to-blue-200 pb-2">

            {
                place &&
                <div>
                    <div className="relative h-[80vh] bg-cover bg-center flex justify-center items-center shadow-xl rounded-b-2xl" style={{
                        backgroundImage: place.images?.[0] ? `url(${place.images[0]})` : "none"
                    }}>
                        <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
                            <h3 className="text-5xl text-white font-thin">{place.name}</h3>
                        </div>

                    </div>

                    <div className="bg-white/50 p-5 mx-5 rounded-b-2xl">
                        <p>About : {place.description}</p>
                        <p>City : {place.city}</p>
                        <p>State : {place.state}</p>
                        <p className="flex gap-x-3 items-center">Tags : {place.categories?.map((tag) => (
                            <span key={tag} className="bg-yellow-300 px-2 py-1 rounded-md text-sm" >{tag}</span>
                        ))}</p>
                    </div>
                </div>
            }

            {/* similar places */}
            <div className=" m-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 ">You may also like</h3>
                <div className="bg-white/50 rounded-2xl p-3 grid grid-cols-5 flex gap-4 overflow-x-auto">
                    {
                        similarPlaces.length == 0 ? <p>No location found </p> : similarPlaces.map((place) =>
                            <div key={place._id} onClick={() => router.push(`/places/${place._id}`)} className="min-w-[200px] bg-white/60 backdrop-blur-lg rounded-2xl shadow cursor-pointer pop-animation">

                                <img
                                    src={place.images?.[0]}
                                    className="h-[120px] w-full object-cover rounded-t-2xl"
                                />
                                <div className="p-3">
                                    <h3 className="text-sm font-medium">{place.name}</h3>
                                    <p className="text-xs text-gray-500">
                                        {place.distance} km away
                                    </p>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        {place.description}
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* nearby places */}
            <div className="m-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Around this location in 5 km</h3>
                <div className="bg-white/50 rounded-2xl p-3 grid grid-cols-5 flex gap-4 overflow-x-auto">
                    {
                        nearbyPlaces.length == 0 ? <p>No location found in 5 km</p> : nearbyPlaces.map((place) =>
                            <div key={place._id} onClick={() => router.push(`/places/${place._id}`)} className="min-w-[200px] bg-white/60 backdrop-blur-lg rounded-2xl shadow cursor-pointer pop-animation">

                                <img
                                    src={place.images?.[0]}
                                    className="h-[120px] w-full object-cover rounded-t-2xl"
                                />
                                <div className="p-3">
                                    <h3 className="text-sm font-medium">{place.name}</h3>
                                    <p className="text-xs text-gray-500">
                                        {place.distance} km away
                                    </p>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        {place.description}
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

        </div>
    )
}