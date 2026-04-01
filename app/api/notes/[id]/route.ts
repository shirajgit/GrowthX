import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";

// DELETE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  await Note.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted" });
}

// UPDATE (optional)
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;
  const body = await req.json();

  const updated = await Note.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}