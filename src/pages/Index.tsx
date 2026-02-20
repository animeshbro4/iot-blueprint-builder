import { useState } from "react";
import { ProjectBlueprint } from "@/lib/types";
import { generateBlueprint, generateBlueprintFromText } from "@/lib/blueprintGenerator";
import { GuidedInput } from "@/lib/types";
import GuidedForm from "@/components/GuidedForm";
import FreeTextForm from "@/components/FreeTextForm";
import BlueprintDisplay from "@/components/BlueprintDisplay";
import { Cpu, Zap, CircuitBoard } from "lucide-react";

type InputMode = "guided" | "freetext";

const Index = () => {
  const [mode, setMode] = useState<InputMode>("guided");
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);

  const handleGuided = (input: GuidedInput) => {
    setBlueprint(generateBlueprint(input));
  };

  const handleFreeText = (text: string) => {
    setBlueprint(generateBlueprintFromText(text));
  };

  const handleReset = () => setBlueprint(null);

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
              <CircuitBoard className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-2">
            IoT Blueprint <span className="text-gradient-primary">Generator</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Turn your IoT idea into a complete, actionable project blueprint with components, wiring, and firmware code.
          </p>
        </header>

        {!blueprint ? (
          <div className="max-w-xl mx-auto">
            {/* Mode Toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden mb-6">
              <button
                onClick={() => setMode("guided")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  mode === "guided"
                    ? "bg-primary/10 text-primary border-r border-border"
                    : "bg-secondary/30 text-muted-foreground hover:text-foreground border-r border-border"
                }`}
              >
                <Cpu className="w-4 h-4" /> Guided
              </button>
              <button
                onClick={() => setMode("freetext")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  mode === "freetext"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Zap className="w-4 h-4" /> Free Text
              </button>
            </div>

            {/* Form Card */}
            <div className="border border-border rounded-lg p-6 bg-card">
              {mode === "guided" ? (
                <GuidedForm onGenerate={handleGuided} />
              ) : (
                <FreeTextForm onGenerate={handleFreeText} />
              )}
            </div>
          </div>
        ) : (
          <BlueprintDisplay blueprint={blueprint} onReset={handleReset} />
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Built for students, hobbyists & engineers 🇮🇳
        </footer>
      </div>
    </div>
  );
};

export default Index;
