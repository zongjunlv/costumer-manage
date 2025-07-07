'use client';

import { useRouter } from 'next/navigation';

interface ItemProps {
  id: string;
  createdAt: string | Date;
  owner?: string | null;
  progress?: string | null;
  record?: string | null;
  advice?: string | null;
}

export default function FollowUpItem({ id, createdAt, owner, progress, record, advice }: ItemProps) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm('确定删除该跟进记录？')) return;
    await fetch(`/api/follow-ups?id=${id}`, { method: 'DELETE' });
    router.refresh();
  }
  return (
    <li className="border p-3 rounded-md">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{new Date(createdAt).toLocaleString()}</span>
        <button onClick={handleDelete} className="text-red-500 hover:underline">删除</button>
      </div>
      <div>业务对接人：{owner || '-'}</div>
      <div>最新进度：{progress}</div>
      <div>记录：{record}</div>
      {advice && <div>建议：{advice}</div>}
    </li>
  );
} 