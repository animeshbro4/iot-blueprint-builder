import { useState } from "react";
import { MessageSquare } from "lucide-react";

interface FreeTextFormProps {
  onGenerate: (text: string) => void;
}

const EXAMPLES = [
  "I want to monitor temperature and humidity in my greenhouse",
  "Build a security alarm that detects motion at my front door",
  "Auto-water my plants when the soil gets dry",
  "Control my room lights with my phone via WiFi",
];

const FreeTextForm = ({ onGenerate }: FreeTextFormProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) onGenerate(text);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Describe your IoT project idea
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell me about your IoT project idea in plain English..."
          className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none font-display text-sm"
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setText(ex)}
              className="px-3 py-1.5 rounded-full text-xs border border-border bg-secondary/30 text-secondary-foreground hover:border-primary/50 hover:text-primary transition-all"
            >
              {ex.slice(0, 40)}...
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!text.trim()}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-primary disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Generate Blueprint ⚡
      </button>
    </form>
  );
};

export default FreeTextForm;
