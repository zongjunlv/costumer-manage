import { prisma } from '@/lib/prisma';
import CustomerEditForm from '@/app/ui/customers/edit-form';

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) return <p className="p-6">未找到客户</p>;
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">编辑客户信息</h1>
      <CustomerEditForm initial={customer} />
    </main>
  );
} 