import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";

// GET (load settings)
export async function GET() {
  await connectDB();

  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({
      name: "Shiraj",
      email: "",
      theme: "dark",
    });
  }

  return NextResponse.json(settings);
}

// UPDATE (save settings)
export async function PUT(req: Request) {
  await connectDB();

  const body = await req.json();

  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create(body);
  } else {
    settings = await Setting.findByIdAndUpdate(
      settings._id,
      body,
      { new: true }
    );
  }

  return NextResponse.json(settings);
}