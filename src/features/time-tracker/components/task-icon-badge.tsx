"use client";

import { getColorFromName } from "../lib/task-color";
import { ClipboardDocumentCheckIcon, iconClassName } from "./icons";

interface TaskIconBadgeProps {
  taskName: string;
  className?: string;
}

export function TaskIconBadge({ taskName, className }: TaskIconBadgeProps) {
  const { background, foreground } = getColorFromName(taskName, "tarea");

  return (
    <div
      className={className}
      style={{ backgroundColor: background, color: foreground }}
      aria-hidden="true"
    >
      <ClipboardDocumentCheckIcon className={iconClassName("lg")} />
    </div>
  );
}
