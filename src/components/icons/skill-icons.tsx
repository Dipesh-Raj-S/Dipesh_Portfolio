import type { SVGProps } from "react";
import type { SkillGroup } from "@/types";

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

/** Small custom line icons, one per skill category. */
const icons: Record<SkillGroup["id"], (props: IconProps) => React.JSX.Element> = {
  languages: (p) => (
    <svg {...base} {...p}>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5.5l-3 13" />
    </svg>
  ),
  backend: (p) => (
    <svg {...base} {...p}>
      <rect x="3.5" y="4" width="17" height="6" rx="1.5" />
      <rect x="3.5" y="14" width="17" height="6" rx="1.5" />
      <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6M12 10v4" />
    </svg>
  ),
  databases: (p) => (
    <svg {...base} {...p}>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
    </svg>
  ),
  devops: (p) => (
    <svg {...base} {...p}>
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </svg>
  ),
  security: (p) => (
    <svg {...base} {...p}>
      <path d="M12 3 19 6v5.5c0 4.4-3 8.1-7 9.5-4-1.4-7-5.1-7-9.5V6z" />
      <rect x="9.25" y="10.5" width="5.5" height="4.5" rx="1" />
      <path d="M10.5 10.5V9.25a1.5 1.5 0 0 1 3 0v1.25" />
    </svg>
  ),
  ai: (p) => (
    <svg {...base} {...p}>
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
      <path d="m10 14 2-4 2 4M10.6 12.8h2.8" />
    </svg>
  ),
  also: (p) => (
    <svg {...base} {...p}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 8.5h17M6.5 6.5h.01M8.5 6.5h.01M7 12.5l2.5 2-2.5 2M12 16.5h4" />
    </svg>
  ),
};

export function SkillIcon({ id, ...props }: { id: SkillGroup["id"] } & IconProps) {
  const Icon = icons[id];
  return <Icon {...props} />;
}
