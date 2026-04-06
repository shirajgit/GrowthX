import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Lead from "@/models/Leads";

export async function GET() {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await Lead.find({ userId });

    return NextResponse.json(leads);
  } catch (err) {
    return NextResponse.json({ error: "Error fetching leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const newLead = await Lead.create({
      ...body,
      userId, // 🔥 attach user
    });

    return NextResponse.json(newLead);
  } catch (err) {
    return NextResponse.json({ error: "Error creating lead" }, { status: 500 });
  }
}