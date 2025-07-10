'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  id: string;               // customer id
  field: string;            // 字段名
  value: string | null;
  textarea?: boolean;       // 是否多行
}

export default function InlineEdit({ id, field, value, textarea }: Props) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? '');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 自动调整 textarea 高度
  function autoResize() {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }

  useEffect(() => {
    if (editing && textarea) {
      autoResize();
    }
  }, [editing]);

  const router = useRouter();

  async function save() {
    if (!editing) return;
    await fetch(`/api/customers?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: val }),
    });
    setEditing(false);
    router.refresh();
  }

  if (editing) {
    if (textarea) {
      return (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            className="w-full border rounded p-1 text-sm overflow-hidden resize-none"
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
              autoResize();
            }}
            autoFocus
          />
          <button onClick={save} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">保存</button>
        </div>
      );
    }
    return (
      <span className="inline-flex items-center space-x-2">
        <input
          className="border rounded px-1 text-sm"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          autoFocus
        />
        <button onClick={save} className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs">保存</button>
      </span>
    );
  }

  return (
    <span
      className="cursor-pointer hover:underline decoration-dotted"
      title="双击可编辑"
      onDoubleClick={() => setEditing(true)}
    >
      {value || '-'}
    </span>
  );
} 