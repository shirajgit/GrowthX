import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId } = await auth();
 
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const task = await Task.create({
      title: body.title,
      status: "todo",
      userId,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}