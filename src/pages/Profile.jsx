import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Settings, HelpCircle, Star, Edit2, Camera, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : {
      name: "Chicken Jockey",
      email: "abc123@gmail.com",
      phone: "123-456-7890",
      profilePicture: null
    };
  });

  const [vehicle, setVehicle] = useState(() => {
    const saved = localStorage.getItem("vehicle");
    return saved ? JSON.parse(saved) : {
      make: "BMW",
      year: "2023",
      model: "M5",
      mileage: "15,000"
    };
  });

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editValues, setEditValues] = useState({});

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("vehicle", JSON.stringify(vehicle));
  }, [vehicle]);

  // Open edit modal for different fields
  const openEditModal = (type, initialValues = {}) => {
    setModalType(type);
    setEditValues(initialValues);
    setModalOpen(true);
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
        toast({
          title: "Profile Picture Updated",
          description: "Your profile picture has been updated successfully."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save user info changes
  const saveUserInfo = () => {
    setUser(prev => ({
      ...prev,
      ...editValues
    }));
    setModalOpen(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully."
    });
  };

  // Save vehicle info changes
  const saveVehicleInfo = () => {
    setVehicle(prev => ({
      ...prev,
      ...editValues
    }));
    setModalOpen(false);
    toast({
      title: "Vehicle Updated",
      description: "Your vehicle information has been updated successfully."
    });
  };

  return (
    <div className="min-h-screen bg-black p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1b26] rounded-3xl p-6 text-center space-y-4 relative"
      >
        <h2 className="text-xl font-semibold text-white">Your Profile</h2>
        
        <div className="relative inline-block">
          <div 
            className="w-24 h-24 rounded-full bg-gray-700 mx-auto overflow-hidden"
            style={user.profilePicture ? { 
              backgroundImage: `url(${user.profilePicture})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {}}
          />
          <button 
            className="absolute bottom-0 right-0 bg-[#5271FF] p-2 rounded-full"
            onClick={() => document.getElementById('profile-pic-input').click()}
          >
            <Camera className="w-4 h-4 text-white" />
            <input 
              id="profile-pic-input" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleProfilePictureChange} 
            />
          </button>
        </div>
        
        <div className="space-y-2 relative">
          <div className="flex items-center justify-center">
            <p className="text-lg">Hello, <span className="font-semibold">{user.name}</span></p>
            <button 
              className="ml-2 text-[#5271FF]"
              onClick={() => openEditModal('name', { name: user.name })}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4].map((star) => (
              <Star key={star} className="w-6 h-6 fill-[#5271FF] text-[#5271FF]" />
            ))}
            <Star className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <div className="space-y-2 flex justify-between items-center">
          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-xl">{user.email}</p>
          </div>
          <button 
            className="text-[#5271FF]"
            onClick={() => openEditModal('email', { email: user.email })}
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-2 flex justify-between items-center">
          <div>
            <p className="text-gray-400">Phone number</p>
            <p className="text-xl">{user.phone}</p>
          </div>
          <button 
            className="text-[#5271FF]"
            onClick={() => openEditModal('phone', { phone: user.phone })}
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#5271FF] rounded-3xl p-6 space-y-4 relative"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Vehicle Stats</h3>
          <button 
            className="text-white"
            onClick={() => openEditModal('vehicle', { ...vehicle })}
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-200">make</p>
            <p className="font-semibold">{vehicle.make}</p>
          </div>
          <div>
            <p className="text-gray-200">year</p>
            <p className="font-semibold">{vehicle.year}</p>
          </div>
          <div>
            <p className="text-gray-200">model</p>
            <p className="font-semibold">{vehicle.model}</p>
          </div>
          <div>
            <p className="text-gray-200">mileage</p>
            <p className="font-semibold">{vehicle.mileage}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4 mt-8">
        <Button
          variant="ghost"
          className="w-full flex items-center space-x-3 text-left p-4"
          onClick={() => navigate('/settings')}
        >
          <Settings className="w-6 h-6 text-[#5271FF]" />
          <span>Settings</span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full flex items-center space-x-3 text-left p-4"
          onClick={() => {
            toast({
              title: "Support",
              description: "Our support team will contact you shortly.",
            });
          }}
        >
          <HelpCircle className="w-6 h-6 text-[#5271FF]" />
          <span>Help/support</span>
        </Button>
      </div>

      {/* Custom Modal for Editing */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1b26] rounded-lg max-w-md w-full p-6 relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-semibold mb-4">
              {modalType === 'name' && "Edit Name"}
              {modalType === 'email' && "Edit Email"}
              {modalType === 'phone' && "Edit Phone Number"}
              {modalType === 'vehicle' && "Edit Vehicle Information"}
            </h3>
            
            {/* Name Edit */}
            {modalType === 'name' && (
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={editValues.name || ""}
                  onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                />
              </div>
            )}

            {/* Email Edit */}
            {modalType === 'email' && (
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={editValues.email || ""}
                  onChange={e => setEditValues({ ...editValues, email: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                />
              </div>
            )}

            {/* Phone Edit */}
            {modalType === 'phone' && (
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={editValues.phone || ""}
                  onChange={e => setEditValues({ ...editValues, phone: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                />
              </div>
            )}

            {/* Vehicle Edit */}
            {modalType === 'vehicle' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-400 mb-2">Make</label>
                  <input
                    type="text"
                    value={editValues.make || ""}
                    onChange={e => setEditValues({ ...editValues, make: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Year</label>
                  <input
                    type="text"
                    value={editValues.year || ""}
                    onChange={e => setEditValues({ ...editValues, year: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Model</label>
                  <input
                    type="text"
                    value={editValues.model || ""}
                    onChange={e => setEditValues({ ...editValues, model: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Mileage</label>
                  <input
                    type="text"
                    value={editValues.mileage || ""}
                    onChange={e => setEditValues({ ...editValues, mileage: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-700 rounded text-gray-300 hover:bg-gray-800"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-[#5271FF] rounded text-white hover:bg-[#5271FF]/90"
                onClick={() => {
                  if (modalType === 'vehicle') {
                    saveVehicleInfo();
                  } else {
                    saveUserInfo();
                  }
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;