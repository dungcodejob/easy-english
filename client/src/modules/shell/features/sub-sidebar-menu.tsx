'use client';

import { Separator } from '@shared/ui/shadcn/separator';
import { useSidebar } from '@shared/ui/shadcn/sidebar';
import { type FC, useEffect } from 'react';
import type { MenuGroup } from '../ui/nav-group';
import { NavItem } from '../ui/nav-item';

type SubSidebarMenuProps = {
  title: string;
  groups: MenuGroup[];
};

const SubSidebarMenu: FC<SubSidebarMenuProps> = ({ title, groups }) => {
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);

    return () => {
      setOpen(true);
    };
  }, [setOpen]);

  return (
    <>
      <div className="hidden bg-sidebar w-[16rem] shrink-0 flex-col border-r border-stroke-soft-200 lg:flex max-h-screen overflow-hidden">
        <div className="px-4 flex-none h-12 flex items-center">
          <div className="text-label-lg text-text-strong-950">{title}</div>
        </div>
        <Separator orientation="horizontal" />
        <div className="py-3">
          {groups.map(({ items, title, id }) => (
            <div
              key={id}
              className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
            >
              <nav className="grid gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                <div className="relative flex w-full items-center px-2 py-1 text-xs font-medium text-sidebar-foreground/70">
                  {title}
                </div>
                {items.map((item, index) => (
                  <NavItem key={item.id} item={item} />
                ))}
                <Separator orientation="horizontal" className="mt-2" />
              </nav>
            </div>
          ))}
        </div>

        {/* <Divider.Root className="px-2" />

        <TabMenuVertical.Root
          defaultValue={pathname}
          className="flex w-full flex-col lg:flex-row flex-auto overflow-y-auto px-2 py-3"
        >
          <TabMenuVertical.List className="h-max">
            {items.map(({ uuid, label, children }, i, arr) => (
              <React.Fragment key={uuid}>
                <div className="flex flex-col gap-2">
                  <Divider.Root variant="text">{label}</Divider.Root>
                  {children?.map(
                    ({ uuid, label, icon: Icon, link, hidden }) => {
                      if (hidden) {
                        return null;
                      }
                      return (
                        <TabMenuVertical.Trigger
                          key={uuid}
                          asChild
                          value={link as string}
                        >
                          <Link to={link}>
                            {Icon && <TabMenuVertical.Icon as={Icon} />}
                            {label}
                            <TabMenuVertical.ArrowIcon as={RiArrowRightSLine} />
                          </Link>
                        </TabMenuVertical.Trigger>
                      );
                    },
                  )}
                </div>
                {i < arr.length - 1 && <Divider.Root variant="line-spacing" />}
              </React.Fragment>
            ))}
          </TabMenuVertical.List>
        </TabMenuVertical.Root> */}
      </div>
      {/* <div className="p-4 pb-0 lg:hidden">
        <Select.Root
          defaultValue={pathname}
          onValueChange={(href) => navigate({ to: href })}
        >
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {items.map(({ uuid, label, icon: Icon, link }) => (
              <Select.Group key={uuid}>
                <Select.GroupLabel className="mb-1 mt-2 px-2 py-1 text-subheading-xs text-text-soft-400">
                  {label}
                </Select.GroupLabel>
                <Select.Item key={uuid} value={link as string}>
                  <Select.ItemIcon as={Icon} />
                  {label}
                </Select.Item>
              </Select.Group>
            ))}
          </Select.Content>
        </Select.Root>
      </div> */}
    </>
  );
};

export default SubSidebarMenu;
