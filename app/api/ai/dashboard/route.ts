import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import Task from "@/models/Task";
import Project from "@/models/Project";
import Client from "@/models/Client";
import Job from "@/models/Job";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [tasks, projects, clients, jobs] = await Promise.all([
      Task.find({ userId }).lean(),
      Project.find({ userId }).lean(),
      Client.find({ userId }).lean(),
      Job.find({ userId }).lean(),
    ]);

    const cleanedData = {
      tasks: tasks.map((t: any) => ({
        title: t.title,
        status: t.status,
      })),
      projects: projects.map((p: any) => p.name),
      clients: clients.map((c: any) => c.name),
      jobs: jobs.map((j: any) => j.title),
    };

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
You are GrowthX AI.

Analyze the user data and return JSON only.

Return format:
{
  "summary": "short human insight",
  "priorities": ["task1", "task2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "score": number (0-100),
  "insight": "growth insight"
}
            `,
          },
          {
            role: "user",
            content: JSON.stringify(cleanedData),
          },
        ],
      }),
    });

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        summary: "AI analysis unavailable",
        priorities: [],
        suggestions: [],
        score: 50,
        insight: "",
      };
    }

    return NextResponse.json(parsed);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}