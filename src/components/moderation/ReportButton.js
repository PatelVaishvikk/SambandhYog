import Button from "@/components/ui/Button";

export default function ReportButton({ onReport, label = "Report" }) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={onReport}>
      ?? {label}
    </Button>
  );
}
