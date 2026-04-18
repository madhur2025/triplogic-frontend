"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"
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
    const router = useRouter()

    // 1 get user location
    const [location, setLocation] = useState({ latitude: null, longitude: null })
    const [locationLoading, setLocationLoading] = useState(false)
    const getUserLocation = () => {
        setLocationLoading(true)
        setLocationLoading(true)
        const loadingToast = toast.loading("Getting your location...")
        let bestLocation = null
        let bestAccuracy = Infinity
        const startTime = Date.now()

        const tryGetLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude, accuracy } = pos.coords

                    console.log("Accuracy:", accuracy)

                    // agr accuracy 50 km se km ki mili hai toh usko best accuracy bta do kaam chalane k liye
                    if (accuracy > 50000) {
                        console.log("Very poor accuracy, retrying...")
                    } else {
                        if (accuracy < bestAccuracy) {
                            bestAccuracy = accuracy
                            bestLocation = { latitude, longitude }
                        }
                    }

                    // acchi accuracy mil gyi toh set krdo
                    if (accuracy <= 300) {
                        saveLocation(latitude, longitude, accuracy)
                        toast.dismiss(loadingToast)
                        toast.success("Location detected successfully")
                        return
                    }

                    // ⏱️ timeout
                    if (Date.now() - startTime > 15000) {
                        if (bestLocation) {
                            saveLocation(bestLocation.latitude, bestLocation.longitude, bestAccuracy)
                            toast.dismiss(loadingToast)
                            toast("Using best available location", { icon: "📍" })
                        } else {
                            toast.error("Low accuracy location, please try again")
                            setLocationLoading(false)
                        }
                        return
                    }

                    setTimeout(tryGetLocation, 2000)
                },
                (error) => {
                    setLocationLoading(false)
                    toast.dismiss(loadingToast)
                    if (error.code === 1) toast.error("Location permission denied")
                    else if (error.code === 3) toast.error("Location timeout, try again")
                    else toast.error("Failed to get location")
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            )
        }

        const saveLocation = (lat, lng, acc) => {
            console.log("Final Accuracy Used:", acc)
            setLocation({ latitude: lat, longitude: lng })
            localStorage.setItem("localLatitude", lat)
            localStorage.setItem("localLongitude", lng)
            localStorage.setItem("localAccuracy", acc)
            setLocationLoading(false)
        }

        tryGetLocation()
    }

    // set categories
    const allCategories = ["religious", "adventure", "waterfront", "tourist","historical","viewpoint", "nature", "wildlife","garden"]
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
        // iski jagah button ko disable bhi kr skte hai
        if (!location.latitude) {
            alert("turn on location first")
            return
        }
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
        setIsFetching(true)
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
        finally {
            setIsFetching(false)
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
        if (selectedPlaces.includes(place)) {
            updatedSelect = selectedPlaces.filter((pls) => pls._id !== place._id)
        }
        else {
            updatedSelect = [...selectedPlaces, place]
        }
        setSelectedPlaces(updatedSelect)
        console.log(updatedSelect)
    }

    // 9 api
    const getRouteFromORS = async (coords) => {
        try {
            const res = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson",
                {
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

    // 10 route generator
    const [routeCoords, setRouteCoords] = useState([])
    const [orderedPlaces, setOrderedPlaces] = useState([])
    const routeRef = useRef(null)
    const [routeLoading, setRouteLoading] = useState(false);
    const generateRoute = async () => {
        if (!location.latitude) {
            alert("Enable your location first by 'Find My location' ")
            return
        }
        // if (!location || selectedPlaces.length < 2) return

        setRouteLoading(true);
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

        setOrderedPlaces(ordered)

        setTimeout(() => {
            routeRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
        }, 200)

        setRouteLoading(false);

    }

    const [isFetching, setIsFetching] = useState(false);

    const center = location.latitude && location.longitude ? [location.latitude, location.longitude] : [25.2138, 75.9630];

    return (
        <div className="min-h-[90vh] bg-gradient-to-br from-blue-400 to-blue-200 py-5 px-4 rounded-2xl">

            {/* controllers */}
            <section className="flex flex-col lg:flex-row justify-between gap-4 md:gap-6">
                {/* user location */}
                <div className="flex flex-col gap-y-3 bg-white/50 backdrop-blur-lg p-5 rounded-2xl shadow">
                    <h3 className="text-xs text-gray-700 font-semibold tracking-[1]">LOCATION</h3>
                    <button onClick={getUserLocation} disabled={locationLoading}
                        className={`text-sm px-2 py-1 rounded-md cursor-pointer ${location.latitude ? 'bg-blue-500 text-white' : 'bg-white/60'}`}>
                        {locationLoading ? "Detecting" : location.latitude ? "Found you" : "Find My location"}
                    </button>
                </div>

                {/* distance selection */}
                <div className="flex flex-col gap-y-3 bg-white/50 backdrop-blur-lg p-5 rounded-2xl shadow flex-1">
                    <h3 className="text-xs text-gray-700 font-semibold tracking-[1]">RANGE</h3>
                    <div className="flex gap-x-4">
                        {allDistance.map((dis) => (
                            <button key={dis} onClick={() => { toggleDistance(dis) }}
                                // disabled={!location.latitude}
                                className={`text-sm px-2 py-1 rounded-md cursor-pointer ${location.latitude === null ? "text-gray-500" : "text-black"} ${distance === dis ? "bg-blue-500 text-white" : "bg-white/60"}`}
                            >{dis} km</button>
                        ))
                        }
                    </div>
                </div>

                {/* category selection */}
                <div className="flex flex-col gap-y-3 bg-white/50 backdrop-blur-lg p-5 rounded-2xl shadow flex-[1.5]">
                    <h3 className="text-xs text-gray-700 tracking-[1] font-semibold">EXPLORE BY INTEREST</h3>
                    <div className="flex flex-wrap gap-2">
                        {allCategories.map((cat) => (
                            <button key={cat} onClick={() => { toggleCategory(cat) }}
                                className={`text-sm px-2 py-1 rounded-md cursor-pointer ${categories.includes(cat) ? "bg-blue-500 text-white" : "bg-white/60"}`}
                            >{cat}</button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white/50 my-3 backdrop-blur-lg p-5 rounded-2xl shadow flex flex-col gap-y-4">

                {!sortedPlaces.length == 0 &&
                    <div className="flex items-center justify-between">

                        {/* place counter */}
                        <p className="text-sm"> <span className="px-2 py-1 rounded-full bg-red-200">{places.length}</span> Locations found</p>

                        {/* sorting buttons */}
                        {location.latitude &&
                            <div className="flex items-center bg-white/40 backdrop-blur-lg p-1 rounded-xl shadow-inner w-fit">

                                <button
                                    onClick={() => setSortType("nearest")}
                                    className={`cursor-pointer px-2 py-1 text-xs rounded-lg transition-all duration-300 
                                    ${sortType === "nearest" ? "bg-white text-black shadow font-medium scale-105" : "text-gray-600 hover:text-black"
                                        }`}>Nearest
                                </button>

                                <button
                                    onClick={() => setSortType("furthest")}
                                    className={`cursor-pointer px-2 py-1 text-xs rounded-lg transition-all duration-300 
                                    ${sortType === "furthest" ? "bg-white text-black shadow font-medium scale-105" : "text-gray-600 hover:text-black"}`}>Furthest
                                </button>

                            </div>
                        }

                    </div>
                }

                {isFetching ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-full border-4 border-blue-100"></div>
                            <div className="absolute top-0 h-12 w-12 rounded-full border-4 border-t-blue-500 border-transparent animate-spin"></div>
                        </div>
                        <p className="text-gray-500 font-medium animate-pulse">Searching nearby places...</p>
                    </div>
                ) :
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
                            {sortedPlaces.map((place) => {
                                const isSelected = selectedPlaces.some((p) => p._id === place._id);
                                return (
                                    <div
                                        key={place._id}
                                        onClick={() => toggleSelectPlace(place)}
                                        className={`group relative flex flex-col bg-white/60 rounded-4xl transition-all duration-500 p-2 cursor-pointer overflow-hidden border ${isSelected
                                            ? "ring-2 ring-green-500 border-transparent shadow-[0_25px_60px_rgba(37,99,235,0.2)] scale-[1.02]"
                                            : "shadow-sm border-gray-100 hover:shadow-xl hover:-translate-y-2"
                                            }`}
                                    >
                                        {/* Top Image & Floating Badge */}
                                        <div className="relative aspect-[12/11] overflow-hidden rounded-3xl shadow">
                                            <img
                                                src={place.images?.[0] || "/api/placeholder/400/250"}
                                                alt={place.name}
                                                className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                            />

                                            {/* Top Badge (Spicy Choice style) */}
                                            <div className="absolute top-4 left-4">
                                                <span className="flex items-center gap-1.5 backdrop-blur-[1px] bg-white/60 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-800 shadow-sm ">{place.city}</span>
                                            </div>

                                            {/* Elegant Selection Indicator */}
                                            <div className="absolute top-4 right-4">
                                                <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? "bg-green-500 border-green-500 scale-110" : "bg-black/10 border-white/40 backdrop-blur-md"
                                                    }`}>
                                                    {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Body */}
                                        <div className="px-2 py-3 flex flex-col flex-grow rounded-3xl">
                                            {/* Title & Stats Row (Recipe Card inspiration) */}
                                            <div className="mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                                    {place.name}
                                                </h3>
                                                <p className="text-[13px] text-gray-600  mt-1 leading-relaxed line-clamp-2">
                                                    {place.description}
                                                </p>
                                            </div>


                                            {/* Quick Info Bar (20 mins, 4 serving style) */}
                                            <div className="flex items-center justify-between my-1  ">
                                                <div className="flex flex-col items-center flex-1 border-r border-gray-100">
                                                    <span className="text-[10px] text-gray-400 font-bold">DISTANCE</span>
                                                    <span className="text-[12px] font-black text-gray-800 tracking-tight">{place.distance} km</span>
                                                </div>
                                                <div className="flex flex-col items-center flex-1 border-r border-gray-100">
                                                    <span className="text-[10px] text-gray-400 font-bold">STATE</span>
                                                    <span className="text-[12px] font-black text-gray-800 tracking-tight truncate px-1 w-full text-center">{place.state}</span>
                                                </div>
                                                {/* <div className="flex flex-col items-center flex-1">
                                                    <span className="text-[10px] text-gray-400 font-bold">EXP</span>
                                                    <span className="text-[12px] font-black text-gray-800 tracking-tight">Expert</span>
                                                </div> */}
                                            </div>

                                            {/* Tags (Yogurt, Olive Oil style) */}
                                            <div className="flex flex-wrap gap-2 my-3">
                                                {place.categories?.slice(0, 3).map((cat) => (
                                                    <span key={cat} className="text-[10px] font-bold text-gray-700 bg-white/70 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors capitalize">
                                                        {cat}
                                                    </span>
                                                ))}
                                                {place.categories?.length > 2 && <span className="text-[10px] font-bold text-gray-400  bg-gray-50 px-3 py-1.5 rounded-full">+2</span>}
                                            </div>


                                            {/* Action Button (Start Cooking style) */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); router.push(`/places/${place._id}`); }}
                                                className="w-full bg-black text-white py-3 rounded-2xl font-semibold hover:bg-gray-900 transition-all active:scale-95 cursor-pointer"
                                            >
                                                Explore Now

                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                }
            </section>

            {/* floating route button */}
            {selectedPlaces.length >= 1 && selectedPlaces.length !== orderedPlaces.length && (
                <div className="flex justify-center">
                    <button onClick={generateRoute} className="z-3 pop-animation fixed bottom-8 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl cursor-pointer" >
                        {routeLoading ? (
                            <>
                                {/* Spinner Icon */}
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>

                            </>
                        ) : (
                            "Generate Route"
                        )} </button>
                </div>
            )}

            {/* map section */}
            <section className="my-3" >
                <DynamicMap places={selectedPlaces} center={center} route={routeCoords}
                    userLocation={location.latitude && location.longitude ? { lat: location.latitude, lng: location.longitude } : null} />
            </section>

            <section ref={routeRef}>
                {orderedPlaces.length > 0 && (
                    <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg mt-4">
                        <h2 className="font-bold mb-8 text-lg md:text-xl text-gray-800 tracking-tight text-center md:text-left">
                            Your Route Plan
                        </h2>

                        {/* Stepper Container: Mobile pe Column, Desktop pe Row */}
                        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-8 md:gap-0">

                            {/* Connector Line: Desktop (Horizontal) */}
                            <div className="hidden md:block absolute top-5 left-0 w-full h-[2px] bg-gray-200 -z-0" />

                            {/* Connector Line: Mobile (Vertical) */}
                            <div className="absolute left-5 top-0 w-[2px] h-full bg-gray-200 md:hidden -z-0" />

                            {/* --- STEP 1: USER LOCATION --- */}
                            <div className="relative z-10 flex flex-row md:flex-col items-center md:items-center flex-1 w-full">
                                {/* Circle */}
                                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-indigo-600 border-2 border-indigo-600 text-white shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                {/* Text: Mobile pe side mein, Desktop pe niche */}
                                <div className="ml-4 md:ml-0 md:mt-3 text-left md:text-center">
                                    <div className="text-sm font-bold text-gray-900 leading-tight">Your Location</div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Starting Point</div>
                                </div>

                                {/* Active Progress Line (Desktop only) */}
                                <div className="hidden md:block absolute top-5 left-1/2 w-full h-[2px] bg-indigo-600 -z-10" />
                            </div>

                            {/* --- DYNAMIC PLACES --- */}
                            {orderedPlaces.map((place, i) => {
                                const stepNumber = i + 2;
                                const isActive = i === 0;
                                const isLast = i === orderedPlaces.length - 1;

                                return (
                                    <div key={place._id} className="relative z-10 flex flex-row md:flex-col items-center md:items-center flex-1 w-full">

                                        {/* Step Circle */}
                                        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold ${isActive ? 'bg-white border-indigo-600 ring-4 ring-indigo-100 text-indigo-600' : 'bg-white border-gray-300 text-gray-400'}`}>
                                            {String(stepNumber).padStart(2, '0')}
                                        </div>

                                        {/* Text Details */}
                                        <div className="ml-4 md:ml-0 md:mt-3 text-left md:text-center">
                                            <div className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-500'} leading-tight`}>
                                                {place.name}
                                            </div>
                                            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                                                {isLast ? "Last Stop" : `Stop ${i + 1}`}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}