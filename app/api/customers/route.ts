import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST  /api/customers  新建客户以及联系人
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { contacts = [], followUps = [], ...customer } = data;

    // 检查是否已存在同名客户
    const existing = await prisma.customer.findUnique({ where: { name: customer.name } });

    if (existing) {
      // 去重：移除与现有完全一致的联系人
      let toCreateContacts = contacts;
      if (contacts.length) {
        const existingContacts = await prisma.contact.findMany({ where: { customerId: existing.id } });
        toCreateContacts = contacts.filter((c: any) => {
          return !existingContacts.some((ec: any) => ec.name === c.name && ec.position === c.position && ec.phone === c.phone);
        });
      }

      const updated = await prisma.customer.update({
        where: { id: existing.id },
        data: {
          ...customer, // 覆盖个人信息字段
          contacts: toCreateContacts.length ? { create: toCreateContacts } : undefined,
          followUps: followUps.length ? { create: followUps } : undefined,
        },
        include: { contacts: true, followUps: true },
      });
      return NextResponse.json(updated);
    }

    const created = await prisma.customer.create({
      data: {
        ...customer,
        contacts: contacts.length ? { create: contacts } : undefined,
        followUps: followUps.length ? { create: followUps } : undefined,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'failed to create' }, { status: 500 });
  }
}

// GET /api/customers?keyword=xxx  按名称查询客户
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword') || '';
  const data = await prisma.customer.findMany({
    where: keyword ? { name: { contains: keyword } } : undefined,
    include: { contacts: true, followUps: true },
  });
  return NextResponse.json(data);
}

// DELETE /api/customers?id=xxx  删除客户及其关联数据
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'missing id' }, { status: 400 });
  }

  try {
    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'failed to delete' }, { status: 500 });
  }
} 