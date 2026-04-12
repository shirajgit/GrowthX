import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST() {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "No userId" }, { status: 401 });
    }

    const user = await currentUser();

    const existing = await User.findOne({ clerkId: userId });

    if (existing) {
      return NextResponse.json(existing);
    }

    const newUser = await User.create({
      clerkId: userId,
      name: user?.firstName || "User",
      email: user?.emailAddresses?.[0]?.emailAddress,
    });

    return NextResponse.json(newUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

