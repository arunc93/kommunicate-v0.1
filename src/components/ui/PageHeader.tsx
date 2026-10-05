import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-[#00aeef] rounded-full" />
        <h1 className="text-2xl font-bold text-[#0a192f]">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
