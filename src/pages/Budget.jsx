import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Target, TrendingUp } from "lucide-react";

function Budget() {
  const { toast } = useToast();
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("budget");
    return saved ? JSON.parse(saved) : {
      monthlyGoal: 5000,
      currentSavings: 0,
      expenses: {
        fuel: 0,
        maintenance: 0,
        insurance: 0,
        other: 0
      }
    };
  });

  useEffect(() => {
    localStorage.setItem("budget", JSON.stringify(budget));
  }, [budget]);

  const totalExpenses = Object.values(budget.expenses).reduce((a, b) => a + b, 0);
  
  // Calculate net savings (savings minus expenses)
  const netSavings = budget.currentSavings - totalExpenses;
  
  // Calculate progress based on net savings relative to goal
  const progress = Math.max(0, Math.min(100, (netSavings / budget.monthlyGoal) * 100));

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 p-6 rounded-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Monthly Goal</h2>
          <Target className="text-[#5271FF] w-6 h-6" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Progress</span>
            <span>${netSavings.toFixed(2)} / ${budget.monthlyGoal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Savings: ${budget.currentSavings.toFixed(2)}</span>
            <span>Expenses: ${totalExpenses.toFixed(2)}</span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full ${netSavings < 0 ? 'bg-red-500' : 'bg-[#5271FF]'}`}
            />
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Expense Breakdown</h2>
          <TrendingUp className="text-[#5271FF] w-6 h-6" />
        </div>
        
        {Object.entries(budget.expenses).map(([category, amount]) => (
          <motion.div
            key={category}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-gray-900 p-4 rounded-lg"
          >
            <div className="flex justify-between items-center">
              <span className="capitalize">{category}</span>
              <span>${amount.toFixed(2)}</span>
            </div>
            <Button
              variant="outline"
              className="w-full mt-2 border-[#5271FF] text-[#5271FF] hover:bg-[#5271FF]/10"
              onClick={() => {
                const newAmount = prompt(`Enter new ${category} expense amount:`);
                if (newAmount && !isNaN(newAmount)) {
                  setBudget(prev => ({
                    ...prev,
                    expenses: {
                      ...prev.expenses,
                      [category]: parseFloat(newAmount)
                    }
                  }));
                  toast({
                    title: "Expense Updated",
                    description: `${category} expense updated to $${newAmount}`,
                  });
                }
              }}
            >
              Update {category}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 bg-gray-900 p-4 rounded-lg">
        <Button
          className="w-full bg-[#5271FF] hover:bg-[#5271FF]/90 mb-2"
          onClick={() => {
            const newSavings = prompt("Enter current savings amount:", budget.currentSavings);
            if (newSavings !== null && !isNaN(newSavings)) {
              setBudget(prev => ({ ...prev, currentSavings: parseFloat(newSavings) }));
              toast({
                title: "Savings Updated",
                description: `Current savings updated to $${newSavings}`,
              });
            }
          }}
        >
          Update Current Savings
        </Button>
        
        <Button
          className="w-full bg-[#5271FF] hover:bg-[#5271FF]/90"
          onClick={() => {
            const newGoal = prompt("Enter new monthly goal:", budget.monthlyGoal);
            if (newGoal !== null && !isNaN(newGoal)) {
              setBudget(prev => ({ ...prev, monthlyGoal: parseFloat(newGoal) }));
              toast({
                title: "Goal Updated",
                description: `Monthly goal updated to $${newGoal}`,
              });
            }
          }}
        >
          Update Monthly Goal
        </Button>
      </div>

      <div className="h-20"></div> {/* Space at bottom for fixed button */}
    </div>
  );
}

export default Budget;