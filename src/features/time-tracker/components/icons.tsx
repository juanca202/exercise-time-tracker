import { cn } from "@/lib/utils";

export {
  Bars3Icon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  FolderIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export { PlayIcon, StopIcon } from "@heroicons/react/24/solid";

export const iconSize = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

export type IconSize = keyof typeof iconSize;

export function iconClassName(
  size: IconSize = "lg",
  className?: string,
): string {
  return cn(iconSize[size], "shrink-0", className);
}
