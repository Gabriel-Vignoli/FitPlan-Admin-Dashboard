import { Button } from "./ui/button";

interface HeadProps {
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "destructive";
  icon?: React.ReactNode;
  margin?: number;
}

export default function Head({
  title,
  description,
  buttonText,
  buttonVariant,
  icon,
  margin = 6
}: HeadProps) {
  return (
    <div className={`mb-${margin} md:flex md:items-center md:justify-between space-y-5 gap-5 md:gap-0`}>
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
