import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  
  if (!admin) {
    redirect('/login');
    return null;
  }

  return (
    <>
      <div className="flex h-screen bg-black">
        <Sidebar admin={admin} />
        <main className="flex-1 overflow-auto md:ml-0">
          {/* Add padding-top on mobile to account for hamburger button */}
          <div className="md:hidden h-16"></div>
          {children}
        </main>
      </div>
    </>
  );
}