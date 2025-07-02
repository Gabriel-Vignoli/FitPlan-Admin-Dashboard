"use client";

import { useRouter } from "next/navigation";
import AddAlunoForm from "@/components/AddAlunosForm";

export default function AddAlunoPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/alunos");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
      <div className="flex justify-center mt-8">
        <AddAlunoForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
  );
}