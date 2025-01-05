"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [userData, setUserData] = useState({
        name: "",
        bio: "",
        skills: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [otherUsers, setOtherUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
        } else {
            fetchUserData(token);
        }
    }, [router]);

    const fetchUserData = async (token) => {
        try {
            const res = await fetch("/api/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                setUserData(data.user);
            } else {
                setError(data.message || "Failed to load profile.");
            }
        } catch (err) {
            setError("Failed to load profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/users?name=${searchQuery}`);
            const data = await res.json();

            if (res.ok) {
                setOtherUsers(data.users);
            } else {
                setError(data.message || "No users found.");
            }
        } catch (err) {
            setError("Search failed. Please try again later.");
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to edit your profile.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Profile updated successfully!");
                setIsEditing(false);
                setUserData(data.user);
            } else {
                setError(data.message || "Failed to update profile.");
            }
        } catch (err) {
            setError("Profile update failed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>

                {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Name: {userData.name}</h3>
                        <button
                            className="bg-blue-500 text-white py-1 px-4 rounded"
                            onClick={handleEditToggle}
                        >
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    <p className="mt-2">Bio: {userData.bio}</p>
                    <p className="mt-2">Skills: {userData.skills}</p>
                </div>

                {isEditing && (
                    <form onSubmit={handleSubmitEdit} className="mt-4">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={userData.bio}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="skills" className="block text-gray-700 font-medium mb-2">
                                Skills
                            </label>
                            <input
                                type="text"
                                id="skills"
                                name="skills"
                                value={userData.skills}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg"
                        >
                            Save Changes
                        </button>
                    </form>
                )}

                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Search for Other Users</h3>
                    <form onSubmit={handleSearchSubmit} className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full mt-2 bg-blue-500 text-white py-2 rounded-lg"
                        >
                            Search
                        </button>
                    </form>

                    {otherUsers.length > 0 && (
                        <div>
                            <h4 className="text-lg font-semibold">Found Users:</h4>
                            <ul className="list-disc pl-6">
                                {otherUsers.map((user) => (
                                    <li key={user._id}>
                                        <a href={`/profile/${user._id}`} className="text-blue-600 hover:underline">
                                            {user.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
