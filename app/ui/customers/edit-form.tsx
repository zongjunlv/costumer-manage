'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerEditForm({ initial }: { initial: any }) {
  const [form, setForm] = useState(initial);
  const router = useRouter();

  function onChange(field: string, value: any) {
    setForm({ ...form, [field]: value });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/customers?id=${initial.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push(`/customers/${initial.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input required className="block w-full border p-2" value={form.name} onChange={(e)=>onChange('name',e.target.value)} />
      {/* 这里只示范名称，可按需补充其他字段 */}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">保存</button>
    </form>
  );
} 