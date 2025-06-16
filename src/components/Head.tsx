import { Button } from "./ui/button";

interface HeadProps {
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "destructive";
  icon?: React.ReactNode;
}

export default function Head({
  title,
  description,
  buttonText,
  buttonVariant,
  icon,
}: HeadProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-white/80">{description}</p>
      </div>

      <Button variant={buttonVariant} className="text-white">
        {icon}
        {buttonText}
      </Button>
    </div>
  );
}
