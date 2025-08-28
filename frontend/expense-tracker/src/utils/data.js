import { LayoutDashboard, Coins, Wallet, LogOut } from "lucide-react";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Budget",
    icon: Coins,
    path: "/budget",
  },
  {
    id: "03",
    label: "Expenses",
    icon: Wallet,
    path: "/expense",
  },
  {
    id: "04",
    label: "LogOut",
    icon: LogOut,
    path: "/logout",
  },
];
