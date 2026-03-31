import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Leads from "@/models/Leads";
 

// GET all leads
export async function GET() {
  await connectDB();
  const leads = await Leads.find().sort({ createdAt: -1 });
  return NextResponse.json(leads);
}

// CREATE lead
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const lead = await Leads.create(body);

  return NextResponse.json(lead);
}