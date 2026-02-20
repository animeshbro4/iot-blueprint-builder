import { useState } from "react";
import { ProjectBlueprint } from "@/lib/types";
import {
  Cpu, Package, Cable, Code, ListChecks, Lightbulb, Rocket,
  IndianRupee, Clock, ChevronDown, ChevronUp, Copy, Check, Download
} from "lucide-react";

interface BlueprintDisplayProps {
  blueprint: ProjectBlueprint;
  onReset: () => void;
}

const Section = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
      >
        <span className="flex items-center gap-3 text-sm font-semibold text-foreground">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border">{children}</div>}
    </div>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-primary transition-colors">
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

const BlueprintDisplay = ({ blueprint, onReset }: BlueprintDisplayProps) => {
  const { project_summary: ps } = blueprint;

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ps.title.replace(/\s+/g, "_")}_blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const difficultyColor = {
    Beginner: "text-primary",
    Intermediate: "text-accent",
    Advanced: "text-destructive",
  }[ps.difficulty];

  const totalCost = blueprint.components.reduce((sum, c) => sum + c.approx_price_inr * c.quantity, 0);

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/30">
                {ps.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-mono ${difficultyColor}`}>
                {ps.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{ps.title}</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">{ps.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border border-border bg-secondary/50 text-secondary-foreground hover:border-primary/50 transition-colors"
            >
              <Download className="w-3 h-3" /> JSON
            </button>
            <button
              onClick={onReset}
              className="px-3 py-2 rounded-md text-xs font-medium border border-border bg-secondary/50 text-secondary-foreground hover:border-primary/50 transition-colors"
            >
              New Project
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Est. Cost:</span>
            <span className="font-mono font-semibold text-foreground">₹{totalCost}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Build Time:</span>
            <span className="font-mono font-semibold text-foreground">{ps.estimated_build_time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Controller:</span>
            <span className="font-mono font-semibold text-foreground">{ps.recommended_controller}</span>
          </div>
        </div>
      </div>

      {/* Components */}
      <Section title="Components & Bill of Materials" icon={Package}>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="pb-2 font-medium">Component</th>
                <th className="pb-2 font-medium text-center">Qty</th>
                <th className="pb-2 font-medium text-right">Price (₹)</th>
                <th className="pb-2 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {blueprint.components.map((c, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 font-mono text-foreground">{c.name}</td>
                  <td className="py-2.5 text-center text-muted-foreground">{c.quantity}</td>
                  <td className="py-2.5 text-right font-mono text-foreground">₹{c.approx_price_inr}</td>
                  <td className="py-2.5 text-muted-foreground">{c.purpose}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="pt-3 text-foreground">Total</td>
                <td></td>
                <td className="pt-3 text-right font-mono text-primary">₹{totalCost}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Wiring */}
      <Section title="Wiring Table" icon={Cable}>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="pb-2 font-medium">Component</th>
                <th className="pb-2 font-medium">Pin / Connection</th>
                <th className="pb-2 font-medium">Controller Pin</th>
              </tr>
            </thead>
            <tbody>
              {blueprint.wiring_table.map((w, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 font-mono text-foreground">{w.component}</td>
                  <td className="py-2.5 text-muted-foreground">{w.pin_connection}</td>
                  <td className="py-2.5 font-mono text-primary">{w.controller_pin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Firmware */}
      <Section title="Starter Firmware Code" icon={Code}>
        <div className="mt-4 relative">
          <div className="absolute top-2 right-2 z-10">
            <CopyButton text={blueprint.firmware_starter_code} />
          </div>
          <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-xs leading-relaxed font-mono text-foreground/90 max-h-96 overflow-y-auto">
            <code>{blueprint.firmware_starter_code}</code>
          </pre>
        </div>
      </Section>

      {/* Build Steps */}
      <Section title="Build Steps" icon={ListChecks}>
        <ol className="mt-4 space-y-2">
          {blueprint.build_steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold">
                {i + 1}
              </span>
              <span className="text-foreground/80 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Tips */}
      <Section title="Beginner Tips" icon={Lightbulb} defaultOpen={false}>
        <ul className="mt-4 space-y-2">
          {blueprint.beginner_tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/80">
              <span className="text-accent flex-shrink-0">💡</span>
              {tip}
            </li>
          ))}
        </ul>
      </Section>

      {/* Upgrades */}
      <Section title="Upgrade Suggestions" icon={Rocket} defaultOpen={false}>
        <ul className="mt-4 space-y-2">
          {blueprint.upgrade_suggestions.map((sug, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/80">
              <span className="text-primary flex-shrink-0">🚀</span>
              {sug}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
};

export default BlueprintDisplay;
