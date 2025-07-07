import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/follow-ups  创建跟进
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const created = await prisma.followUp.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'failed to create' }, { status: 500 });
  }
}

// GET /api/follow-ups  获取全部
export async function GET() {
  const list = await prisma.followUp.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(list);
}

// DELETE /api/follow-ups?id=xxx
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  try {
    await prisma.followUp.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'failed to delete' }, { status: 500 });
  }
} 