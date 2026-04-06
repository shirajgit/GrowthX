import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobs = await Job.find({ userId }).sort({ createdAt: -1 });

  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  await connectDB();

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const job = await Job.create({
    ...body,
    userId,
  });

  return NextResponse.json(job);
}