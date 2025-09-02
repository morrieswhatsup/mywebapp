import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Plus, History, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const MainScreen = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(currentUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userLocation');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    navigate('/');
  };

  const handleNewEntry = () => {
    navigate('/new-entry');
  };

  const handleHistory = () => {
    navigate('/history');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Welcome back!</CardTitle>
                  <p className="text-white/70 text-sm">{user.name}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-400/30 text-red-400 hover:bg-red-400/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Location Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-green-400">Location Services Active</p>
                <p className="text-sm text-white/60">GPS tracking enabled for field operations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Actions */}
        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleNewEntry}
              className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl text-lg"
            >
              <Plus className="w-6 h-6 mr-3" />
              Submit New Entry
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleHistory}
              className="w-full h-16 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl text-lg"
            >
              <History className="w-6 h-6 mr-3" />
              View History
            </Button>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {JSON.parse(localStorage.getItem('fieldEntries') || '[]').filter(entry => 
                    new Date(entry.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
                <p className="text-sm text-white/60">Jobs Today</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {JSON.parse(localStorage.getItem('fieldEntries') || '[]').filter(entry => 
                    entry.status === 'completed'
                  ).length}
                </p>
                <p className="text-sm text-white/60">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MainScreen;