// "use client"
// import authGuard from "@/hooks/authGuard"
// import { useEffect, useState } from "react";

// export default function Dashboard() {
//     authGuard("admin")
//     const categoryOptions = ["tourist", "religious", "adventure", "historical", "nature", "waterfront", "garden", "wildlife", "viewpoint"]

//     const [places, setPlaces] = useState([]);
//     const [form, setForm] = useState({ name: "", description: "", city: "", state: "", latitude: "", longitude: "", highlights: "", images: "", categories: [] })

//     const [editId, setEditId] = useState(null)

//     // get all places
//     const fetchPlaces = async () => {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/places`);
//         const data = await res.json();
//         console.log(data)
//         setPlaces(data || []);
//     }

//     useEffect(() => {
//         fetchPlaces();
//     }, []);

//     const handleDelete = async (id) => {
//         if (!confirm("Delete this place?")) return;
//         try {
//             await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/places/del/${id}`, {
//                 method: "DELETE",
//             });

//             fetchPlaces();
//         }
//         catch (error) {
//             console.log(error)
//         }
//     };

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value })
//     }

//     const toggleCategory = (category) => {
//         if (form.categories.includes(category)) {
//             setForm({ ...form, categories: form.categories.filter((cat) => cat !== category) })
//         }
//         else {
//             setForm({ ...form, categories: [...form.categories, category] })
//         }
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         if (
//             form.latitude < -90 || form.latitude > 90 ||
//             form.longitude < -180 || form.longitude > 180
//         ) {
//             alert("Invalid coordinates")
//             return
//         }

//         const payload = { ...form, highlights: form.highlights.split(","), images: form.images.split(",") }
//         console.log("payload", payload)

//         if (editId) {
//             await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/places/update/${editId}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload)
//             })
//         }
//         else {
//             await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/places/create`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload)
//             })
//         }

//         fetchPlaces();
//         setEditId(null)
//         setForm({ name: "", description: "", city: "", state: "", latitude: "", longitude: "", highlights: "", images: "", categories: [] })
//     }

//     const handleUpdate = (place) => {
//         setEditId(place._id)
//         setForm({ name: place.name || "", description: place.description || "", city: place.city || "", state: place.state || "", latitude: place.location?.coordinates[1] || "", longitude: place.location?.coordinates[0] || "", highlights: place.highlights?.join(",") || "", images: place.images?.join(",") || "", categories: place.categories || [] })
//     }

//     return (
//         <div className="p-6">
//             <h1 className="text-xl font-semibold mb-3">Admin Dashboard</h1>
//             <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3 mb-6">
//                 <input name="name" value={form.name} placeholder="Name" required onChange={handleChange} className="border p-2 rounded" />
//                 <input name="city" value={form.city} placeholder="City" required onChange={handleChange} className="border p-2 rounded" />
//                 <input name="state" value={form.state} placeholder="State" required onChange={handleChange} className="border p-2 rounded" />
//                 <input name="description" value={form.description} placeholder="Description" required onChange={handleChange} className="border p-2 rounded col-span-3" />
//                 <input name="latitude" value={form.latitude} placeholder="Latitude" required onChange={handleChange} className="border p-2 rounded" />
//                 <input name="highlights" value={form.highlights} placeholder="Highlights (use comma)" onChange={handleChange} className="border p-2 rounded col-span-2" />
//                 <input name="longitude" value={form.longitude} placeholder="Longitude" required onChange={handleChange} className="border p-2 rounded" />
//                 <input name="images" value={form.images} placeholder="Images (use comma)" onChange={handleChange} className="border p-2 col-span-2 rounded" />

//                 <div className="col-span-2">
//                     <div className="flex gap-2">
//                         {
//                             categoryOptions.map((option) => (
//                                 <button type="button" key={option} onClick={() => toggleCategory(option)}
//                                     className={`px-2 py-1 border rounded text-sm ${form.categories.includes(option) ? "bg-blue-300" : "bg-gray-300"}`}>{option}</button>
//                             ))
//                         }
//                     </div>
//                 </div>
//                 <button type="submit" className="bg-black text-white font-semibold p-2 rounded-xl hover:bg-gray-800 cursor-pointer">
//                     {editId ? "Update place" : "Add place"}
//                 </button>
//             </form>

//             <table className="w-full border rounded">
//                 <thead>
//                     <tr className="bg-gray-200">
//                         <th className="border p-2">Name</th>
//                         <th className="border p-2">City</th>
//                         <th className="border p-2">State</th>
//                         <th className="border p-2">Categories</th>
//                         <th className="border p-2">Highlights</th>
//                         <th className="border p-2">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {places.map((place) => (
//                         <tr key={place._id}>
//                             <td className="border p-2">{place.name}</td>
//                             <td className="border p-2">{place.city}</td>
//                             <td className="border p-2">{place.state}</td>
//                             <td className="border p-2">{place.categories?.join(", ")}</td>
//                             <td className="border p-2">{place.highlights?.join(", ")}</td>

//                             <td className="border p-2 flex gap-2">
//                                 <button onClick={() => handleUpdate(place)} className="bg-yellow-400 px-2">Update</button>
//                                 <button onClick={() => handleDelete(place._id)} className="bg-red-500 text-white px-2">Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }



"use client"
import authGuard from "@/hooks/authGuard"
import { useEffect, useState } from "react";

export default function Dashboard() {
    authGuard("admin")
    const categoryOptions = ["tourist", "religious", "adventure", "historical", "nature", "waterfront", "garden", "wildlife", "viewpoint"]

    const [places, setPlaces] = useState([]);
    const [form, setForm] = useState({ name: "", description: "", city: "", state: "", latitude: "", longitude: "", highlights: "", images: "", categories: [] })
    const [editId, setEditId] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchPlaces = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/places`);
        const data = await res.json();
        setPlaces(data || []);
    }

    useEffect(() => {
        fetchPlaces();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this place?")) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/places/del/${id}`, { method: "DELETE" });
            fetchPlaces();
        } catch (error) { console.log(error) }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const toggleCategory = (category) => {
        setForm(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(cat => cat !== category)
                : [...prev.categories, category]
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (form.latitude < -90 || form.latitude > 90 || form.longitude < -180 || form.longitude > 180) {
            alert("Invalid coordinates");
            setLoading(false);
            return;
        }

        const payload = {
            ...form,
            highlights: typeof form.highlights === 'string' ? form.highlights.split(",").map(s => s.trim()) : form.highlights,
            images: typeof form.images === 'string' ? form.images.split(",").map(s => s.trim()) : form.images
        }

        const url = editId
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/places/update/${editId}`
            : `${process.env.NEXT_PUBLIC_BASE_URL}/places/create`;

        await fetch(url, {
            method: editId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })

        fetchPlaces();
        setEditId(null)
        setForm({ name: "", description: "", city: "", state: "", latitude: "", longitude: "", highlights: "", images: "", categories: [] })
        setLoading(false)
    }

    const handleUpdate = (place) => {
        setEditId(place._id)
        setForm({
            name: place.name || "",
            description: place.description || "",
            city: place.city || "",
            state: place.state || "",
            latitude: place.location?.coordinates[1] || "",
            longitude: place.location?.coordinates[0] || "",
            highlights: place.highlights?.join(", ") || "",
            images: place.images?.join(", ") || "",
            categories: place.categories || []
        })
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin <span className="text-blue-600">Console</span></h1>
                    <p className="text-gray-500 text-sm">Manage your world-class travel destinations</p>
                </header>

                {/* Glassmorphic Form Container */}
                <section className="bg-white/70 backdrop-blur-md border border-white rounded-3xl shadow-xl p-6 mb-10">
                    <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                        {editId ? "📝 Edit Destination" : "✨ Add New Destination"}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="name" value={form.name} placeholder="Place Name" required onChange={handleChange} className="bg-white border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        <input name="city" value={form.city} placeholder="City" required onChange={handleChange} className="bg-white border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        <input name="state" value={form.state} placeholder="State" required onChange={handleChange} className="bg-white border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />

                        <textarea name="description" value={form.description} placeholder="Describe the magic of this place..." required onChange={handleChange} className="md:col-span-3 bg-white border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24" />

                        <input name="latitude" value={form.latitude} placeholder="Lat (e.g. 26.12)" required onChange={handleChange} className="bg-white border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        <input name="longitude" value={form.longitude} placeholder="Lng (e.g. 75.85)" required onChange={handleChange} className="bg-white border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />

                        <div className="md:col-span-3 space-y-3">
                            <input name="highlights" value={form.highlights} placeholder="Highlights (Fort, Lake, Food...)" onChange={handleChange} className="w-full bg-white border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            <input name="images" value={form.images} placeholder="Image URLs (comma separated)" onChange={handleChange} className="w-full bg-white border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>

                        <div className="md:col-span-3">
                            <label className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-2 block">Select Categories</label>
                            <div className="flex flex-wrap gap-2">
                                {categoryOptions.map((option) => (
                                    <button type="button" key={option} onClick={() => toggleCategory(option)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${form.categories.includes(option) ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" : "bg-white text-gray-500 border-gray-200 hover:border-blue-300"}`}>{option}</button>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                            {editId && (
                                <button type="button" onClick={() => { setEditId(null); setForm({ name: "", description: "", city: "", state: "", latitude: "", longitude: "", highlights: "", images: "", categories: [] }) }} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
                            )}
                            <button type="submit" disabled={loading} className="bg-gray-900 text-white font-bold px-10 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 active:scale-95 disabled:opacity-50">
                                {loading ? "Processing..." : editId ? "Update Destination" : "Create Destination"}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Table for Desktop / Cards for Mobile */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left hidden md:table">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-bold text-gray-600 text-sm">Destination</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm">Location</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm">Categories</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {places.map((place) => (
                                    <tr key={place._id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{place.name}</div>
                                            <div className="text-xs text-gray-400 line-clamp-1">{place.description}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{place.city}, {place.state}</td>
                                        <td className="p-4">
                                            <div className="flex gap-1">
                                                {place.categories?.slice(0, 2).map(c => (
                                                    <span key={c} className="bg-gray-100 text-[10px] px-2 py-0.5 rounded text-gray-500 uppercase font-bold">{c}</span>
                                                ))}
                                                {place.categories?.length > 2 && <span className="text-[10px] text-gray-400">+{place.categories.length - 2}</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 ">
                                            <button onClick={() => handleUpdate(place)} className=" text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-all mr-2">Update</button>
                                            <button onClick={() => handleDelete(place._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Card View */}
                        <div className="md:hidden grid grid-cols-1 divide-y divide-gray-100">
                            {places.map((place) => (
                                <div key={place._id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{place.name}</h3>
                                            <p className="text-xs text-gray-500">{place.city}, {place.state}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleUpdate(place)} className="p-2 bg-blue-50 text-blue-600 rounded-lg">Update</button>
                                            <button onClick={() => handleDelete(place._id)} className="p-2 bg-red-50 text-red-500 rounded-lg">Del</button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {place.categories?.map(c => (
                                            <span key={c} className="text-[9px] bg-gray-100 px-2 py-0.5 rounded font-bold uppercase text-gray-500">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}