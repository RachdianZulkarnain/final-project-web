"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Disclosure } from "@headlessui/react";
import { type Icon } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

type NavItem = {
  title: string;
  url?: string;
  icon?: Icon;
  children?: NavItem[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup className="rounded-xl border-2 border-[#0290D1] h-full bg-white shadow-[4px_4px_0_0_rgba(2,144,209,1)] p-4">
      <SidebarGroupContent className="flex flex-col pt gap-2">
        <SidebarMenu>
          {items.map((item) =>
            item.children ? (
              <Disclosure key={item.title}>
                {({ open }) => (
                  <div>
                    <motion.div
                      whileHover={{ scale: 1.03, x: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="mt-5"
                    >
                      <SidebarMenuItem className="bg-gray-100 rounded-md border border-[#0290D1] shadow-[2px_2px_0_0_rgba(2,144,209,1)]">
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
                            <motion.button
                              className="p-2 hover:text-orange-600"
                              animate={{ rotate: open ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </motion.button>
                          </Disclosure.Button>
                        </div>
                      </SidebarMenuItem>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            className="ml-2 mt-3 pl-3 space-y-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {item.children?.map((child) => (
                              <motion.div
                                key={child.title}
                                whileHover={{ x: 5, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <SidebarMenuItem className="hover:bg-orange-100 rounded-md transition-colors">
                                  <Link href={child.url || "#"}>
                                    <SidebarMenuButton
                                      tooltip={child.title}
                                      className="flex items-center gap-2 px-3 py-2 text-sm text-black"
                                    >
                                      {child.icon && (
                                        <child.icon className="h-4 w-4" />
                                      )}
                                      <span>{child.title}</span>
                                    </SidebarMenuButton>
                                  </Link>
                                </SidebarMenuItem>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                )}
              </Disclosure>
            ) : (
              <motion.div
                key={item.title}
                whileHover={{ scale: 1.03, x: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mt-5"
              >
                <Link href={item.url!}>
                  <SidebarMenuItem className="rounded-md border border-[#0290D1] shadow-[2px_2px_0_0_rgba(2,144,209,1)] hover:bg-orange-100 transition-colors">
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-black"
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              </motion.div>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
