import { prisma } from '@/lib/prisma';
import Search from '@/app/ui/search';
import CustomerList from '@/app/ui/customers/list';
import ClientSearch from '@/app/ui/customers/client-search';

// @ts-nocheck

export default async function CustomersPage({ searchParams }: any) {
  const keyword = searchParams?.keyword || '';
  const customers: { id: string; name: string }[] = await prisma.customer.findMany({
    where: keyword ? { name: { contains: keyword } } : undefined,
  });

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">客户信息查询</h1>
      <ClientSearch initial={keyword} />

      <CustomerList customers={customers} />
    </main>
  );
} 