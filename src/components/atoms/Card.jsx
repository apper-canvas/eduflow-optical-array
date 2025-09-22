import { cn } from "@/utils/cn";

const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-surface p-6 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;