"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  ShieldAlert,
  FolderOpen,
  ShieldCheck,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardSidebar({ 
  isAdminView = false, 
  userHasAdminPrivileges = false 
}: { 
  isAdminView?: boolean;
  userHasAdminPrivileges?: boolean;
}) {
  const pathname = usePathname();

  const userLinks = [
    { name: "My Prompts", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Prompt", href: "/dashboard/prompt/new", icon: PlusCircle },
    { name: "Member Prompts", href: "/dashboard/member-prompts", icon: FolderOpen },
  ];

  const adminLinks = [
    { name: "Analytics", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Users", href: "/admin/users", icon: Users },
    { name: "Moderation", href: "/admin/prompts", icon: ShieldAlert },
    { name: "Member Prompts", href: "/dashboard/member-prompts", icon: FolderOpen },
  ];

  const links = isAdminView ? adminLinks : userLinks;

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col p-4 space-y-4">
      <div className="flex items-center gap-2 px-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
          P
        </div>
        <span className="text-xl font-bold tracking-tight">PromptLibrary</span>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 pt-4 border-t border-border/50 mt-auto">
        {userHasAdminPrivileges && (
          <Link
            href={isAdminView ? "/dashboard" : "/admin"}
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-primary hover:bg-primary/10"
          >
            {isAdminView ? (
              <>
                <User className="w-4 h-4" />
                User Dashboard
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </>
            )}
          </Link>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-bold">{userHasAdminPrivileges ? "AD" : "JD"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{userHasAdminPrivileges ? "Admin User" : "John Doe"}</span>
            <span className="text-xs text-muted-foreground">{userHasAdminPrivileges ? "Premium (Admin)" : "Free Tier"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
