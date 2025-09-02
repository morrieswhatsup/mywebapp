import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, FileText, Play, Square, PenTool, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const JobDetailsScreen = () => {
  const { entryId } = useParams();
  const [entry, setEntry] = useState(null);
  const [jobData, setJobData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    scopeOfWork: '',
    startJobTime: '',
    endJobTime: '',
    kilometers: '',
    actualWorkCompleted: '',
    orderNumber: '',
    srNumber: ''
  });
  const [isJobStarted, setIsJobStarted] = useState(false);
  const [signature, setSignature] = useState('');
  const [isSignatureCaptured, setIsSignatureCaptured] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem('fieldEntries') || '[]');
    const foundEntry = entries.find(e => e.id === entryId);
    if (foundEntry) {
      setEntry(foundEntry);
      setJobData(prev => ({
        ...prev,
        kilometers: foundEntry.distanceTravelled
      }));
    } else {
      navigate('/main');
    }
  }, [entryId, navigate]);

  useEffect(() => {
    if (jobData.date && jobData.time && entry) {
      setJobData(prev => ({
        ...prev,
        kilometers: entry.distanceTravelled
      }));
    }
  }, [jobData.date, jobData.time, entry]);

  const handleInputChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleStartJob = () => {
    const currentTime = new Date().toTimeString().split(' ')[0].slice(0, 5);
    setJobData(prev => ({
      ...prev,
      startJobTime: currentTime
    }));
    setIsJobStarted(true);
    toast({
      title: "Job Started",
      description: `Job started at ${currentTime}`
    });
  };

  const handleEndJob = () => {
    const currentTime = new Date().toTimeString().split(' ')[0].slice(0, 5);
    setJobData(prev => ({
      ...prev,
      endJobTime: currentTime
    }));
    toast({
      title: "Job Completed",
      description: `Job ended at ${currentTime}`
    });
  };

  // Signature canvas functions
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffffff';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setIsSignatureCaptured(true);
      const canvas = canvasRef.current;
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
    setIsSignatureCaptured(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isSignatureCaptured) {
      toast({
        title: "Signature Required",
        description: "Please capture customer signature before submitting.",
        variant: "destructive"
      });
      return;
    }

    const requiredFields = ['scopeOfWork', 'actualWorkCompleted', 'orderNumber', 'srNumber'];
    const missingFields = requiredFields.filter(field => !jobData[field].trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Update entry with job details
    const entries = JSON.parse(localStorage.getItem('fieldEntries') || '[]');
    const updatedEntries = entries.map(e => {
      if (e.id === entryId) {
        return {
          ...e,
          ...jobData,
          signature,
          status: 'completed',
          completedAt: new Date().toISOString()
        };
      }
      return e;
    });

    localStorage.setItem('fieldEntries', JSON.stringify(updatedEntries));

    toast({
      title: "Job Completed!",
      description: "Job details saved successfully."
    });

    navigate('/main');
  };

  if (!entry) return null;

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
          <h1 className="text-2xl font-bold text-white">Job Details</h1>
        </div>

        {/* Client Info Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{entry.clientBusinessName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{entry.clientAddress}</span>
              </p>
              <p className="text-white/70">Distance: {entry.distanceTravelled} km</p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Date & Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={jobData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={jobData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kilometers">Kilometers</Label>
                <Input
                  id="kilometers"
                  name="kilometers"
                  type="text"
                  value={jobData.kilometers}
                  onChange={handleInputChange}
                  placeholder="Auto-populated from distance"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Timing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Job Timing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startJobTime">Start Time</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="startJobTime"
                      name="startJobTime"
                      type="time"
                      value={jobData.startJobTime}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      onClick={handleStartJob}
                      className="bg-green-500 hover:bg-green-600"
                      disabled={isJobStarted}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endJobTime">End Time</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="endJobTime"
                      name="endJobTime"
                      type="time"
                      value={jobData.endJobTime}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      onClick={handleEndJob}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={!isJobStarted}
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Work Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scopeOfWork">Scope of Work</Label>
                <Input
                  id="scopeOfWork"
                  name="scopeOfWork"
                  type="text"
                  placeholder="Describe the work to be done"
                  value={jobData.scopeOfWork}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualWorkCompleted">Actual Work Completed</Label>
                <Input
                  id="actualWorkCompleted"
                  name="actualWorkCompleted"
                  type="text"
                  placeholder="Describe the work completed"
                  value={jobData.actualWorkCompleted}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number/PO</Label>
                  <Input
                    id="orderNumber"
                    name="orderNumber"
                    type="text"
                    placeholder="Enter order number"
                    value={jobData.orderNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="srNumber">SR Number</Label>
                  <Input
                    id="srNumber"
                    name="srNumber"
                    type="text"
                    placeholder="Service request number"
                    value={jobData.srNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Signature */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PenTool className="w-5 h-5" />
                <span>Customer Signature</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Customer Sign-off</Label>
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={150}
                  className="signature-canvas w-full border-2 border-dashed border-blue-400 rounded-lg cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={clearSignature}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Clear
                  </Button>
                  {isSignatureCaptured && (
                    <span className="text-green-400 text-sm flex items-center">
                      ✓ Signature captured
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          {isSignatureCaptured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Complete Job Entry
              </Button>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default JobDetailsScreen;