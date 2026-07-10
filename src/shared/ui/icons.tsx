type IconProps = { className?: string };

export function IconFolder({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2.5 5.5a1.5 1.5 0 0 1 1.5-1.5h3.4l1.6 2h6.5a1.5 1.5 0 0 1 1.5 1.5v6.5a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCheckCircle({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="7.25"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M7 10.2 9 12l4-4.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconStopwatch({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="11"
        r="6.75"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10 7.5V11l2.5 1.5M8 2.5h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 4.8V8l2.2 1.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconStopSquare({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="10" height="10" rx="1.5" />
    </svg>
  );
}

export function IconChevronLeft({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 8 12"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 1 2 6l5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 8 12"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconX({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1 1l12 12M13 1 1 13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 1v12M1 7h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconPlay({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 11 14"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 0 11 7 0 14V0Z" />
    </svg>
  );
}

export function IconDocument({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 1.5h8L14 5.5V18a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 1.5V5h4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
