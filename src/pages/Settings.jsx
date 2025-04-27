
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronLeft, Bell, Lock, User, Car, Moon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const settingsOptions = [
    { icon: Bell, label: "Notifications", onClick: () => handleSettingClick("Notifications") },
    { icon: Lock, label: "Privacy & Security", onClick: () => handleSettingClick("Privacy") },
    { icon: User, label: "Account Settings", onClick: () => handleSettingClick("Account") },
    { icon: Car, label: "Vehicle Information", onClick: () => handleSettingClick("Vehicle") },
    { icon: Moon, label: "Dark Mode", onClick: () => handleSettingClick("Theme") },
  ];

  const handleSettingClick = (setting) => {
    toast({
      title: setting,
      description: `${setting} settings will be available soon!`,
    });
  };

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="p-0 hover:bg-transparent"
        >
          <ChevronLeft className="h-6 w-6 text-[#5271FF]" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {settingsOptions.map((option, index) => (
          <motion.div
            key={option.label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="ghost"
              onClick={option.onClick}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-900"
            >
              <div className="flex items-center space-x-3">
                <option.icon className="w-5 h-5 text-[#5271FF]" />
                <span>{option.label}</span>
              </div>
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute bottom-24 left-6 right-6">
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center space-x-2"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/auth";
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
}

export default Settings;
