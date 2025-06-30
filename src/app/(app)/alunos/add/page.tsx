import Head from "@/components/Head";
import { X } from "lucide-react";

export default function AddAlunoPage() {
   return (
    <div className="p-8">
      <Head title="Adionando um novo aluno" description="Adicione alunos para sua academia rapidamente" buttonText="Cancelar" buttonVariant={"destructive"} icon={<X></X>}></Head>
    </div>
   )
}