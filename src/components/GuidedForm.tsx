import { useState } from "react";
import { GuidedInput, CATEGORIES } from "@/lib/types";
import { Cpu, Zap, IndianRupee } from "lucide-react";

interface GuidedFormProps {
  onGenerate: (input: GuidedInput) => void;
}

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;

const GuidedForm = ({ onGenerate }: GuidedFormProps) => {
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [difficulty, setDifficulty] = useState<typeof DIFFICULTIES[number]>("Beginner");
  const [budget, setBudget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      category: category || "Home Automation",
      project_goal: goal,
      difficulty_preference: difficulty,
      budget: budget ? parseInt(budget) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          Project Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-md text-sm text-left transition-all border ${
                category === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/50 text-secondary-foreground hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          What do you want to build?
        </label>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Control my room lights and fan from my phone..."
          className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none font-display text-sm"
          rows={3}
        />
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Difficulty Level</label>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all border ${
                difficulty === d
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/50 text-secondary-foreground hover:border-primary/50"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-primary" />
          Budget (optional, in INR)
        </label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="e.g., 1000"
          className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-mono text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-primary"
      >
        Generate Blueprint ⚡
      </button>
    </form>
  );
};

export default GuidedForm;
