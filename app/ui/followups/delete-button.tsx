'use client';

import { useRouter } from 'next/navigation';

export default function FollowUpDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm('确定删除该跟进记录？')) return;
    await fetch(`/api/follow-ups?id=${id}`, { method: 'DELETE' });
    router.refresh();
  }
  return (
    <button onClick={handleDelete} className="text-red-600 hover:underline">
      删除
    </button>
  );
} 