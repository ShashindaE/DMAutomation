import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const agentSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  model: z.string().min(1),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().min(100).max(4000),
  systemPrompt: z.string().min(10),
  capabilities: z.array(z.string()).min(1),
});

export async function POST(
  req: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = agentSchema.parse(json);

    const workspace = await db.workspace.findUnique({
      where: {
        id: params.workspaceId,
        userId: user.id,
      },
    });

    if (!workspace) {
      return new NextResponse('Workspace not found', { status: 404 });
    }

    const agent = await db.agent.create({
      data: {
        ...body,
        workspaceId: workspace.id,
        active: true,
      },
    });

    return NextResponse.json(agent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const workspace = await db.workspace.findUnique({
      where: {
        id: params.workspaceId,
        userId: user.id,
      },
      include: {
        agents: true,
      },
    });

    if (!workspace) {
      return new NextResponse('Workspace not found', { status: 404 });
    }

    return NextResponse.json(workspace.agents);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
