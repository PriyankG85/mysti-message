import Navbar from "@/components/Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col flex-1 min-h-screen">
      <Navbar />
      <div className="flex flex-col flex-1 w-[72rem] mx-auto p-5 py-10 md:px-0 text-base">
        {children}
      </div>

      <footer className="p-4 text-center">
        <p className="text-center text-sm">© 2023 MystiMessage</p>
      </footer>
    </main>
  );
}
