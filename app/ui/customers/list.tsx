'use client';

import { useRouter } from 'next/navigation';

export default function CustomerList({ customers }: { customers: { id: string; name: string }[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm('确定删除该客户？')) return;
    await fetch(`/api/customers?id=${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <ul className="mt-4 space-y-2">
      {customers.map((c) => (
        <li key={c.id} className="border p-3 rounded-md flex justify-between items-center">
          <span>{c.name}</span>
          <div className="space-x-4">
            <button
              onClick={() => router.push(`/customers/${c.id}`)}
              className="text-blue-600 hover:underline text-sm"
            >
              查看
            </button>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-red-600 hover:underline text-sm"
            >
              删除
            </button>
          </div>
        </li>
      ))}
      {customers.length === 0 && <p className="text-gray-500">无匹配客户</p>}
    </ul>
  );
} 