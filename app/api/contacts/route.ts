import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/contacts?id=xxx  删除联系人
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  try {
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'failed to delete' }, { status: 500 });
  }
} 