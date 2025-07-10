import { prisma } from '@/lib/prisma';
import Search from '@/app/ui/search';
import CustomerList from '@/app/ui/customers/list';
import ClientSearch from '@/app/ui/customers/client-search';

// @ts-nocheck

export default async function CustomersPage({ searchParams }: any) {
  const keyword = searchParams?.keyword || '';
  const customers = await prisma.customer.findMany({
    where: keyword ? { name: { contains: keyword, mode: 'insensitive' } } : undefined,
    select: {
      id: true,
      name: true,
      region: true,
      country: true,
      mainIndustry: true,
      level: true,
    },
  });

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">客户信息查询</h1>
      <ClientSearch initial={keyword} />

      <CustomerList customers={customers} />
    </main>
  );
} 