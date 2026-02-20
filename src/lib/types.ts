export interface ProjectBlueprint {
  project_summary: {
    title: string;
    description: string;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    estimated_cost_inr: number;
    estimated_build_time: string;
    recommended_controller: string;
  };
  components: {
    name: string;
    quantity: number;
    approx_price_inr: number;
    purpose: string;
  }[];
  wiring_table: {
    component: string;
    pin_connection: string;
    controller_pin: string;
  }[];
  firmware_starter_code: string;
  build_steps: string[];
  beginner_tips: string[];
  upgrade_suggestions: string[];
}

export interface GuidedInput {
  category: string;
  project_goal: string;
  difficulty_preference: "Beginner" | "Intermediate" | "Advanced";
  budget?: number;
}

export const CATEGORIES = [
  "Home Automation",
  "Environmental Monitoring",
  "Security & Surveillance",
  "Agriculture & Farming",
  "Health & Wearables",
  "Robotics & Motors",
  "Industrial IoT",
  "Smart Energy",
  "Education & Learning",
  "Custom / Other",
] as const;
