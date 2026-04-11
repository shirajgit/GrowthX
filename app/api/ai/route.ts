import { NextResponse } from "next/server";

// Models
import Task from "@/models/Task";
import Project from "@/models/Project";
import Client from "@/models/Client";
import Job from "@/models/Job";
import Chat from "@/models/chat"; // 👈 create this

import { connectDB } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const { userId } = await auth();

    if (!message || !userId) {
      return NextResponse.json(
        { reply: "Missing message or userId" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🔥 FETCH USER DATA
    const [tasks, projects, clients, jobs] = await Promise.all([
      Task.find({ userId }).lean(),
      Project.find({ userId }).lean(),
      Client.find({ userId }).lean(),
      Job.find({ userId }).lean(),
    ]);

    // 🔥 CLEAN DATA
    const cleanedData = {
      tasks: tasks.map((t: any) => ({
        title: t.title,
        status: t.status,
      })),
      projects: projects.map((p: any) => p.name),
      clients: clients.map((c: any) => c.name),
      jobs: jobs.map((j: any) => j.title),
    };

    // 🧠 FETCH CHAT MEMORY (last 6 msgs)
    const history = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const formattedHistory = history
      .reverse()
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

    // 🤖 AI CALL
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
You are GrowthX AI — a human-like personal assistant.

You behave like:
- A smart friend
- A senior developer mentor
- A productivity coach

RULES:
- You already know the user's data
- Never ask for it again
- Speak naturally like a human
- Be concise but helpful

Behavior:
- If user asks about work → use their real data
- If user asks general question → answer normally
- If user seems confused → guide gently
- If user asks "what should I do" → give clear direction

Tone:
- Friendly
- Natural
- Slightly conversational
- Not robotic

Avoid:
- Over-structured responses
- Repeating same phrases
- Saying "based on your data" every time
            `,
          },

          // 🧠 MEMORY
          ...formattedHistory,

          // 📊 USER DATA CONTEXT
          {
            role: "user",
            content: `
Here is my current data:
${JSON.stringify(cleanedData, null, 2)}
            `,
          },

          // 💬 CURRENT MESSAGE
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await res.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "⚠️ AI couldn't respond";

    // 💾 SAVE CHAT MEMORY
    await Chat.create([
      { userId, role: "user", content: message },
      { userId, role: "assistant", content: reply },
    ]);

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("AI Error:", error);

    return NextResponse.json(
      { reply: "⚠️ Something went wrong" },
      { status: 500 }
    );
  }
}