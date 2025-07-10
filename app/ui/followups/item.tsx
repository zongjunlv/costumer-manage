'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ owner: owner || '', progress: progress || '', record: record || '', advice: advice || '' });

  async function handleDelete() {
    if (!confirm('确定删除该跟进记录？')) return;
    await fetch(`/api/follow-ups?id=${id}`, { method: 'DELETE' });
    router.refresh();
  }

  async function handleSave() {
    await fetch(`/api/follow-ups?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setEditing(false);
    router.refresh();
  }

  if (editing) {
    return (
      <li className="border p-3 rounded-md space-y-2 text-sm bg-gray-50">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{new Date(createdAt).toLocaleString()}</span>
          <button onClick={handleSave} className="text-green-600 hover:underline">保存</button>
        </div>
        <input className="w-full border p-1" placeholder="业务对接人" value={form.owner} onChange={(e)=>setForm({...form, owner:e.target.value})} />
        <input className="w-full border p-1" placeholder="最新进度" value={form.progress} onChange={(e)=>setForm({...form, progress:e.target.value})} />
        <textarea className="w-full border p-1" placeholder="记录" value={form.record} onChange={(e)=>setForm({...form, record:e.target.value})} />
        <textarea className="w-full border p-1" placeholder="建议" value={form.advice} onChange={(e)=>setForm({...form, advice:e.target.value})} />
      </li>
    );
  }
  return (
    <li className="border p-3 rounded-md">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{new Date(createdAt).toLocaleString()}</span>
        <div className="space-x-2">
          <button onClick={()=>setEditing(true)} className="text-blue-500 hover:underline">编辑</button>
          <button onClick={handleDelete} className="text-red-500 hover:underline">删除</button>
        </div>
      </div>
      <div>业务对接人：{owner || '-'}</div>
      <div>最新进度：{progress}</div>
      <div>记录：{record}</div>
      {advice && <div>建议：{advice}</div>}
    </li>
  );
} 