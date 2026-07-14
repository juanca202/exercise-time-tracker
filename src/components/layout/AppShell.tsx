import Link from "next/link";
import type { ReactNode } from "react";

type NavItemId = "tasks" | "projects" | "history";

interface NavItem {
  id: NavItemId;
  label: string;
  href: string;
  icon: ReactNode;
}

function TasksIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className="size-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="m8.5 12.5 2.5 2.5 4.5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className="size-5"
    >
      <path
        d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className="size-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  { id: "tasks", label: "Tareas", href: "/tasks", icon: <TasksIcon /> },
  {
    id: "projects",
    label: "Proyectos",
    href: "/projects",
    icon: <ProjectsIcon />,
  },
  {
    id: "history",
    label: "Historial de registros",
    href: "/history",
    icon: <HistoryIcon />,
  },
];

interface AppShellProps {
  /** Sección activa en el SideNavBar; también se usa como subtítulo bajo el nombre de la app. */
  activeNav: NavItemId;
  /** Acción principal de la sección actual, mostrada en el TopAppBar (p. ej. "Nuevo Proyecto"). */
  headerAction?: ReactNode;
  children: ReactNode;
}

/** Shell compartido de la aplicación: SideNavBar fijo + TopAppBar, conforme al prototipo Figma. */
export function AppShell({ activeNav, headerAction, children }: AppShellProps) {
  const activeLabel =
    NAV_ITEMS.find((item) => item.id === activeNav)?.label ?? "";

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-outline-variant bg-surface px-4 py-6">
        <div className="mb-10 px-2">
          <h1 className="text-2xl font-bold text-primary">TimeTracker</h1>
          <p className="text-base text-on-surface-variant/70">{activeLabel}</p>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeNav;
            const className = isActive
              ? "flex items-center gap-3 rounded border-l-2 border-secondary bg-surface-container-low py-3 pl-[14px] pr-4 text-sm font-bold text-primary"
              : "flex items-center gap-3 rounded py-3 px-4 text-sm text-on-surface-variant";

            return (
              <Link key={item.id} href={item.href} className={className}>
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center bg-surface px-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          {headerAction}
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
