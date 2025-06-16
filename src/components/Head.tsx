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
    <div className="mb-6 md:flex md:items-center md:justify-between space-y-5">
      <div className="flex flex-col">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">{title}</h1>
        <p className="text-white/80 text-sm sm:text-base ">{description}</p>
      </div>

      <Button variant={buttonVariant} className="text-white">
        {icon}
        {buttonText}
      </Button>
    </div>
  );
}
