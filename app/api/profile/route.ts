import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";
import { auth } from "@clerk/nextjs/server";

// ✅ GET PROFILE (per user)
export async function GET() {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let profile = await Setting.findOne({ userId });

    // 🔥 Auto-create profile from Clerk
    if (!profile) {
      profile = await Setting.create({
        userId,
        name: "New User",
        email: "",
        theme: "dark",
      });
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ UPDATE PROFILE
export async function PUT(req: Request) {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    let profile = await Setting.findOne({ userId });

    if (!profile) {
      profile = await Setting.create({
        userId,
        ...body,
      });
    } else {
      profile = await Setting.findOneAndUpdate(
        { userId },
        body,
        { new: true }
      );
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}