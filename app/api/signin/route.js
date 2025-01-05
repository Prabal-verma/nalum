import bcrypt from "bcrypt";
import User from "@/models/User";
import dbConnect from "@/lib/mongoDb";

export async function POST(req) {
    try {
        // Parse request body
        const { email, password } = await req.json();

        // Check if email or password is missing
        if (!email || !password) {
            return new Response(
                JSON.stringify({ message: "Email and password are required" }),
                { status: 400 }
            );
        }

        // Connect to the database
        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new Response(
                JSON.stringify({ message: "Invalid email or password" }),
                { status: 401 }
            );
        }

        // Proceed with login logic (e.g., generate JWT)
        // For now, just send a success response
        return new Response(
            JSON.stringify({ message: "Login successful", userId: user._id }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Internal server error" }),
            { status: 500 }
        );
    }
}
