import Link from 'next/link';

export default function HomePage() {
  const cards = [
    { href: '/customers/new', title: '客户信息录入' },
    { href: '/customers', title: '客户信息查询' },
    { href: '/follow-ups', title: '客户跟进记录' },
  ];

  return (
    <main className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-8">客户管理系统</h1>

      <div className="grid gap-6 sm:grid-cols-3 w-full max-w-4xl">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg bg-white shadow hover:shadow-md transition flex flex-col justify-center items-center h-40 text-lg font-medium text-gray-700"
          >
            {card.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
