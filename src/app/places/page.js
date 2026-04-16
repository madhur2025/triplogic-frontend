"use client"
import { useEffect, useState } from "react"

import dynamic from 'next/dynamic';
const DynamicMap = dynamic(() => import('../../components/Map'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-[60vh] md:h-[70vh] bg-gray-100 rounded-3xl">
            <p className="text-lg font-medium text-gray-600">Loading interactive map...</p>
        </div>
    ),
});

export default function Places() {

    // 1 get user location
    const [location, setLocation] = useState({ latitude: null, longitude: null })
    const [locationLoading, setLocationLoading] = useState(false)
    const getUserLocation = () => {
        setLocationLoading(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                let lat = pos.coords.latitude
                let lng = pos.coords.longitude
                let acc = pos.coords.accuracy
                setLocation({ latitude: lat, longitude: lng })
                localStorage.setItem("localLatitude", lat)
                localStorage.setItem("localLongitude", lng)
                localStorage.setItem("localAccuracy", acc)
                setLocationLoading(false)
            },
            () => {
                alert("Location permission denied")
            }
        )
    }

    // set categories
    const allCategories = ["tourist", "religious", "adventure", "historical", "nature", "waterfront", "garden", "wildlife", "viewpoint"]
    const [categories, setCategories] = useState([])
    const toggleCategory = (cat) => {
        let updatedCategory
        if (categories.includes(cat)) {
            updatedCategory = categories.filter((category) => category !== cat)
        }
        else {
            updatedCategory = [...categories, cat]
        }
        setCategories(updatedCategory)
        // localStorage.setItem("localCategory", updatedCategory) // ye array ko string bna dega
        localStorage.setItem("localCategory", JSON.stringify(updatedCategory))
    }

    // 3 set distance
    const allDistance = [3, 5, 10, 15, 20]
    const [distance, setDistance] = useState(null)
    const toggleDistance = (dis) => {
        if (distance === dis) {
            setDistance(null)
            localStorage.removeItem("localDistance")
        }
        else {
            setDistance(dis)
            localStorage.setItem("localDistance", dis)
        }
    }

    // 4 fetch all places
    const [places, setPlaces] = useState([])
    const getfilteredPlaces = async () => {
        try {
            const params = {}

            if (location.latitude && location.longitude) {
                params.lat = location.latitude
                params.lng = location.longitude
            }

            if (distance) {
                params.distance = distance
            }

            if (categories.length > 0) {
                params.categories = categories.join(",")
            }

            const query = new URLSearchParams(params).toString()
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/places/filter?${query}`)
            const data = await res.json()
            console.log("filter", data)
            setPlaces(data)
        }
        catch (error) {
            console.log(error)
        }
    }

    // 5 auto calling function
    useEffect(() => {
        getfilteredPlaces()
    }, [location.latitude, location.longitude, distance, categories])

    // 6 sorting places nearest furthest
    const [sortType, setSortType] = useState("nearest")
    const sortedPlaces = [...places].sort((a, b) => {
        if (!a.distance || !b.distance) return 0;

        return sortType === "nearest"
            ? a.distance - b.distance
            : b.distance - a.distance;
    });

    // 7 select places for route
    const [selectedPlaces, setSelectedPlaces] = useState([])
    const toggleSelectPlace = (place) => {
        let updatedSelect
        if (selectedPlaces.includes(place)) { updatedSelect = selectedPlaces.filter((pls) => pls._id !== place._id) }
        else { updatedSelect = [...selectedPlaces, place] }
        setSelectedPlaces(updatedSelect)
        console.log(updatedSelect)
    }

    // 9 api
    const getRouteFromORS = async (coords) => {
        try {
            const res = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImU1YTA5YjM1OTY0ODQ4ZDViZjZmYjY5MmY4ZGEzNDMyIiwiaCI6Im11cm11cjY0In0="
                },
                body: JSON.stringify({
                    coordinates: coords
                })
            })

            const data = await res.json()

            return data
        } catch (err) {
            console.log(err)
        }
    }

    // 10
    const [routeCoords, setRouteCoords] = useState([])
    const [routeSteps, setRouteSteps] = useState([])
    const [orderedPlaces, setOrderedPlaces] = useState([])
    const generateRoute = async () => {
        if (!location || selectedPlaces.length < 2) return

        // ✅ STEP 1: nearest order (same logic)
        let remaining = [...selectedPlaces]
        let ordered = []

        let current = {
            lat: location.latitude,
            lng: location.longitude
        }

        while (remaining.length) {
            let nearestIndex = 0
            let minDist = Infinity

            remaining.forEach((p, i) => {
                const [lng, lat] = p.location.coordinates

                const dist = Math.sqrt(
                    (lat - current.lat) ** 2 +
                    (lng - current.lng) ** 2
                )

                if (dist < minDist) {
                    minDist = dist
                    nearestIndex = i
                }
            })

            const next = remaining.splice(nearestIndex, 1)[0]
            ordered.push(next)

            current = {
                lat: next.location.coordinates[1],
                lng: next.location.coordinates[0]
            }
        }

        // ✅ STEP 2: coords build (lng, lat)
        const coords = [
            [location.longitude, location.latitude],
            ...ordered.map(p => [
                p.location.coordinates[0],
                p.location.coordinates[1]
            ])
        ]

        // ✅ STEP 3: API call
        const data = await getRouteFromORS(coords)

        // ✅ STEP 4: polyline
        const geometry = data.features[0].geometry.coordinates
        const latLng = geometry.map(([lng, lat]) => [lat, lng])
        setRouteCoords(latLng)

        // ✅ STEP 5: steps (IMPORTANT 🔥)
        const steps = data.features[0].properties.segments[0].steps
        setRouteSteps(steps)
        setOrderedPlaces(ordered)
    }

    const center = location.latitude && location.longitude ? [location.latitude, location.longitude] : [25.2138, 75.9630];
    return (
        <div className="min-h-[90vh] bg-gradient-to-br from-blue-400 to-blue-200 p-4">

            {/* controllers */}
            <section className="flex justify-between">
                {/* user location */}
                <div className="flex flex-col gap-y-3 bg-white/50 backdrop-blur-lg p-5 rounded-2xl shadow">
                    <h3 className="text-xs text-gray-900 tracking-[1]">LOCATION</h3>
                    <button onClick={getUserLocation} disabled={locationLoading}
                        className={`text-sm px-2 py-1 rounded-md cursor-pointer ${location.latitude ? 'bg-blue-500 text-white' : 'bg-white/60'}`}>
                        {locationLoading ? "Detecting" : location.latitude ? "Found you" : "Find My location"}
                    </button>
                </div>

                {/* distance selection */}
                <div className="flex flex-col gap-y-3 bg-white/50 backdrop-blur-lg p-5 rounded-2xl shadow">
                    <h3 className="text-xs text-gray-900 tracking-[1]">RANGE</h3>
                    <div className="flex gap-x-4">

                        {allDistance.map((dis) => (
                            <button key={dis} onClick={() => { toggleDistance(dis) }} disabled={!location.latitude}
                                className={`text-sm px-2 py-1 rounded-md cursor-pointer ${location.latitude === null ? "text-gray-500" : "text-black"} ${distance === dis ? "bg-blue-500 text-white" : "bg-white/60"}`}
                            >{dis} km</button>
                        ))
                        }
                    </div>
                </div>

                {/* category selection */}
                <div className="flex flex-col gap-y-3 bg-white/50 backdrop-blur-lg p-5 rounded-2xl shadow">
                    <h3 className="text-xs text-gray-900 tracking-[1]">EXPLORE BY INTEREST</h3>
                    <div className="flex gap-x-4">
                        {allCategories.map((cat) => (
                            <button key={cat} onClick={() => { toggleCategory(cat) }}
                                className={`text-sm px-2 py-1 rounded-md cursor-pointer ${categories.includes(cat) ? "bg-blue-500 text-white" : "bg-white/60"}`}
                            >{cat}</button>
                        ))}
                    </div>
                </div>
            </section>

            {/* cards */}
            <section className="bg-white/50 my-3 backdrop-blur-lg p-5 rounded-2xl shadow flex flex-col gap-y-4">
                {
                    !sortedPlaces.length == 0 && <div className="flex items-center justify-between">

                        <p className="text-sm"> <span className="px-2 py-1 rounded-full bg-red-200">{places.length}</span> Locations found</p>

                        {/* sorting buttons */}
                        {
                            location.latitude && <div className="flex items-center bg-white/40 backdrop-blur-lg p-1 rounded-xl shadow-inner w-fit">

                                <button
                                    onClick={() => setSortType("nearest")}
                                    className={`cursor-pointer px-2 py-1 text-xs rounded-lg transition-all duration-300 
    ${sortType === "nearest"
                                            ? "bg-white text-black shadow font-medium scale-105"
                                            : "text-gray-600 hover:text-black"
                                        }`}
                                >
                                    Nearest
                                </button>

                                <button
                                    onClick={() => setSortType("furthest")}
                                    className={`cursor-pointer px-2 py-1 text-xs rounded-lg transition-all duration-300 
    ${sortType === "furthest"
                                            ? "bg-white text-black shadow font-medium scale-105"
                                            : "text-gray-600 hover:text-black"
                                        }`}
                                >Furthest</button>

                            </div>
                        }

                    </div>
                }
                {
                    sortedPlaces.length === 0 ?
                        <div className="text-center py-20">
                            <h2 className="text-xl font-semibold mb-3">
                                Discover amazing places around you 🌍
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Enable location or try increasing your range(km) and interests to explore
                            </p>
                        </div>
                        :
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {

                                sortedPlaces.map((place) => {
                                    const isSelected = selectedPlaces.some((p) => p._id === place._id);
                                    return (
                                        <div key={place._id} onClick={() => { toggleSelectPlace(place) }} className={`pop-animation flex flex-col bg-white rounded-2xl transition-all duration-400 cursor-pointer  ${isSelected
                                            ? "ring-1 ring-green-500 shadow-2xl shadow-blue-100/50 scale-[1.02]"
                                            : "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.1)] hover:-translate-y-1"
                                        }`}>
                                            <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                                                <img
                                                    src={place.images?.[0] || "/api/placeholder/400/250"}
                                                    alt={place.name}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                                {/* Top Badge: Professional & Minimal */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="backdrop-blur-md bg-white/80 text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full text-gray-700 shadow-sm">
                                                        {place.city}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-5 flex flex-col flex-grow">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-[16px] font-medium tracking-tight text-gray-900 leading-snug">
                                                        {place.name}
                                                    </h3>
                                                    {isSelected && (
                                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-blue-200">
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>

                                                {/* <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-4">
                                                    {place.description}
                                                </p> */}

                                                {/* Footer: Fine details */}
                                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        {place.distance && (
                                                            <>
                                                                <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                                                                    DISTANCE
                                                                </span>
                                                                <span className="text-[12px] text-gray-700 font-semibold">
                                                                    {place.distance} km
                                                                </span>
                                                            </>
                                                        )}
                                                        {
                                                            place.categories.map((cat) => (
                                                                <span key={cat} className="text-sm">{cat}</span>
                                                            ))
                                                        }
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/places/${place._id}`);
                                                        }}
                                                        className="cursor-pointer px-4 py-2 text-[12px] font-bold text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300"
                                                    >
                                                        Explore
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })
                            }
                        </div>
                }
            </section>

            <section>
                {/* floating route button */}
                {selectedPlaces.length >= 2 && (
                    <div className="flex justify-center">
                        <button onClick={generateRoute} className="pop-animation fixed bottom-8 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl cursor-pointer" >Generate Route </button>
                    </div>
                )}

            </section>


            <DynamicMap
                places={selectedPlaces}
                userLocation={
                    location.latitude && location.longitude
                        ? { lat: location.latitude, lng: location.longitude }
                        : null
                }
                center={center}
                route={routeCoords}   // 🔥 YE ADD KARO
            />

            {routeSteps.length > 0 && (
                <div className="bg-white p-4 rounded-xl shadow mt-4">
                    <h2 className="font-bold mb-2">Route Steps</h2>

                    {orderedPlaces.length > 0 && (
                        <div className="bg-white p-4 rounded-xl shadow mt-4">
                            <h2 className="font-bold mb-3">Your Route Plan</h2>

                            {/* user start */}
                            <div className="text-sm mb-2">
                                <span className="font-semibold">Start:</span> Your Location
                            </div>

                            {/* places order */}
                            {orderedPlaces.map((place, i) => (
                                <div key={place._id} className="text-sm mb-2">
                                    <span className="font-semibold">{i + 1}.</span> {place.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}