import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { auth } from "@clerk/nextjs/server";

// GET
export async function GET() {
   
   await connectDB();
  
    const { userId } =  await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await Client.find().sort({ createdAt: -1 });
  return NextResponse.json(clients);
}

// POST
export async function POST(req: Request) {
 await connectDB();

  const { userId } =  await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  const client = await Client.create(body);

  return NextResponse.json(client);
}