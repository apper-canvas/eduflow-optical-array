import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  
  const [newClass, setNewClass] = useState({
    name: "",
    teacherId: 1,
    room: "",
    studentIds: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      
      setClasses(classesData);
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load class data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    
    try {
      const createdClass = await classService.create(newClass);
      setClasses(prev => [...prev, createdClass]);
      setNewClass({
        name: "",
        teacherId: 1,
        room: "",
        studentIds: []
      });
      setShowAddModal(false);
      toast.success("Class created successfully!");
    } catch (err) {
      toast.error("Failed to create class");
      console.error("Error creating class:", err);
    }
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setNewClass(classItem);
    setShowAddModal(true);
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    
    try {
      const updatedClass = await classService.update(editingClass.Id, newClass);
      setClasses(prev => prev.map(c => c.Id === editingClass.Id ? updatedClass : c));
      setNewClass({
        name: "",
        teacherId: 1,
        room: "",
        studentIds: []
      });
      setEditingClass(null);
      setShowAddModal(false);
      toast.success("Class updated successfully!");
    } catch (err) {
      toast.error("Failed to update class");
      console.error("Error updating class:", err);
    }
  };

  const handleDeleteClass = async (classItem) => {
    if (!confirm(`Are you sure you want to delete ${classItem.name}?`)) {
      return;
    }
    
    try {
      await classService.delete(classItem.Id);
      setClasses(prev => prev.filter(c => c.Id !== classItem.Id));
      toast.success("Class deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete class");
      console.error("Error deleting class:", err);
    }
  };

const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.first_name_c} ${student.last_name_c}` : "Unknown";
  };
  const getScheduleDisplay = (schedule) => {
    if (!schedule) return "No schedule set";
    
    const days = Object.keys(schedule);
    if (days.length === 0) return "No schedule set";
    
    return days.map(day => 
      `${day}: ${schedule[day].join(", ")}`
    ).join(" | ");
  };

  if (loading) {
    return <Loading message="Loading classes..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600">Manage class schedules and student assignments</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </div>

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <Empty
          title="No classes found"
          message="Start by creating your first class"
          icon="School"
          actionText="Create Class"
          action={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.Id} className="hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {classItem.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <ApperIcon name="MapPin" className="h-4 w-4" />
                    Room {classItem.room}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Users" className="h-4 w-4" />
                    {classItem.studentIds.length} students
                  </div>
                </div>
                <Badge variant="primary">
                  Active
                </Badge>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Schedule</h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {getScheduleDisplay(classItem.schedule)}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Enrolled Students</h4>
                <div className="flex flex-wrap gap-1">
                  {classItem.studentIds.slice(0, 3).map((studentId) => (
                    <Badge key={studentId} variant="default" size="small">
                      {getStudentName(studentId)}
                    </Badge>
                  ))}
                  {classItem.studentIds.length > 3 && (
                    <Badge variant="default" size="small">
                      +{classItem.studentIds.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleEditClass(classItem)}
                  className="flex-1"
                >
                  <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => handleDeleteClass(classItem)}
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingClass ? "Edit Class" : "Create Class"}
              </h2>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingClass(null);
                  setNewClass({
                    name: "",
                    teacherId: 1,
                    room: "",
                    studentIds: []
                  });
                }}
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={editingClass ? handleUpdateClass : handleAddClass} className="space-y-4">
              <Input
                label="Class Name"
                value={newClass.name}
                onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                placeholder="e.g. Mathematics 101"
                required
              />
              
              <Input
                label="Room Number"
                value={newClass.room}
                onChange={(e) => setNewClass({...newClass, room: e.target.value})}
                placeholder="e.g. A201"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrolled Students
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {students.map((student) => (
                    <label key={student.Id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newClass.studentIds.includes(student.Id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewClass({
                              ...newClass,
                              studentIds: [...newClass.studentIds, student.Id]
                            });
                          } else {
                            setNewClass({
                              ...newClass,
                              studentIds: newClass.studentIds.filter(id => id !== student.Id)
                            });
                          }
                        }}
                        className="rounded"
/>
                      {student.first_name_c} {student.last_name_c}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingClass(null);
                    setNewClass({
                      name: "",
                      teacherId: 1,
                      room: "",
                      studentIds: []
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingClass ? "Update Class" : "Create Class"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Classes;