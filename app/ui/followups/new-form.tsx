'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FollowUpNewForm({ customerId }: { customerId: string }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ owner: '', progress: '', record: '', advice: '' });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/follow-ups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, customerId }),
    });
    setShow(false);
    setForm({ owner: '', progress: '', record: '', advice: '' });
    router.refresh();
  }

  if (!show) {
    return <button onClick={() => setShow(true)} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">+ 新增记录</button>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-[90%] max-w-md space-y-3">
        <h2 className="text-lg font-medium mb-2">新增跟进记录</h2>
        <input className="w-full border p-1" placeholder="业务对接人" value={form.owner} onChange={(e)=>setForm({...form, owner:e.target.value})} />
        <input className="w-full border p-1" placeholder="最新进度" value={form.progress} onChange={(e)=>setForm({...form, progress:e.target.value})} />
        <textarea className="w-full border p-1" placeholder="记录" value={form.record} onChange={(e)=>setForm({...form, record:e.target.value})} />
        <textarea className="w-full border p-1" placeholder="建议" value={form.advice} onChange={(e)=>setForm({...form, advice:e.target.value})} />
        <div className="text-right space-x-4 text-sm">
          <button type="button" onClick={() => setShow(false)} className="px-3 py-1 bg-gray-200 rounded">取消</button>
          <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">保存</button>
        </div>
      </form>
    </div>
  );
} 