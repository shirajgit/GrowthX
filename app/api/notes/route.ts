import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note";

// GET all notes
export async function GET() {
  await connectDB();
  const notes = await Note.find().sort({ createdAt: -1 });
  return NextResponse.json(notes);
}

// CREATE note
export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const note = await Note.create(body);

  return NextResponse.json(note);
}