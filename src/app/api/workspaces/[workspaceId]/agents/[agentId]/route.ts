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
  active: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { workspaceId: string; agentId: string } }
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

    const agent = await db.agent.findUnique({
      where: {
        id: params.agentId,
        workspaceId: workspace.id,
      },
    });

    if (!agent) {
      return new NextResponse('Agent not found', { status: 404 });
    }

    const updatedAgent = await db.agent.update({
      where: {
        id: params.agentId,
      },
      data: body,
    });

    return NextResponse.json(updatedAgent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { workspaceId: string; agentId: string } }
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
    });

    if (!workspace) {
      return new NextResponse('Workspace not found', { status: 404 });
    }

    const agent = await db.agent.findUnique({
      where: {
        id: params.agentId,
        workspaceId: workspace.id,
      },
    });

    if (!agent) {
      return new NextResponse('Agent not found', { status: 404 });
    }

    await db.agent.delete({
      where: {
        id: params.agentId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { workspaceId: string; agentId: string } }
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
    });

    if (!workspace) {
      return new NextResponse('Workspace not found', { status: 404 });
    }

    const agent = await db.agent.findUnique({
      where: {
        id: params.agentId,
        workspaceId: workspace.id,
      },
      include: {
        metrics: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
        conversations: {
          orderBy: {
            startedAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!agent) {
      return new NextResponse('Agent not found', { status: 404 });
    }

    return NextResponse.json(agent);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
