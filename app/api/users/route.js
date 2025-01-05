import dbConnect from "@/lib/mongoDb";
import User from "@/models/User";

export async function GET(req) {
    const { name } = req.url.searchParams;

    await dbConnect();
    const users = await User.find({ name: { $regex: name, $options: "i" } });

    return new Response(
        JSON.stringify({ users }),
        { status: 200 }
    );
}
