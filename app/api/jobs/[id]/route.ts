import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

// DELETE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  await Job.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted" });
}

// UPDATE (optional but useful)
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;
  const body = await req.json();

  const updated = await Job.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}