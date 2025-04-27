
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Map, DollarSign, PieChart } from "lucide-react";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/map", icon: Map, label: "Map" },
    { path: "/income", icon: DollarSign, label: "Income" },
    { path: "/budget", icon: PieChart, label: "Budget" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 w-full bg-black border-t border-[#5271FF]/20">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="relative flex flex-col items-center justify-center w-full h-full"
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "text-[#5271FF]" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs mt-1 ${
                    isActive ? "text-[#5271FF]" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 w-1 h-1 rounded-full bg-[#5271FF]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default Layout;
