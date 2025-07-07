import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ExportButton from '@/app/ui/customers/export-button';
import FollowUpItem from '@/app/ui/followups/item';
import ContactRow from '@/app/ui/contacts/row';

interface LocalPageProps<T> { params: T; searchParams?: { [key: string]: string | string[] | undefined } }

export default async function CustomerDetailPage({ params }: any) {
  // 先取出联系人并去重
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: { contacts: { orderBy: { id: 'asc' } }, followUps: { orderBy: { createdAt: 'desc' } } },
  });

  if (!customer) return notFound();

  // 删除重复联系人（姓名+职位+电话完全一致）
  const seen = new Set<string>();
  const dupIds: string[] = [];
  customer.contacts.forEach((c: any) => {
    const key = `${c.name}|${c.position}|${c.phone}`;
    if (seen.has(key)) dupIds.push(c.id);
    else seen.add(key);
  });

  if (dupIds.length) {
    await prisma.contact.deleteMany({ where: { id: { in: dupIds } } });
    // 重新获取去重后的联系人
    customer.contacts = customer.contacts.filter((c: any) => !dupIds.includes(c.id));
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <section>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold">{customer.name}</h1>
          {/* 一键导出 */}
          <ExportButton customer={customer} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span>区域：{customer.region || '-'}</span>
          <span>国家：{customer.country || '-'}</span>
          <span>等级：{customer.level || '-'}</span>
          <span>来源：{customer.source || '-'}</span>
          <span>主营行业：{customer.mainIndustry || '-'}</span>
          <span>需求产品：{customer.demandProducts || '-'}</span>
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-2">联系人</h2>
        <table className="w-full border text-center">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border">姓名</th>
              <th className="p-2 border">职位</th>
              <th className="p-2 border">电话</th>
              <th className="p-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {customer.contacts.map((c: any) => (
              <ContactRow key={c.id} contact={c} />
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-medium mb-2">跟进记录</h2>
        <ul className="space-y-2 text-sm">
          {customer.followUps.map((f: any) => (
            <FollowUpItem
              key={f.id}
              id={f.id}
              createdAt={f.createdAt}
              owner={f.owner}
              progress={f.progress}
              record={f.record}
              advice={f.advice}
            />
          ))}
          {customer.followUps.length === 0 && <p className="text-gray-500">暂无记录</p>}
        </ul>
      </section>
    </main>
  );
} 