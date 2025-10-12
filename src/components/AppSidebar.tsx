import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  CreditCard,
  Eye,
  Upload,
  Settings,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Overview', url: '/', icon: LayoutDashboard },
  { title: 'Proveedores', url: '/suppliers', icon: Users },
  { title: 'Órdenes', url: '/orders', icon: ShoppingCart },
  { title: 'Inventario', url: '/inventory', icon: Package },
  { title: 'Pagos', url: '/payments', icon: CreditCard },
  { title: 'Consumer Insights', url: '/consumer-insights', icon: Eye },
  { title: 'Uploads', url: '/uploads', icon: Upload },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground">
            {open && 'Synergic Nexum'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
