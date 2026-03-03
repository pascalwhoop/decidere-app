"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from "lucide-react"
import { useSession, signOut, signIn } from "next-auth/react"

import { isFeatureEnabled } from "@/lib/feature-flags"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!session) {
    if (!isFeatureEnabled("GoogleAuth")) {
      return null
    }

    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="lg">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 px-2"
              onClick={() => signIn("google")}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <User className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Sign In</span>
                {isFeatureEnabled("Saving") && (
                  <span className="truncate text-xs text-muted-foreground">Save your comparisons</span>
                )}
              </div>
            </Button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const user = session.user

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                <AvatarFallback className="rounded-lg">
                  {user?.name?.substring(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback className="rounded-lg">
                    {user?.name?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {isFeatureEnabled("UpgradeToProFlow") && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 size-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
            {(isFeatureEnabled("AccountView") || isFeatureEnabled("Billing") || isFeatureEnabled("Notifications")) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {isFeatureEnabled("AccountView") && (
                    <DropdownMenuItem>
                      <BadgeCheck className="mr-2 size-4" />
                      Account
                    </DropdownMenuItem>
                  )}
                  {isFeatureEnabled("Billing") && (
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 size-4" />
                      Billing
                    </DropdownMenuItem>
                  )}
                  {isFeatureEnabled("Notifications") && (
                    <DropdownMenuItem>
                      <Bell className="mr-2 size-4" />
                      Notifications
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
