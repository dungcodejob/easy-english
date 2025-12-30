import type { ReactNode } from 'react';

interface PageWithHeaderLayoutProps {
  header: ReactNode;
  children: ReactNode;
}

export function PageWithHeaderLayout({ header, children }: PageWithHeaderLayoutProps) {
  return (
    <div className="-mx-4 -mt-4 flex flex-col pt-4">
      {header}
      <div className="mx-auto w-full max-w-[1360px] p-4">
        {children}
      </div>
    </div>
  );
}
