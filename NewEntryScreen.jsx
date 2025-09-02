import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Phone, Building, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const NewEntryScreen = () => {
  const [formData, setFormData] = useState({
    clientBusinessName: '',
    clientAddress: '',
    clientContact: '',
    distanceTravelled: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');
    setIsFormComplete(allFieldsFilled);
  }, [formData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const searchBusinessInfo = async (businessName) => {
    if (!businessName.trim()) return;

    setIsSearching(true);
    
    // Simulate API search with realistic South African business data
    setTimeout(() => {
      const mockBusinessData = {
        'Pick n Pay': {
          address: '123 Main Road, Cape Town, Western Cape, 8001',
          contact: '+27 21 658 1000',
          distance: '15.2'
        },
        'Shoprite': {
          address: '456 Church Street, Johannesburg, Gauteng, 2000',
          contact: '+27 11 517 4000',
          distance: '8.7'
        },
        'Woolworths': {
          address: '789 Adderley Street, Cape Town, Western Cape, 8000',
          contact: '+27 21 407 9111',
          distance: '12.5'
        },
        'Checkers': {
          address: '321 Oxford Road, Rosebank, Johannesburg, 2196',
          contact: '+27 11 280 8000',
          distance: '18.9'
        }
      };

      const businessKey = Object.keys(mockBusinessData).find(key => 
        key.toLowerCase().includes(businessName.toLowerCase())
      );

      if (businessKey) {
        const businessInfo = mockBusinessData[businessKey];
        setFormData(prev => ({
          ...prev,
          clientAddress: businessInfo.address,
          clientContact: businessInfo.contact,
          distanceTravelled: businessInfo.distance
        }));
        
        toast({
          title: "Business Found!",
          description: `Auto-populated details for ${businessKey}`
        });
      } else {
        // Simulate generic business data for unknown businesses
        setFormData(prev => ({
          ...prev,
          clientAddress: `${Math.floor(Math.random() * 999) + 1} ${['Main', 'Church', 'Market', 'High'][Math.floor(Math.random() * 4)]} Street, ${['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'][Math.floor(Math.random() * 4)]}, South Africa`,
          clientContact: `+27 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
          distanceTravelled: `${(Math.random() * 50 + 5).toFixed(1)}`
        }));
        
        toast({
          title: "Business Located",
          description: "Auto-populated estimated details"
        });
      }
      
      setIsSearching(false);
    }, 2000);
  };

  const handleBusinessNameChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, clientBusinessName: value }));
    
    if (value.length > 2) {
      searchBusinessInfo(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isFormComplete) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Create new entry
    const newEntry = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // Save to localStorage
    const existingEntries = JSON.parse(localStorage.getItem('fieldEntries') || '[]');
    existingEntries.push(newEntry);
    localStorage.setItem('fieldEntries', JSON.stringify(existingEntries));

    toast({
      title: "Entry Created",
      description: "Client information saved successfully!"
    });

    // Navigate to job details screen
    navigate(`/job-details/${newEntry.id}`);
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
          <h1 className="text-2xl font-bold text-white">New Entry</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Client Information</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientBusinessName">Client Business Name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-white/60" />
                  <Input
                    id="clientBusinessName"
                    name="clientBusinessName"
                    type="text"
                    placeholder="Enter business name to auto-search"
                    value={formData.clientBusinessName}
                    onChange={handleBusinessNameChange}
                    className="pl-10"
                    required
                  />
                  {isSearching && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute right-3 top-3.5 w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Client Physical Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-white/60" />
                  <Input
                    id="clientAddress"
                    name="clientAddress"
                    type="text"
                    placeholder="Physical address will auto-populate"
                    value={formData.clientAddress}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientContact">Client Contact Details</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-white/60" />
                  <Input
                    id="clientContact"
                    name="clientContact"
                    type="text"
                    placeholder="Contact details will auto-populate"
                    value={formData.clientContact}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distanceTravelled">Distance Travelled (km)</Label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-3.5 h-4 w-4 text-white/60" />
                  <Input
                    id="distanceTravelled"
                    name="distanceTravelled"
                    type="text"
                    placeholder="Distance will auto-populate"
                    value={formData.distanceTravelled}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {isFormComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg"
                  >
                    Continue to Job Details
                  </Button>
                </motion.div>
              )}
            </form>
          </CardContent>
        </Card>

        {!isFormComplete && (
          <Card className="border-amber-400/30 bg-amber-400/10">
            <CardContent className="pt-6">
              <p className="text-amber-400 text-sm text-center">
                Fill in the business name to auto-populate all fields
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default NewEntryScreen;