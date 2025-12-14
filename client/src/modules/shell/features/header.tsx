import { SidebarTrigger } from '@shared/ui/shadcn/sidebar';
import { ModeSwitcher } from './mode-switcher';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@shared/ui/shadcn/breadcrumb';
import { Separator } from '@shared/ui/shadcn/separator';
import { SearchMenu } from './search-menu';

export function SiteHeader() {
  return (
    <header className="flex flex-col w-full h-full shrink-0 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex justify-between items-center w-full h-full">
        <nav className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 !h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        <nav className="flex items-center gap-0.5 px-4">
          <SearchMenu />

          <ModeSwitcher />
        </nav>
      </div>
      <Separator orientation="horizontal" />
    </header>
  );
}
