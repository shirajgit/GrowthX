import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { auth } from "@clerk/nextjs/server";

// ================= UPDATE TASK =================
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { userId } =  await auth();
    if (!userId)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

    const body = await req.json();

    const task = await Task.findOneAndUpdate(
      { _id: params.id, userId }, // ✅ secure
      body,
      { new: true }
    );

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// ================= DELETE TASK =================
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId)
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

    await Task.findOneAndDelete({
      _id: params.id,
      userId, // ✅ secure
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}