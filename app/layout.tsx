import '@/app/ui/global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {/* 顶部导航栏 */}
        <nav className="fixed top-0 inset-x-0 z-10 bg-white shadow flex justify-center">
          <div className="max-w-5xl w-full flex gap-6 px-6 py-3 text-sm font-medium text-gray-700">
            <a href="/customers/new" className="hover:text-blue-600">客户信息录入</a>
            <a href="/customers" className="hover:text-blue-600">客户信息查询</a>
            <a href="/follow-ups" className="hover:text-blue-600">客户跟进记录</a>
          </div>
        </nav>

        {/* 内容区域，留出导航高度 */}
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
