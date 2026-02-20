import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="min-h-screen bg-background bg-grid-pattern relative">
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 relative">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 shadow-[0_0_30px_hsl(164,100%,42%,0.15)]">
              <CircuitBoard className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-2">
            IoT Blueprint <span className="text-gradient-primary">Generator</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Turn your IoT idea into a complete, actionable project blueprint with components, wiring, and firmware code.
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {!blueprint ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-xl mx-auto"
            >
              {/* Mode Toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden mb-6 shadow-[0_0_15px_hsl(164,100%,42%,0.05)]">
                <button
                  onClick={() => setMode("guided")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
                    mode === "guided"
                      ? "bg-primary/10 text-primary border-r border-border shadow-[inset_0_-2px_0_hsl(164,100%,42%)]"
                      : "bg-secondary/30 text-muted-foreground hover:text-foreground border-r border-border"
                  }`}
                >
                  <Cpu className="w-4 h-4" /> Guided
                </button>
                <button
                  onClick={() => setMode("freetext")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
                    mode === "freetext"
                      ? "bg-primary/10 text-primary shadow-[inset_0_-2px_0_hsl(164,100%,42%)]"
                      : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Zap className="w-4 h-4" /> Free Text
                </button>
              </div>

              {/* Form Card */}
              <motion.div
                layout
                className="border border-border rounded-lg p-6 bg-card shadow-[0_0_40px_hsl(164,100%,42%,0.04)]"
              >
                <AnimatePresence mode="wait">
                  {mode === "guided" ? (
                    <motion.div
                      key="guided"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GuidedForm onGenerate={handleGuided} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="freetext"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FreeTextForm onGenerate={handleFreeText} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="blueprint"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <BlueprintDisplay blueprint={blueprint} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-xs text-muted-foreground"
        >
          Built for students, hobbyists & engineers 🇮🇳
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
