import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectBlueprint } from "@/lib/types";
import {
  Cpu, Package, Cable, Code, ListChecks, Lightbulb, Rocket,
  IndianRupee, Clock, ChevronDown, ChevronUp, Download, Share2,
  FileText, ShoppingCart, CircuitBoard, Sparkles
} from "lucide-react";
import TerminalCodeViewer from "./TerminalCodeViewer";
import BreadboardDiagram from "./BreadboardDiagram";
import ShoppingLinks from "./ShoppingLinks";

interface BlueprintDisplayProps {
  blueprint: ProjectBlueprint;
  onReset: () => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Section = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  index = 0,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  index?: number;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="border border-border rounded-lg overflow-hidden bg-card hover:border-primary/20 transition-colors group"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
      >
        <span className="flex items-center gap-3 text-sm font-semibold text-foreground">
          <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          {title}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BlueprintDisplay = ({ blueprint, onReset }: BlueprintDisplayProps) => {
  const { project_summary: ps } = blueprint;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ps.title.replace(/\s+/g, "_")}_blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const margin = 15;
    let y = margin;

    doc.setFontSize(20);
    doc.setTextColor(0, 212, 170);
    doc.text(ps.title, margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`${ps.category} | ${ps.difficulty} | ${ps.estimated_build_time}`, margin, y);
    y += 8;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    const descLines = doc.splitTextToSize(ps.description, 180);
    doc.text(descLines, margin, y);
    y += descLines.length * 5 + 8;

