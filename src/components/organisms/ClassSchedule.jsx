import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { classService } from "@/services/api/classService";

const ClassSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedView, setSelectedView] = useState("week");

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00"
  ];

  const weekDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
  ];

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");
      
      const classesData = await classService.getAll();
      setClasses(classesData);
    } catch (err) {
      setError("Failed to load class schedule. Please try again.");
      console.error("Error loading classes:", err);
    } finally {
      setLoading(false);
    }
  };

  const getClassForSlot = (day, time) => {
    return classes.find(cls => 
      cls.schedule && 
      cls.schedule[day] && 
      cls.schedule[day].includes(time)
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg p-6">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 48 }, (_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertTriangle" className="h-12 w-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Schedule</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadClasses}>
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Calendar" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classes Scheduled</h3>
        <p className="text-gray-600 mb-4">
          Start by creating classes and assigning them to time slots.
        </p>
        <Button>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Class Schedule</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <Button
              variant={selectedView === "week" ? "primary" : "ghost"}
              size="small"
              onClick={() => setSelectedView("week")}
            >
              Week View
            </Button>
            <Button
              variant={selectedView === "month" ? "primary" : "ghost"}
              size="small"
              onClick={() => setSelectedView("month")}
            >
              Month View
            </Button>
          </div>
          <Button>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-6 gap-px bg-gray-200">
              <div className="bg-gray-50 p-4 text-center font-medium text-gray-700">
                Time
              </div>
              {weekDays.map((day) => (
                <div key={day} className="bg-gray-50 p-4 text-center font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="bg-gray-200">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-6 gap-px">
                  <div className="bg-white p-4 text-center font-medium text-gray-600 border-b border-gray-100">
                    {time}
                  </div>
                  {weekDays.map((day) => {
                    const classForSlot = getClassForSlot(day, time);
                    return (
                      <div key={`${day}-${time}`} className="bg-white p-2 min-h-[80px] border-b border-gray-100">
                        {classForSlot ? (
                          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-3 h-full">
                            <div className="text-sm font-semibold text-primary mb-1">
                              {classForSlot.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              Room {classForSlot.room}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-300 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                            <ApperIcon name="Plus" className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded"></div>
          <span className="text-gray-600">Scheduled Class</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
          <span className="text-gray-600">Available Slot</span>
        </div>
      </div>
    </div>
  );
};

export default ClassSchedule;