import type { ComponentType } from "react";
import { colorFromString, isLightColor } from "@/shared/color-from-string";
import { formatHoursMinutesWords } from "@/shared/format-duration";
import type { ProjectPeriodTotal } from "../top-projects-for-period";
import {
  FeaturedAppsIcon,
  FeaturedFolderIcon,
  FeaturedLayoutIcon,
} from "./featured-project-icons";

interface FeaturedProjectCardsProps {
  items: ProjectPeriodTotal[];
}

const ICON_VARIANTS: ComponentType<{ className?: string }>[] = [
  FeaturedFolderIcon,
  FeaturedAppsIcon,
  FeaturedLayoutIcon,
];

/** Tarjetas de proyectos destacados del periodo (fiel a Figma, nodo 1:1762). */
export function FeaturedProjectCards({ items }: FeaturedProjectCardsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-6">
      {items.map((item, index) => {
        const Icon = ICON_VARIANTS[index % ICON_VARIANTS.length]!;
        const backgroundColor = colorFromString(item.project.name);
        const inkClass = isLightColor(backgroundColor)
          ? "text-primary"
          : "text-white";

        return (
          <div
            key={item.project.id}
            className="flex w-[301px] flex-col gap-4 rounded-lg border border-outline-variant bg-white p-[25px] shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded ${inkClass}`}
                style={{ backgroundColor }}
                data-testid="featured-project-icon"
              >
                <Icon className="size-4" />
              </div>
              <p className="font-mono text-xs font-medium tracking-[0.6px] text-on-surface-variant uppercase">
                {item.project.name}
              </p>
            </div>
            <p className="text-2xl font-semibold text-primary">
              {formatHoursMinutesWords(item.totalSeconds)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
