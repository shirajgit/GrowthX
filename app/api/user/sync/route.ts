import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    await connectDB();

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const clerkId = clerkUser.id;

    const data = {
      clerkId,
      name: clerkUser.fullName,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      image: clerkUser.imageUrl,
    };

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create(data);
    } else {
      user = await User.findOneAndUpdate(
        { clerkId },
        data,
        { new: true }
      );
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}