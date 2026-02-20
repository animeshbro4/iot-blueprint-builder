import { useState } from "react";
import { motion } from "framer-motion";

interface WiringEntry {
  component: string;
  pin_connection: string;
  controller_pin: string;
}

interface BreadboardDiagramProps {
  wiringTable: WiringEntry[];
  controller: string;
}

const WIRE_COLORS = [
  "hsl(164, 100%, 42%)", // primary teal
  "hsl(38, 92%, 50%)",   // accent orange
  "hsl(280, 80%, 60%)",  // purple
  "hsl(200, 90%, 55%)",  // blue
  "hsl(340, 80%, 55%)",  // pink
  "hsl(120, 60%, 45%)",  // green
  "hsl(50, 90%, 55%)",   // yellow
  "hsl(10, 80%, 55%)",   // red-orange
];

const BreadboardDiagram = ({ wiringTable, controller }: BreadboardDiagramProps) => {
  const [hoveredWire, setHoveredWire] = useState<number | null>(null);
  const isESP32 = controller.toLowerCase().includes("esp32");

  // Controller pin positions (left side and right side)
  const controllerPins = isESP32
    ? {
        left: ["3V3", "GND", "GPIO 15", "GPIO 2", "GPIO 4", "GPIO 16", "GPIO 17", "GPIO 5", "GPIO 18", "GPIO 19", "GPIO 21", "GND2"],
        right: ["VIN", "GND3", "GPIO 13", "GPIO 12", "GPIO 14", "GPIO 27", "GPIO 26", "GPIO 25", "GPIO 33", "GPIO 32", "GPIO 22", "GPIO 23"],
      }
    : {
        left: ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11"],
        right: ["A0", "A1", "A2", "A3", "A4 (SDA)", "A5 (SCL)", "5V", "3.3V", "GND", "GND2", "VIN", "RST"],
      };

  const allPins = [...controllerPins.left, ...controllerPins.right];

  // Map wiring entries to pin indices
  const getConnectionData = () => {
    return wiringTable.map((entry, i) => {
      const pinName = entry.controller_pin;
      const pinIndex = allPins.findIndex(
        (p) => pinName.includes(p) || p.includes(pinName.replace("GPIO ", "").replace("(", "").replace(")", ""))
      );
      return {
        ...entry,
        color: WIRE_COLORS[i % WIRE_COLORS.length],
        pinIndex: pinIndex >= 0 ? pinIndex : i,
      };
    });
  };

  const connections = getConnectionData();

  const svgWidth = 700;
  const svgHeight = 480;
  const controllerX = 180;
  const controllerY = 60;
  const controllerW = 160;
  const controllerH = 320;
  const pinSpacing = controllerH / 13;

  // Component positions on the right side (breadboard area)
  const componentX = 500;
  const componentStartY = 80;
  const componentSpacing = 50;

  // Group by component name
  const componentGroups: Record<string, typeof connections> = {};
  connections.forEach((c) => {
    if (!componentGroups[c.component.split(" ")[0]]) {
      componentGroups[c.component.split(" ")[0]] = [];
    }
    componentGroups[c.component.split(" ")[0]].push(c);
  });

  const uniqueComponents = Object.keys(componentGroups);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-4 rounded-lg border border-border bg-[hsl(210,22%,6%)] p-4 overflow-x-auto"
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-[700px] mx-auto"
        style={{ minHeight: 400 }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="boardGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(210, 18%, 14%)" />
            <stop offset="100%" stopColor="hsl(210, 18%, 10%)" />
          </linearGradient>
          <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(210, 22%, 18%)" />
            <stop offset="100%" stopColor="hsl(210, 22%, 12%)" />
          </linearGradient>
        </defs>

        {/* Breadboard background */}
        <rect x={400} y={40} width={260} height={controllerH + 40} rx={8} fill="url(#boardGradient)" stroke="hsl(210, 14%, 22%)" strokeWidth={1} />
        <text x={530} y={30} textAnchor="middle" fill="hsl(210, 10%, 40%)" fontSize={10} fontFamily="JetBrains Mono">
          BREADBOARD
        </text>

        {/* Breadboard holes grid */}
        {Array.from({ length: 12 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <circle
              key={`hole-${row}-${col}`}
              cx={420 + col * 28}
              cy={70 + row * (controllerH / 13)}
              r={2.5}
              fill="hsl(210, 14%, 20%)"
              stroke="hsl(210, 14%, 25%)"
              strokeWidth={0.5}
            />
          ))
        )}

        {/* Controller board */}
        <rect
          x={controllerX}
          y={controllerY}
          width={controllerW}
          height={controllerH}
          rx={8}
          fill="url(#chipGradient)"
          stroke="hsl(164, 100%, 42%)"
          strokeWidth={1.5}
          filter="url(#glow)"
        />

        {/* USB port */}
        <rect
          x={controllerX + controllerW / 2 - 15}
          y={controllerY - 8}
          width={30}
          height={16}
          rx={3}
          fill="hsl(210, 14%, 25%)"
          stroke="hsl(210, 14%, 35%)"
          strokeWidth={1}
        />
        <text
          x={controllerX + controllerW / 2}
          y={controllerY + 4}
          textAnchor="middle"
          fill="hsl(210, 10%, 45%)"
          fontSize={6}
          fontFamily="JetBrains Mono"
        >
          USB
        </text>

        {/* Controller chip */}
        <rect
          x={controllerX + 40}
          y={controllerY + controllerH / 2 - 30}
          width={80}
          height={60}
          rx={4}
          fill="hsl(210, 22%, 10%)"
          stroke="hsl(210, 14%, 30%)"
          strokeWidth={1}
        />
        <text
          x={controllerX + controllerW / 2}
          y={controllerY + controllerH / 2 - 5}
          textAnchor="middle"
          fill="hsl(164, 100%, 42%)"
          fontSize={9}
          fontFamily="JetBrains Mono"
          fontWeight="bold"
        >
          {isESP32 ? "ESP32" : "ATmega"}
        </text>
        <text
          x={controllerX + controllerW / 2}
          y={controllerY + controllerH / 2 + 8}
          textAnchor="middle"
          fill="hsl(210, 10%, 50%)"
          fontSize={7}
          fontFamily="JetBrains Mono"
        >
          {isESP32 ? "WROOM-32" : "328P"}
        </text>

        {/* Controller label */}
        <text
          x={controllerX + controllerW / 2}
          y={controllerY + controllerH + 20}
          textAnchor="middle"
          fill="hsl(164, 100%, 42%)"
          fontSize={11}
          fontFamily="JetBrains Mono"
          fontWeight="bold"
        >
          {controller}
        </text>

        {/* Left pins */}
        {controllerPins.left.map((pin, i) => {
          const y = controllerY + 25 + i * pinSpacing;
          return (
            <g key={`left-${i}`}>
              <rect x={controllerX - 8} y={y - 4} width={16} height={8} rx={1} fill="hsl(38, 60%, 50%)" />
              <text
                x={controllerX - 16}
                y={y + 3}
                textAnchor="end"
                fill="hsl(210, 10%, 55%)"
                fontSize={7}
                fontFamily="JetBrains Mono"
              >
                {pin}
              </text>
            </g>
          );
        })}

        {/* Right pins */}
        {controllerPins.right.map((pin, i) => {
          const y = controllerY + 25 + i * pinSpacing;
          return (
            <g key={`right-${i}`}>
              <rect x={controllerX + controllerW - 8} y={y - 4} width={16} height={8} rx={1} fill="hsl(38, 60%, 50%)" />
              <text
                x={controllerX + controllerW + 16}
                y={y + 3}
                textAnchor="start"
                fill="hsl(210, 10%, 55%)"
                fontSize={7}
                fontFamily="JetBrains Mono"
              >
                {pin}
              </text>
            </g>
          );
        })}

        {/* Components on breadboard */}
        {uniqueComponents.map((compName, ci) => {
          const cy = componentStartY + ci * componentSpacing;
          const isHovered = componentGroups[compName].some((_, wi) =>
            hoveredWire === connections.indexOf(componentGroups[compName][wi])
          );
          return (
            <g key={compName}>
              <rect
                x={componentX - 40}
                y={cy - 14}
                width={180}
                height={28}
                rx={6}
                fill={isHovered ? "hsl(164, 100%, 42%, 0.15)" : "hsl(210, 18%, 13%)"}
                stroke={isHovered ? "hsl(164, 100%, 42%, 0.5)" : "hsl(210, 14%, 22%)"}
                strokeWidth={1}
                className="transition-all duration-300"
              />
              <circle cx={componentX - 25} cy={cy} r={4} fill={WIRE_COLORS[ci % WIRE_COLORS.length]} opacity={0.8} />
              <text
                x={componentX - 15}
                y={cy + 3}
                fill="hsl(200, 20%, 85%)"
                fontSize={8}
                fontFamily="JetBrains Mono"
              >
                {compName}
              </text>
            </g>
          );
        })}

        {/* Wires */}
        {connections.map((conn, i) => {
          // Find pin position
          const leftIdx = controllerPins.left.findIndex((p) =>
            conn.controller_pin.includes(p) || p.includes(conn.controller_pin.replace("GPIO ", ""))
          );
          const rightIdx = controllerPins.right.findIndex((p) =>
            conn.controller_pin.includes(p) || p.includes(conn.controller_pin.replace("GPIO ", ""))
          );

          const isLeft = leftIdx >= 0;
          const pinIdx = isLeft ? leftIdx : rightIdx;
          if (pinIdx < 0) return null;

          const pinY = controllerY + 25 + pinIdx * pinSpacing;
          const pinX = isLeft ? controllerX - 8 : controllerX + controllerW + 8;

          // Find component group index
          const compKey = conn.component.split(" ")[0];
          const compIdx = uniqueComponents.indexOf(compKey);
          const targetY = componentStartY + compIdx * componentSpacing;
          const targetX = componentX - 40;

          const isActive = hoveredWire === i;
          const midX = isLeft ? pinX - 30 - (i * 5) : pinX + 30 + (i * 5);

          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredWire(i)}
              onMouseLeave={() => setHoveredWire(null)}
              style={{ cursor: "pointer" }}
            >
              <motion.path
                d={`M ${pinX} ${pinY} C ${midX} ${pinY}, ${midX} ${targetY}, ${targetX} ${targetY}`}
                fill="none"
                stroke={conn.color}
                strokeWidth={isActive ? 3 : 1.5}
                opacity={hoveredWire !== null && !isActive ? 0.2 : 0.8}
                filter={isActive ? "url(#glow-strong)" : "none"}
                className="transition-all duration-300"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.15 }}
              />
              {/* Wire tooltip */}
              {isActive && (
                <g>
                  <rect
                    x={(pinX + targetX) / 2 - 60}
                    y={(pinY + targetY) / 2 - 22}
                    width={120}
                    height={30}
                    rx={4}
                    fill="hsl(210, 22%, 12%)"
                    stroke={conn.color}
                    strokeWidth={1}
                  />
                  <text
                    x={(pinX + targetX) / 2}
                    y={(pinY + targetY) / 2 - 8}
                    textAnchor="middle"
                    fill={conn.color}
                    fontSize={7}
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                  >
                    {conn.controller_pin}
                  </text>
                  <text
                    x={(pinX + targetX) / 2}
                    y={(pinY + targetY) / 2 + 3}
                    textAnchor="middle"
                    fill="hsl(210, 10%, 60%)"
                    fontSize={6}
                    fontFamily="JetBrains Mono"
                  >
                    {conn.pin_connection}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <text x={20} y={svgHeight - 15} fill="hsl(210, 10%, 40%)" fontSize={8} fontFamily="JetBrains Mono">
          Hover over wires to see connections
        </text>
      </svg>
    </motion.div>
  );
};

export default BreadboardDiagram;
