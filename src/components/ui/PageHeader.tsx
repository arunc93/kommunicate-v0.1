import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, eyebrow, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
        <h1 className="mt-1 break-words text-[28px] font-semibold leading-8 tracking-[-0.02em] text-text">
          {title}
        </h1>
        {description ? <p className="mt-1.5 text-sm text-text-muted">{description}</p> : null}
      </div>
      {children ? <div className="flex items-center gap-3">{children}</div> : null}
    </div>
  );
}
