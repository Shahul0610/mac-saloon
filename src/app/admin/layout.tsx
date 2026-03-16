import { Sidebar } from "./components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-grow ml-64 p-12">
        {children}
      </main>
    </div>
  );
}
