import { ExternalLink, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface Component {
  name: string;
  quantity: number;
  approx_price_inr: number;
  purpose: string;
}

interface ShoppingLinksProps {
  components: Component[];
}

const generateSearchUrl = (name: string, store: "amazon" | "robu") => {
  const query = encodeURIComponent(name);
  if (store === "amazon") return `https://www.amazon.in/s?k=${query}`;
  return `https://robu.in/?s=${query}`;
};

const ShoppingLinks = ({ components }: ShoppingLinksProps) => {
  return (
    <div className="mt-4 space-y-2">
      {components.map((comp, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border border-border bg-secondary/20 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <ShoppingCart className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-sm font-mono text-foreground truncate block">{comp.name}</span>
              <span className="text-xs text-muted-foreground">×{comp.quantity} · ₹{comp.approx_price_inr}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <a
              href={generateSearchUrl(comp.name, "amazon")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border border-border bg-secondary/50 text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors"
            >
              Amazon <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={generateSearchUrl(comp.name, "robu")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
            >
              Robu.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShoppingLinks;
