import EditAdminProfileForm from "@/components/EditAdminProfileForm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

interface DecodedToken {
  id: string;
  name: string;
  email: string;
}

export default async function AdminProfilePage() {
  // Lê o token do cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  // Verifica e decodifica o token
  const decoded = verifyToken(token) as DecodedToken | null;

  if (!decoded) {
    redirect("/login");
  }

  // Busca o admin usando o ID do token 
  const admin = await prisma.admin.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  });

  if (!admin) {
    redirect("/login");
  }

  const adminForComponent = {
    ...admin,
    avatar: admin.avatar || undefined,
  };

  return <EditAdminProfileForm admin={adminForComponent} />;
}
