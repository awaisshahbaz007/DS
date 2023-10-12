// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  moduleName: string;
  iconType: string;
  icon: string;
  icon_active: string;
  class: string;
  groupTitle: boolean;
  badge: string;
  badgeClass: string;
  role: string[];
  submenu: RouteInfo[];
}
