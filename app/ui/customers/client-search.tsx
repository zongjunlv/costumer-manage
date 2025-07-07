'use client';

import { useRouter } from 'next/navigation';
import Search from '@/app/ui/search';

export default function ClientSearch({ initial }: { initial: string }) {
  const router = useRouter();
  return (
    <Search
      placeholder="输入客户名称…"
      defaultValue={initial}
      onSelect={(name) => router.push('/customers?keyword=' + encodeURIComponent(name))}
      onEmpty={() => router.push('/customers')}
    />
  );
} 