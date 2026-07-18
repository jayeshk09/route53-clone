type BadgeVariant = "info" | "success" | "warning" | "error";

interface BadgeProps {
  variant?: BadgeVariant;
  text: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-orange-100 text-orange-700",
  error: "bg-red-100 text-red-600",
};

export default function Badge({ variant = "info", text }: BadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${variantStyles[variant]}`}
    >
      {text}
    </span>
  );
}