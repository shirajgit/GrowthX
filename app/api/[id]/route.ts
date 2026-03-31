import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";

// UPDATE
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;
  const body = await req.json();

  const updated = await Task.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updated);
} 


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params; // ✅ FIX

  await Task.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted" });
}