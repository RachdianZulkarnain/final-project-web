"use client";

import { type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

type NavItem = {
  title: string;
  url?: string;
  icon?: Icon;
  children?: NavItem[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup className="rounded-xl border-2 border-black bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-4">
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) =>
            item.children ? (
              <Disclosure key={item.title}>
                {({ open }) => (
                  <div>
                    {/* Parent with toggle */}
                    <SidebarMenuItem className="bg-gray-100 rounded-md border border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                      <div className="flex w-full items-center justify-between">
                        <Link href={item.url || "#"} className="flex-1">
                          <SidebarMenuButton
                            tooltip={item.title}
                            className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-black hover:bg-orange-100 transition-colors"
                          >
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </Link>

                        <Disclosure.Button as="div">
                          <button className="p-2 hover:text-orange-600 transition-transform">
                            <ChevronDown
                              className={`h-4 w-4 transform transition-transform duration-300 ${
                                open ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </Disclosure.Button>
                      </div>
                    </SidebarMenuItem>

                    {/* Children */}
                    <Disclosure.Panel className="ml-4 mt-1 border-l-2 border-black pl-3 space-y-1">
                      {item.children?.map((child) => (
                        <SidebarMenuItem
                          key={child.title}
                          className="hover:bg-orange-100 rounded-md transition-colors"
                        >
                          <Link href={child.url || "#"}>
                            <SidebarMenuButton
                              tooltip={child.title}
                              className="px-2 py-1 text-sm text-black"
                            >
                              <span>{child.title}</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      ))}
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            ) : (
              <Link href={item.url!} key={item.title}>
                <SidebarMenuItem className="rounded-md border border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-orange-100 transition-colors">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-black"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
