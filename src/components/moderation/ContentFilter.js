import Card from "@/components/ui/Card";

const RULES = [
  "Detect profanity and replace it with positive reframing cues.",
  "Flag off-topic submissions for manual review.",
  "Boost posts tagged with mentoring and learning that receive high sentiment.",
];

export default function ContentFilter() {
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Content filters</h3>
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
        {RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </Card>
  );
}
