import { useState } from "react";
import { Crown, Home, Sun, Heart, Brain, Map, Sparkles, BookOpen, BarChart, Menu, Star, Moon, HelpCircle, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export function EterniaSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { t, language } = useTranslation();
  
  // Helper function to create language-aware URLs
  const createUrl = (path: string) => {
    if (language === 'pt') {
      return path === '/' ? '/pt' : `/pt${path}`;
    }
    return path;
  };

  const navigationGroups = [
    {
      label: t('sidebar.main'),
      items: [
        { title: t('sidebar.dashboard'), url: createUrl("/"), icon: Home },
        { title: t('sidebar.horoscope'), url: createUrl("/horoscope"), icon: Sun },
      ]
    },
    {
      label: t('sidebar.discover'),
      items: [
        { title: t('sidebar.compatibility'), url: createUrl("/compatibility"), icon: Heart },
        { title: t('sidebar.loveSketch'), url: createUrl("/love-sketch"), icon: Palette },
        { title: t('sidebar.oracle'), url: createUrl("/ai-oracle"), icon: Brain },
        { title: t('sidebar.tarot'), url: createUrl("/tarot"), icon: Sparkles },
      ]
    },
    {
      label: t('sidebar.advanced'), 
      items: [
        { title: t('sidebar.astralMap'), url: createUrl("/astral-map"), icon: Map },
        { title: t('sidebar.diary'), url: createUrl("/diary"), icon: BookOpen },
        { title: t('sidebar.weeklyReport'), url: createUrl("/weekly-report"), icon: BarChart },
      ]
    }
  ];

  const isActive = (path: string) => {
    // Handle root path for both languages
    if (path === "/" && currentPath === "/") return true;
    if (path === "/pt" && currentPath === "/pt") return true;
    
    // Handle other paths
    return currentPath === path;
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `transition-all duration-300 ${
      isActive 
        ? "bg-primary/20 text-primary border-r-2 border-primary cosmic-glow" 
        : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
    }`;

  return (
    <Sidebar
      className={`${!open ? "w-16" : "w-72"} transition-all duration-300 border-r border-primary/20`}
    >
      <SidebarHeader 
        className="border-b border-white/10"
        style={{ background: "var(--gradient-mystic)" }}
      >
        <div className="flex flex-col items-center py-6" style={{ background: "transparent" }}>
          {open && (
            <div className="flex items-center justify-center" style={{ backgroundColor: 'transparent', background: 'transparent' }}>
              <img 
                src="/assets/eternia-logo-test.png?v=2" 
                alt="Eternia Logo" 
                className="w-auto h-20 object-contain"
                style={{ 
                  backgroundColor: 'transparent', 
                  background: 'transparent',
                  mixBlendMode: 'normal',
                  filter: 'none'
                }}
              />
            </div>
          )}
          {!open && (
            <img 
              src="/assets/eternia-logo-test.png?v=2" 
              alt="Eternia Logo" 
              className="w-12 h-12 object-contain mx-auto"
              style={{ 
                backgroundColor: 'transparent', 
                background: 'transparent',
                mixBlendMode: 'normal',
                filter: 'none'
              }}
            />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-mystic">
        {navigationGroups.map((group, groupIndex) => {
          const hasActiveItem = group.items.some(item => isActive(item.url));
          
          return (
            <SidebarGroup 
              key={group.label}
              className="px-3 py-2"
            >
              {open && (
                <SidebarGroupLabel className="text-foreground/60 text-xs font-medium mb-2 uppercase tracking-wide">
                  {group.label}
                </SidebarGroupLabel>
              )}

              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {group.items.map((item) => {
                    const IconComponent = item.icon;
                    const active = isActive(item.url);
                    
                    return (
                      <SidebarMenuItem key={item.title}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton asChild>
                                 <NavLink 
                                   to={item.url} 
                                   end 
                                   className={getNavCls({ isActive: active })}
                                 >
                                   <div className="flex items-center w-full py-2 px-3 rounded-lg">
                                     <IconComponent className="h-4 w-4 mr-3" />
                                     {open && (
                                       <span className="text-sm font-medium">
                                         {item.title}
                                       </span>
                                     )}
                                   </div>
                                 </NavLink>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                             {!open && (
                               <TooltipContent side="right" className="bg-card border border-primary/20">
                                 <p className="text-sm font-medium">{item.title}</p>
                               </TooltipContent>
                             )}
                          </Tooltip>
                        </TooltipProvider>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}

      </SidebarContent>
    </Sidebar>
  );
}