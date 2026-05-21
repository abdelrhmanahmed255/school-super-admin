import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

function Loader({ className }: { className?: string }) {
  return (
    <LoaderIcon
      className={cn("animate-spin text-primary mx-auto", className)}
    />
  );
}

export default Loader;
