import Button from "@/components/ui/Button";

export default function ShareButton({ onShare }) {
  const handleClick = () => {
    if (onShare) onShare();
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
  };

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleClick}>
      ?? Share
    </Button>
  );
}
