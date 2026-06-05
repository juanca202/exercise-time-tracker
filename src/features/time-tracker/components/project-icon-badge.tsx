"use client";

import { getProjectColorFromName } from "../lib/task-color";
import { FolderIcon, iconClassName } from "./icons";

interface ProjectIconBadgeProps {
  projectName: string;
  className?: string;
}

export function ProjectIconBadge({
  projectName,
  className,
}: ProjectIconBadgeProps) {
  const { background, foreground } = getProjectColorFromName(projectName);

  return (
    <div
      className={className}
      style={{ backgroundColor: background, color: foreground }}
      aria-hidden="true"
    >
      <FolderIcon className={iconClassName("sm")} />
    </div>
  );
}
