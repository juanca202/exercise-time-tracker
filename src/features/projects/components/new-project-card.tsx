import { PlusIcon } from "@/shared/icons/plus-icon";

interface NewProjectCardProps {
  onClick: () => void;
}

/** Tarjeta de estado vacío para crear un Proyecto (fiel a Figma, nodo 1:1611). */
export function NewProjectCard({ onClick }: NewProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[250px] w-[290px] flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-outline-variant"
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-surface-container-low">
        <PlusIcon className="size-3.5 text-outline" />
      </span>
      <span className="text-base font-bold text-on-surface-variant">
        Crear Nuevo Proyecto
      </span>
    </button>
  );
}
