import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-xl grid-cols-[50px_50px_50px_50px_50px] gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl border border-neutral-600 text-black bg-white hover:bg-gray-100 active:bg-gray-600 transition duration-200",
        className
      )}
    >
      {title}
    </button>
  );
};
