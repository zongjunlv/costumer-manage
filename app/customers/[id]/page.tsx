import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ExportButton from '@/app/ui/customers/export-button';
import FollowUpItem from '@/app/ui/followups/item';
import ContactRow from '@/app/ui/contacts/row';
import InlineEdit from '@/app/ui/inline-edit';
import FollowUpNewForm from '@/app/ui/followups/new-form';

interface LocalPageProps<T> { params: T; searchParams?: { [key: string]: string | string[] | undefined } }

export default async function CustomerDetailPage({ params }: any) {
  // 先取出联系人并去重
  const customer = (await prisma.customer.findUnique({
    where: { id: params.id },
    include: { contacts: { orderBy: { id: 'asc' } }, followUps: { orderBy: { createdAt: 'desc' } } },
  })) as any;

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
          <span>主营：{customer.mainIndustry || '-'}</span>
          <span>客户画像：{customer.companyFeature || '-'}</span>
          <span>需求产品：{customer.demandProducts || '-'}</span>
          <span>网址：{customer.website || '-'}</span>
          <span>客户等级：{customer.level || '-'}</span>
          <span>客户来源：{customer.source || '-'}</span>
          <span>化工分属：{customer.chemicalSegment || '-'}</span>
          <span>客户关键词：{customer.keywords || '-'}</span>
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-2">名片信息 <span className="text-xs text-gray-400">(双击可编辑)</span></h2>
        <div className="bg-gray-50 p-4 rounded border text-sm whitespace-pre-wrap">
          <InlineEdit id={customer.id} field="cardInfo" value={customer.cardInfo} textarea />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium">跟进记录</h2>
          <FollowUpNewForm customerId={customer.id} />
        </div>
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

      {/* 建议板块 */}
      <section>
        <h2 className="font-medium mb-2">建议 <span className="text-xs text-gray-400">(双击可编辑)</span></h2>
        <div className="bg-gray-50 p-4 rounded border text-sm whitespace-pre-wrap">
          <InlineEdit id={customer.id} field="suggestion" value={customer.suggestion} textarea />
        </div>
      </section>
    </main>
  );
} 