    // Components
    doc.setFontSize(12);
    doc.setTextColor(0, 212, 170);
    doc.text("Components", margin, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    blueprint.components.forEach((c) => {
      doc.text(`• ${c.name} (×${c.quantity}) - ₹${c.approx_price_inr} — ${c.purpose}`, margin + 2, y);
      y += 5;
      if (y > 270) { doc.addPage(); y = margin; }
    });
    y += 5;

    // Wiring
    doc.setFontSize(12);
    doc.setTextColor(0, 212, 170);
    doc.text("Wiring", margin, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    blueprint.wiring_table.forEach((w) => {
      doc.text(`${w.component} → ${w.controller_pin} (${w.pin_connection})`, margin + 2, y);
      y += 5;
      if (y > 270) { doc.addPage(); y = margin; }
    });
    y += 5;

    // Build Steps
    doc.setFontSize(12);
    doc.setTextColor(0, 212, 170);
    doc.text("Build Steps", margin, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    blueprint.build_steps.forEach((s, i) => {
      const stepLines = doc.splitTextToSize(`${i + 1}. ${s}`, 175);
      doc.text(stepLines, margin + 2, y);
      y += stepLines.length * 5;
      if (y > 270) { doc.addPage(); y = margin; }
    });

    // Code on new page
    doc.addPage();
    y = margin;
    doc.setFontSize(12);
    doc.setTextColor(0, 212, 170);
    doc.text("Firmware Code", margin, y);
    y += 8;
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    const codeLines = blueprint.firmware_starter_code.split("\n");
    codeLines.forEach((line) => {
      if (y > 280) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += 3.5;
    });

    doc.save(`${ps.title.replace(/\s+/g, "_")}_blueprint.pdf`);
  };

  const handleShare = async () => {
    const shareData = {
      title: ps.title,
      text: `Check out this IoT Blueprint: ${ps.title} - ${ps.description}`,
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${ps.title}\n${ps.description}\n${window.location.href}`);
      // Could use toast here
    }
  };

  const difficultyColor = {
    Beginner: "text-primary border-primary/30 bg-primary/10",
    Intermediate: "text-accent border-accent/30 bg-accent/10",
    Advanced: "text-destructive border-destructive/30 bg-destructive/10",
  }[ps.difficulty];

  const totalCost = blueprint.components.reduce((sum, c) => sum + c.approx_price_inr * c.quantity, 0);

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border border-border rounded-lg p-6 bg-card relative overflow-hidden"
      >
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4 flex-wrap relative">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${difficultyColor}`}>
                {ps.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${difficultyColor}`}>
                {ps.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{ps.title}</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">{ps.description}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border border-border bg-secondary/50 text-secondary-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              <FileText className="w-3 h-3" /> PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadJSON}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border border-border bg-secondary/50 text-secondary-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Download className="w-3 h-3" /> JSON
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border border-border bg-secondary/50 text-secondary-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Share2 className="w-3 h-3" /> Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="px-3 py-2 rounded-md text-xs font-medium border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              New Project
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border relative">
          {[
            { icon: IndianRupee, label: "Est. Cost", value: `₹${totalCost}` },
            { icon: Clock, label: "Build Time", value: ps.estimated_build_time },
            { icon: Cpu, label: "Controller", value: ps.recommended_controller },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-secondary/30 border border-border"
            >
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{stat.label}:</span>
              <span className="font-mono font-semibold text-foreground">{stat.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Wiring Diagram */}
      <Section title="Interactive Wiring Diagram" icon={CircuitBoard} index={1}>
        <BreadboardDiagram
          wiringTable={blueprint.wiring_table}
          controller={ps.recommended_controller}
        />
      </Section>

      {/* Components BOM */}
      <Section title="Components & Bill of Materials" icon={Package} index={2}>
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
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                >
                  <td className="py-2.5 font-mono text-foreground">{c.name}</td>
                  <td className="py-2.5 text-center text-muted-foreground">{c.quantity}</td>
                  <td className="py-2.5 text-right font-mono text-foreground">₹{c.approx_price_inr}</td>
                  <td className="py-2.5 text-muted-foreground">{c.purpose}</td>
                </motion.tr>
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

      {/* Shopping Links */}
      <Section title="Buy Components" icon={ShoppingCart} index={3}>
        <ShoppingLinks components={blueprint.components} />
      </Section>

      {/* Wiring Table */}
      <Section title="Wiring Table" icon={Cable} index={4}>
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
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                >
                  <td className="py-2.5 font-mono text-foreground">{w.component}</td>
                  <td className="py-2.5 text-muted-foreground">{w.pin_connection}</td>
                  <td className="py-2.5 font-mono text-primary">{w.controller_pin}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Firmware */}
      <Section title="Starter Firmware Code" icon={Code} index={5}>
        <div className="mt-4">
          <TerminalCodeViewer code={blueprint.firmware_starter_code} />
        </div>
      </Section>

      {/* Build Steps */}
      <Section title="Build Steps" icon={ListChecks} index={6}>
        <ol className="mt-4 space-y-2">
          {blueprint.build_steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex gap-3 text-sm group"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-mono font-bold group-hover:bg-primary/20 transition-colors">
                {i + 1}
              </span>
              <span className="text-foreground/80 pt-0.5">{step}</span>
            </motion.li>
          ))}
        </ol>
      </Section>

      {/* Tips */}
      <Section title="Beginner Tips" icon={Lightbulb} defaultOpen={false} index={7}>
        <ul className="mt-4 space-y-2">
          {blueprint.beginner_tips.map((tip, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-2 text-sm text-foreground/80"
            >
              <span className="text-accent flex-shrink-0">💡</span>
              {tip}
            </motion.li>
          ))}
        </ul>
      </Section>

      {/* Upgrades */}
      <Section title="Upgrade Suggestions" icon={Rocket} defaultOpen={false} index={8}>
        <ul className="mt-4 space-y-2">
          {blueprint.upgrade_suggestions.map((sug, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-2 text-sm text-foreground/80"
            >
              <span className="text-primary flex-shrink-0">🚀</span>
              {sug}
            </motion.li>
          ))}
        </ul>
      </Section>

      {/* AI Badge placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center py-4 border border-dashed border-border rounded-lg bg-secondary/10"
      >
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          AI-powered generation coming soon — connect your backend to unlock intelligent blueprints
        </p>
      </motion.div>
    </div>
  );
};

export default BlueprintDisplay;
