'use client';

import { useRouter } from 'next/navigation';

interface Item {
  id: string;
  name: string;
  region?: string | null;
  country?: string | null;
  mainIndustry?: string | null;
  level?: string | null;
}

export default function CustomerList({ customers }: { customers: Item[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm('确定删除该客户？')) return;
    await fetch(`/api/customers?id=${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border text-sm text-center">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">客户名称</th>
            <th className="p-2 border">区域</th>
            <th className="p-2 border">国家</th>
            <th className="p-2 border">主营</th>
            <th className="p-2 border">客户等级</th>
            <th className="p-2 border">操作</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.region || '-'}</td>
              <td className="border p-2">{c.country || '-'}</td>
              <td className="border p-2">{c.mainIndustry || '-'}</td>
              <td className="border p-2">{c.level || '-'}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => router.push(`/customers/${c.id}`)} className="text-blue-600 hover:underline">查看</button>
                <button onClick={() => router.push(`/customers/${c.id}/edit`)} className="text-green-600 hover:underline">编辑</button>
                <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {customers.length === 0 && <p className="text-gray-500 mt-2">无匹配客户</p>}
    </div>
  );
} 