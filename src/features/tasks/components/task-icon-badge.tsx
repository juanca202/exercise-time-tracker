import { colorFromString, isLightColor } from "@/shared/color-from-string";
import { TaskDocumentIcon } from "@/shared/icons/task-document-icon";

interface TaskIconBadgeProps {
  /** Nombre de la Tarea; determina el color de fondo. */
  name: string;
}

/** Cuadro 40×40 con icono de Tarea y fondo derivado del nombre (Figma 1:1452). */
export function TaskIconBadge({ name }: TaskIconBadgeProps) {
  const backgroundColor = colorFromString(name);
  const inkClass = isLightColor(backgroundColor)
    ? "text-primary"
    : "text-white";

  return (
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-[2px] ${inkClass}`}
      style={{ backgroundColor }}
      data-testid="task-icon-badge"
      aria-hidden
    >
      <TaskDocumentIcon className="h-5 w-4" />
    </div>
  );
}
