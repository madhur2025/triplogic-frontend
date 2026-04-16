"use client"
import authGuard from "@/hooks/authGuard"
import { useEffect, useState } from "react";

export default function Dashboard() {
    authGuard("admin")
    const categoryOptions = ["tourist", "religious", "adventure", "historical", "nature", "waterfront", "garden", "wildlife", "viewpoint"]

    const [places, setPlaces] = useState([]);
    const [form, setForm] = useState({ name: "", description: "", city: "", state: "", latitude: "", longitude: "", highlights: "", images: "", categories: [] })

    const [editId, setEditId] = useState(null)

    // get all places
    const fetchPlaces = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/places`);
        const data = await res.json();
        console.log(data)
        setPlaces(data || []);
    }

    useEffect(() => {
        fetchPlaces();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this place?")) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/places/del/${id}`, {
                method: "DELETE",
            });

            fetchPlaces();
        }
        catch (error) {
            console.log(error)
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const toggleCategory = (category) => {
        if (form.categories.includes(category)) {
            setForm({ ...form, categories: form.categories.filter((cat) => cat !== category) })
        }
        else {
            setForm({ ...form, categories: [...form.categories, category] })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (
            form.latitude < -90 || form.latitude > 90 ||
            form.longitude < -180 || form.longitude > 180
        ) {
            alert("Invalid coordinates")
            return
        }

        const payload = { ...form, highlights: form.highlights.split(","), images: form.images.split(",") }
        console.log("payload", payload)

        if (editId) {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/places/update/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
        }
        else {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/places/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
        }

        fetchPlaces();
        setEditId(null)
        setForm({ name: "", description: "", city: "", state: "", latitude: "", longitude: "", highlights: "", images: "", categories: [] })
    }

    const handleUpdate = (place) => {
        setEditId(place._id)
        setForm({ name: place.name || "", description: place.description || "", city: place.city || "", state: place.state || "", latitude: place.location?.coordinates[1] || "", longitude: place.location?.coordinates[0] || "", highlights: place.highlights?.join(",") || "", images: place.images?.join(",") || "", categories: place.categories || [] })
    }

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-3">Admin Dashboard</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3 mb-6">
                <input name="name" value={form.name} placeholder="Name" required onChange={handleChange} className="border p-2 rounded" />
                <input name="city" value={form.city} placeholder="City" required onChange={handleChange} className="border p-2 rounded" />
                <input name="state" value={form.state} placeholder="State" required onChange={handleChange} className="border p-2 rounded" />
                <input name="description" value={form.description} placeholder="Description" required onChange={handleChange} className="border p-2 rounded col-span-3" />
                <input name="latitude" value={form.latitude} placeholder="Latitude" required onChange={handleChange} className="border p-2 rounded" />
                <input name="highlights" value={form.highlights} placeholder="Highlights (use comma)" onChange={handleChange} className="border p-2 rounded col-span-2" />
                <input name="longitude" value={form.longitude} placeholder="Longitude" required onChange={handleChange} className="border p-2 rounded" />
                <input name="images" value={form.images} placeholder="Images (use comma)" onChange={handleChange} className="border p-2 col-span-2 rounded" />

                <div className="col-span-2">
                    <div className="flex gap-2">
                        {
                            categoryOptions.map((option) => (
                                <button type="button" key={option} onClick={() => toggleCategory(option)}
                                    className={`px-2 py-1 border rounded text-sm ${form.categories.includes(option) ? "bg-blue-300" : "bg-gray-300"}`}>{option}</button>
                            ))
                        }
                    </div>
                </div>
                <button type="submit" className="bg-black text-white font-semibold p-2 rounded-xl hover:bg-gray-800 cursor-pointer">
                    {editId ? "Update place" : "Add place"}
                </button>
            </form>

            <table className="w-full border rounded">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">City</th>
                        <th className="border p-2">State</th>
                        <th className="border p-2">Categories</th>
                        <th className="border p-2">Highlights</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {places.map((place) => (
                        <tr key={place._id}>
                            <td className="border p-2">{place.name}</td>
                            <td className="border p-2">{place.city}</td>
                            <td className="border p-2">{place.state}</td>
                            <td className="border p-2">{place.categories?.join(", ")}</td>
                            <td className="border p-2">{place.highlights?.join(", ")}</td>

                            <td className="border p-2 flex gap-2">
                                <button onClick={() => handleUpdate(place)} className="bg-yellow-400 px-2">Update</button>
                                <button onClick={() => handleDelete(place._id)} className="bg-red-500 text-white px-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}