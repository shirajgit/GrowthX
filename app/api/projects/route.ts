import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Project from "@/models/Project";

export async function GET() {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notes = await Project.find({ userId }).sort({ createdAt: -1 });

  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  await connectDB();

  const { userId } =  await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const note = await Project.create({
    ...body,
    userId,
  });

  return NextResponse.json(note);
}