import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Minus, 
  X, 
  Calendar, 
  DollarSign, 
  Tag, 
  Clock, 
  PieChart,
  BarChart,
  LineChart as LineChartIcon
} from "lucide-react";

function Income() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState("weekly");
  const [newTransaction, setNewTransaction] = useState({
    type: "income",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    source: "",
    category: ""
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const clearForm = () => {
    setNewTransaction({
      type: "income",
      amount: "",
      date: new Date().toISOString().split('T')[0],
      source: "",
      category: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: name === "amount" ? (value === "" ? "" : parseFloat(value)) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newTransaction.amount || isNaN(newTransaction.amount)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const transaction = {
      ...newTransaction,
      id: Date.now(),
      date: new Date(newTransaction.date).toISOString()
    };

    setTransactions([transaction, ...transactions]);
    setShowModal(false);
    clearForm();
    
    toast({
      title: "Transaction Added",
      description: `${transaction.type === "income" ? "Income" : "Expense"} of $${transaction.amount} recorded successfully`,
    });
  };

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const generateChartData = () => {
    const now = new Date();
    let filteredTransactions = [...transactions];
    let format;
    let groupingFunction;

    if (timeRange === "daily") {
      // Last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filteredTransactions = transactions.filter(t => new Date(t.date) >= oneWeekAgo);
      format = (date) => date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
      groupingFunction = (date) => date.toISOString().split('T')[0];
    } else if (timeRange === "weekly") {
      // Last 4 weeks
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filteredTransactions = transactions.filter(t => new Date(t.date) >= oneMonthAgo);
      format = (date) => {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return `Week of ${weekStart.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}`;
      };
      groupingFunction = (date) => {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart.toISOString().split('T')[0];
      };
    } else {
      // Monthly - last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      filteredTransactions = transactions.filter(t => new Date(t.date) >= sixMonthsAgo);
      format = (date) => date.toLocaleDateString("en-US", { month: 'long' });
      groupingFunction = (date) => `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    // Group transactions by period
    const groups = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const groupKey = groupingFunction(date);
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          name: format(date),
          income: 0,
          expense: 0,
          date: date // Keep for sorting
        };
      }
      
      if (transaction.type === "income") {
        groups[groupKey].income += transaction.amount;
      } else {
        groups[groupKey].expense += transaction.amount;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(groups).sort((a, b) => a.date - b.date);
  };

  const chartData = generateChartData();
  
  // For pie chart
  const categoryData = () => {
    const categories = {};
    transactions.forEach(transaction => {
      const category = transaction.category || "Uncategorized";
      if (!categories[category]) {
        categories[category] = 0;
      }
      if (transaction.type === "expense") {
        categories[category] += transaction.amount;
      }
    });
    
    return Object.keys(categories).map(key => ({
      name: key,
      value: categories[key]
    }));
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({
      title: "Transaction Deleted",
      description: "Transaction has been removed successfully",
    });
  };

  // Custom simplified chart rendering
  const renderSimpleChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No data to display
        </div>
      );
    }

    if (chartType === "line" || chartType === "bar") {
      const maxValue = Math.max(
        ...chartData.map(data => Math.max(data.income, data.expense))
      );
      
      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-end">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                {chartType === "line" ? (
                  <div className="relative w-full flex justify-center">
                    <div 
                      className="w-3 h-3 rounded-full bg-green-500 z-10" 
                      style={{ marginBottom: `${(data.income / maxValue) * 100}%` }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full bg-red-500 ml-2 z-10" 
                      style={{ marginBottom: `${(data.expense / maxValue) * 100}%` }}
                    />
                    {index > 0 && (
                      <>
                        <div 
                          className="absolute h-0.5 bg-green-500"
                          style={{
                            width: `100%`,
                            bottom: `${(data.income / maxValue) * 100}%`,
                            left: "-50%"
                          }}
                        />
                        <div 
                          className="absolute h-0.5 bg-red-500"
                          style={{
                            width: `100%`,
                            bottom: `${(data.expense / maxValue) * 100}%`,
                            left: "-50%"
                          }}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex space-x-1 items-end">
                    <div 
                      className="w-4 bg-green-500 rounded-t"
                      style={{ height: `${(data.income / maxValue) * 100}%` }}
                    />
                    <div 
                      className="w-4 bg-red-500 rounded-t"
                      style={{ height: `${(data.expense / maxValue) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex mt-2 text-xs">
            {chartData.map((data, index) => (
              <div key={`label-${index}`} className="flex-1 text-center overflow-hidden whitespace-nowrap text-ellipsis">
                {data.name}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1" />
              <span>Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1" />
              <span>Expense</span>
            </div>
          </div>
        </div>
      );
    } 
    
    if (chartType === "pie") {
      const pieData = categoryData();
      const total = pieData.reduce((sum, item) => sum + item.value, 0);
      
      if (total === 0) {
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            No expense data to display
          </div>
        );
      }

      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
      
      let currentAngle = 0;
      
      return (
        <div className="flex flex-col h-full items-center justify-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {pieData.map((entry, index) => {
                const percentage = entry.value / total;
                const startAngle = currentAngle;
                const endAngle = currentAngle + percentage * 360;
                currentAngle = endAngle;
                
                // Calculate SVG arc path
                const startRadians = (startAngle - 90) * Math.PI / 180;
                const endRadians = (endAngle - 90) * Math.PI / 180;
                
                const x1 = 50 + 40 * Math.cos(startRadians);
                const y1 = 50 + 40 * Math.sin(startRadians);
                const x2 = 50 + 40 * Math.cos(endRadians);
                const y2 = 50 + 40 * Math.sin(endRadians);
                
                const largeArc = percentage > 0.5 ? 1 : 0;
                
                const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
                
                return (
                  <path 
                    key={index} 
                    d={pathData} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {pieData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-1 rounded-sm" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span>{entry.name}: ${entry.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6 space-y-6 pb-20">
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900 p-4 rounded-lg"
        >
          <p className="text-green-500">Income</p>
          <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900 p-4 rounded-lg"
        >
          <p className="text-red-500">Expenses</p>
          <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-900 p-4 rounded-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Financial Overview</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setChartType("line")}
              className={`p-2 rounded ${chartType === "line" ? "bg-[#5271FF]" : "bg-gray-800"}`}
            >
              <LineChartIcon size={16} />
            </button>
            <button 
              onClick={() => setChartType("bar")}
              className={`p-2 rounded ${chartType === "bar" ? "bg-[#5271FF]" : "bg-gray-800"}`}
            >
              <BarChart size={16} />
            </button>
            <button 
              onClick={() => setChartType("pie")}
              className={`p-2 rounded ${chartType === "pie" ? "bg-[#5271FF]" : "bg-gray-800"}`}
            >
              <PieChart size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex justify-end mb-4">
          <div className="bg-gray-800 rounded-md overflow-hidden flex text-sm">
            <button 
              className={`px-3 py-1 ${timeRange === "daily" ? "bg-[#5271FF]" : ""}`}
              onClick={() => setTimeRange("daily")}
            >
              Daily
            </button>
            <button 
              className={`px-3 py-1 ${timeRange === "weekly" ? "bg-[#5271FF]" : ""}`}
              onClick={() => setTimeRange("weekly")}
            >
              Weekly
            </button>
            <button 
              className={`px-3 py-1 ${timeRange === "monthly" ? "bg-[#5271FF]" : ""}`}
              onClick={() => setTimeRange("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <div className="h-64 p-2">
          {renderSimpleChart()}
        </div>
      </motion.div>

      <Button
        className="flex-1 w-full bg-[#5271FF] hover:bg-[#5271FF]/90"
        onClick={() => setShowModal(true)}
      >
        <Plus className="w-4 h-4 mr-2" /> Add Transaction
      </Button>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No transactions yet</p>
          ) : (
            transactions.map(transaction => (
              <motion.div
                key={transaction.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  transaction.type === "income" ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                <div>
                  <div className="flex items-center">
                    <p className={transaction.type === "income" ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                      {transaction.type === "income" ? "Income" : "Expense"}
                    </p>
                    {transaction.category && (
                      <span className="ml-2 bg-gray-800 text-xs px-2 py-0.5 rounded-full">
                        {transaction.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                  {transaction.source && (
                    <p className="text-xs text-gray-500">Source: {transaction.source}</p>
                  )}
                </div>
                <div className="flex items-center">
                  <p className="text-lg font-semibold mr-3">${transaction.amount.toFixed(2)}</p>
                  <button 
                    onClick={() => deleteTransaction(transaction.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-lg max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add Transaction</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-2 flex">
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-md transition ${
                    newTransaction.type === "income" ? "bg-green-500 text-white" : "text-green-500"
                  }`}
                  onClick={() => setNewTransaction({...newTransaction, type: "income"})}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-md transition ${
                    newTransaction.type === "expense" ? "bg-red-500 text-white" : "text-red-500"
                  }`}
                  onClick={() => setNewTransaction({...newTransaction, type: "expense"})}
                >
                  Expense
                </button>
              </div>

              <div>
                <label className="flex items-center text-gray-400 mb-1">
                  <DollarSign size={16} className="mr-1" /> Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-gray-400 mb-1">
                  <Calendar size={16} className="mr-1" /> Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-gray-400 mb-1">
                  <Tag size={16} className="mr-1" /> Category
                </label>
                <select
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                >
                  <option value="">Select Category</option>
                  {newTransaction.type === "income" ? (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investments">Investments</option>
                      <option value="Rideshare">Rideshare</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Fuel">Fuel</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Food">Food</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="flex items-center text-gray-400 mb-1">
                  <Clock size={16} className="mr-1" /> Source/Description
                </label>
                <input
                  type="text"
                  name="source"
                  value={newTransaction.source}
                  onChange={handleInputChange}
                  placeholder={newTransaction.type === "income" ? "Uber, Lyft, etc." : "Gas station, repair shop, etc."}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-700 rounded text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-white ${
                    newTransaction.type === "income" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Add {newTransaction.type === "income" ? "Income" : "Expense"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Income;