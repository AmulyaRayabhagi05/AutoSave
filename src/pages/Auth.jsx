
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function Auth({ onLogin }) {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    name: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // For demo purposes, we'll just log in immediately
    localStorage.setItem("user", JSON.stringify({
      name: formData.name || "Driver",
      email: formData.email,
      phone: formData.phone
    }));
    onLogin();
  };

  return (
    <div className="min-h-screen bg-black p-6 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <img  alt="Auto Save Logo" className="w-72 h-42 mx-auto" src="src\images\autosave-car.png" />
          <h1 className="text-3xl font-bold text-[#5271FF]">AUTO SAVE</h1>
          <p className="text-gray-400">YOUR FINANCIAL GUIDE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-900 border border-[#5271FF]/20 text-white"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-900 border border-[#5271FF]/20 text-white"
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 rounded-lg bg-gray-900 border border-[#5271FF]/20 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-3 rounded-lg bg-gray-900 border border-[#5271FF]/20 text-white"
          />
          
          <Button
            type="submit"
            className="w-full bg-[#5271FF] hover:bg-[#5271FF]/90 text-white py-6"
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#5271FF] hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default Auth;
