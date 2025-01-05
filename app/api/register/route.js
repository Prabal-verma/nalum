import dbConnect from '@/lib/mongoDb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return new Response(
                JSON.stringify({ message: 'All fields are required' }),
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        return new Response(
            JSON.stringify({ message: 'User registered successfully' }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in registration:', error);
        return new Response(
            JSON.stringify({ message: 'Error registering user', error }),
            { status: 500 }
        );
    }
}
