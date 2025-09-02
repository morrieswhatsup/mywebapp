import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const HistoryScreen = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('fieldEntries') || '[]');
    setEntries(savedEntries);
    setFilteredEntries(savedEntries);
  }, []);

  useEffect(() => {
    const filtered = entries.filter(entry =>
      entry.clientBusinessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.clientAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.orderNumber && entry.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredEntries(filtered);
  }, [searchTerm, entries]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'pending':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/main')}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Job History</h1>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-white/60" />
              <Input
                type="text"
                placeholder="Search by business name, address, or order number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-blue-400">{entries.length}</p>
              <p className="text-sm text-white/60">Total Jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-green-400">
                {entries.filter(e => e.status === 'completed').length}
              </p>
              <p className="text-sm text-white/60">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-amber-400">
                {entries.filter(e => e.status === 'pending').length}
              </p>
              <p className="text-sm text-white/60">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-white/60">
                  {searchTerm ? 'No entries match your search.' : 'No job entries found.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:bg-white/5 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white text-lg">
                            {entry.clientBusinessName}
                          </h3>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(entry.status)}`}>
                            {getStatusIcon(entry.status)}
                            <span className="capitalize">{entry.status}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-sm text-white/70">
                          <p className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{entry.clientAddress}</span>
                          </p>
                          <p className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(entry.createdAt)}</span>
                          </p>
                          {entry.startJobTime && entry.endJobTime && (
                            <p className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(entry.startJobTime)} - {formatTime(entry.endJobTime)}</span>
                            </p>
                          )}
                        </div>

                        {entry.status === 'completed' && (
                          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/10">
                            <div>
                              <p className="text-xs text-white/50">Order Number</p>
                              <p className="text-sm text-white">{entry.orderNumber || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/50">Distance</p>
                              <p className="text-sm text-white">{entry.kilometers || entry.distanceTravelled} km</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HistoryScreen;