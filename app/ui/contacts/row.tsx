'use client';

import { useRouter } from 'next/navigation';

export default function ContactRow({ contact }: { contact: any }) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm('确定删除该联系人？')) return;
    await fetch(`/api/contacts?id=${contact.id}`, { method: 'DELETE' });
    router.refresh();
  }
  return (
    <tr>
      <td className="p-2 border text-center">{contact.name}</td>
      <td className="p-2 border text-center">{contact.position}</td>
      <td className="p-2 border text-center">{contact.phone}</td>
      <td className="p-2 border text-center">
        <button onClick={handleDelete} className="text-red-500 hover:underline text-sm">删除</button>
      </td>
    </tr>
  );
} 