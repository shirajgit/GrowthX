import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";

// DELETE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  await Client.findByIdAndDelete(id);

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

  const updated = await Client.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}