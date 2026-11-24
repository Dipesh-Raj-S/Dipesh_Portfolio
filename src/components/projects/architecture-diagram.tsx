import type { ArchitectureEdge, ArchitectureNode } from "@/types";

const COL_W = 264;
const ROW_H = 104;
const NODE_W = 172;
const NODE_H = 58;
const PAD = 16;

const toneStroke: Record<NonNullable<ArchitectureNode["tone"]>, string> = {
  client: "var(--secondary)",
  service: "var(--primary)",
  data: "var(--secondary)",
  external: "var(--muted-foreground)",
};

interface Point {
  x: number;
  y: number;
}

function center(node: ArchitectureNode): Point {
  return {
    x: PAD + node.col * COL_W + NODE_W / 2,
    y: PAD + node.row * ROW_H + NODE_H / 2,
  };
}

/** Point where the ray from a box centre towards (dx, dy) exits the box, plus a gap. */
function exitPoint(c: Point, dx: number, dy: number, gap: number): Point {
  const len = Math.hypot(dx, dy) || 1;
  const t = Math.min(
    dx === 0 ? Infinity : NODE_W / 2 / Math.abs(dx),
    dy === 0 ? Infinity : NODE_H / 2 / Math.abs(dy),
  );
  return { x: c.x + dx * t + (dx / len) * gap, y: c.y + dy * t + (dy / len) * gap };
}

interface EdgeGeometry {
  key: string;
  start: Point;
  end: Point;
  label?: string;
  dashed: boolean;
}

function layoutEdges(
  edges: ArchitectureEdge[],
  byId: Map<string, ArchitectureNode>,
): EdgeGeometry[] {
  return edges.flatMap((edge) => {
    const a = byId.get(edge.from);
    const b = byId.get(edge.to);
    if (!a || !b) return [];
    const ca = center(a);
    const cb = center(b);
    const dx = cb.x - ca.x;
    const dy = cb.y - ca.y;
    return [
      {
        key: `${edge.from}-${edge.to}`,
        start: exitPoint(ca, dx, dy, 2),
        end: exitPoint(cb, -dx, -dy, 4),
        label: edge.label,
        dashed: b.tone === "external",
      },
    ];
  });
}

interface DiagramProps {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  caption: string;
  title: string;
}

/** Boxes-and-arrows architecture diagram generated from data, in the site palette. */
export function ArchitectureDiagram({ nodes, edges, caption, title }: DiagramProps) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const cols = Math.max(...nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...nodes.map((n) => n.row)) + 1;
  const width = PAD * 2 + (cols - 1) * COL_W + NODE_W;
  const height = PAD * 2 + (rows - 1) * ROW_H + NODE_H;
  const geometry = layoutEdges(edges, byId);

  const description = edges
    .map((e) => {
      const from = byId.get(e.from)?.label;
      const to = byId.get(e.to)?.label;
      return from && to ? `${from} to ${to}${e.label ? ` (${e.label})` : ""}` : null;
    })
    .filter(Boolean)
    .join("; ");

  return (
    <figure className="rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto rounded-t-2xl bg-dots p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${title} architecture: ${description}.`}
          className="mx-auto h-auto w-full max-w-3xl min-w-[600px]"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 10 5 0 10z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* 1. connections */}
          {geometry.map((e) => (
            <line
              key={e.key}
              x1={e.start.x}
              y1={e.start.y}
              x2={e.end.x}
              y2={e.end.y}
              stroke="var(--muted-foreground)"
              strokeOpacity="0.6"
              strokeWidth="1.5"
              strokeDasharray={e.dashed ? "4 4" : undefined}
              markerEnd="url(#arrow)"
            />
          ))}

          {/* 2. components */}
          {nodes.map((node) => {
            const x = PAD + node.col * COL_W;
            const y = PAD + node.row * ROW_H;
            const stroke = toneStroke[node.tone ?? "service"];
            return (
              <g key={node.id}>
                <rect
                  x={x}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={12}
                  fill="var(--card)"
                  stroke={stroke}
                  strokeOpacity="0.55"
                  strokeWidth="1.5"
                />
                <rect
                  x={x + 12}
                  y={y + 14}
                  width={3}
                  height={NODE_H - 28}
                  rx={1.5}
                  fill={stroke}
                />
                <text
                  x={x + 24}
                  y={y + 26}
                  fontSize="14"
                  fontWeight="600"
                  fill="var(--foreground)"
                >
                  {node.label}
                </text>
                {node.sub ? (
                  <text
                    x={x + 24}
                    y={y + 43}
                    fontSize="11"
                    fill="var(--muted-foreground)"
                    fontFamily="var(--font-mono)"
                  >
                    {node.sub}
                  </text>
                ) : null}
              </g>
            );
          })}

          {/* 3. labels on top, so they never hide behind a box */}
          {geometry.map((e) => {
            if (!e.label) return null;
            const mx = (e.start.x + e.end.x) / 2;
            const my = (e.start.y + e.end.y) / 2;
            const w = e.label.length * 6.4 + 14;
            return (
              <g key={`${e.key}-label`}>
                <rect
                  x={mx - w / 2}
                  y={my - 9}
                  width={w}
                  height={18}
                  rx={9}
                  fill="var(--background-2)"
                  stroke="var(--border)"
                />
                <text
                  x={mx}
                  y={my + 3.5}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill="var(--muted-foreground)"
                  fontFamily="var(--font-mono)"
                >
                  {e.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="border-t border-border px-5 py-3 text-sm text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
