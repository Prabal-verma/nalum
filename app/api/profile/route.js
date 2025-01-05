import dbConnect from "@/lib/mongoDb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret"; // Replace with a secure environment variable

export async function POST(req) {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];

        if (!token) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        await dbConnect();

        const { name, bio, skills } = await req.json();

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, bio, skills },
            { new: true }
        );

        if (!updatedUser) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Profile updated successfully", user: updatedUser }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating profile:", error);
        return new Response(
            JSON.stringify({ message: "Internal server error", error }),
            { status: 500 }
        );
    }
}
