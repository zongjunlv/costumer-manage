import { prisma } from '@/lib/prisma';

type FollowUpWithCustomer = {
  id: string;
  createdAt: Date;
  progress: string;
  record: string;
  advice: string | null;
  customer: { name: string };
  owner: string;
};

export default async function FollowUpsPage() {
  const list = await prisma.followUp.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">客户跟进记录</h1>
      <table className="table-auto w-full text-sm border text-center">
        <thead className="bg-gray-50">
          <tr>
            <th className="border p-2">时间</th>
            <th className="border p-2">客户</th>
            <th className="border p-2">业务对接人</th>
            <th className="border p-2">最新进度</th>
            <th className="border p-2">记录</th>
            <th className="border p-2">建议</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item: any) => (
            <tr key={item.id}>
              <td className="border p-2">{new Date(item.createdAt).toLocaleString()}</td>
              <td className="border p-2">{item.customer.name}</td>
              <td className="border p-2">{item.owner}</td>
              <td className="border p-2">{item.progress}</td>
              <td className="border p-2">{item.record}</td>
              <td className="border p-2">{item.advice}</td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={5}>
                暂无跟进记录
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
} 