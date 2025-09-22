import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StudentCard from "@/components/molecules/StudentCard";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/molecules/FilterBar";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { studentService } from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    grade: 9,
    status: "active"
  });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      
      const studentsData = await studentService.getAll();
      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load students. Please try again.");
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];
    
    if (searchTerm) {
filtered = filtered.filter(student =>
        student.first_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredStudents(filtered);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    try {
      const createdStudent = await studentService.create(newStudent);
      setStudents(prev => [...prev, createdStudent]);
      setNewStudent({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        grade: 9,
        status: "active"
      });
      setShowAddModal(false);
      toast.success("Student added successfully!");
    } catch (err) {
      toast.error("Failed to add student");
      console.error("Error adding student:", err);
    }
  };

const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({
      firstName: student.first_name_c,
      lastName: student.last_name_c,
      email: student.email_c,
      phone: student.phone_c,
      grade: student.grade_c,
      status: student.status_c
    });
    setShowAddModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    
    try {
      const updatedStudent = await studentService.update(editingStudent.Id, newStudent);
      setStudents(prev => prev.map(s => s.Id === editingStudent.Id ? updatedStudent : s));
      setNewStudent({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        grade: 9,
        status: "active"
      });
      setEditingStudent(null);
      setShowAddModal(false);
      toast.success("Student updated successfully!");
    } catch (err) {
      toast.error("Failed to update student");
      console.error("Error updating student:", err);
    }
  };

const handleViewDetails = (student) => {
    toast.info(`Viewing details for ${student.first_name_c} ${student.last_name_c}`);
  };

const handleDeleteStudent = async (student) => {
    if (!confirm(`Are you sure you want to delete ${student.first_name_c} ${student.last_name_c}?`)) {
      return;
    }
    
    try {
      await studentService.delete(student.Id);
      setStudents(prev => prev.filter(s => s.Id !== student.Id));
      toast.success("Student deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete student");
      console.error("Error deleting student:", err);
    }
  };

  const gradeOptions = [
    { value: 9, label: "Grade 9" },
    { value: 10, label: "Grade 10" },
    { value: 11, label: "Grade 11" },
    { value: 12, label: "Grade 12" }
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" }
  ];

  if (loading) {
    return <Loading message="Loading students..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStudents} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage student enrollment and information</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search students by name or email..."
            onSearch={setSearchTerm}
          />
        </div>
        <div className="flex gap-2">
          <Select
            options={[
              { value: "", label: "All Grades" },
              ...gradeOptions
            ]}
            className="w-48"
          />
          <Select
            options={[
              { value: "", label: "All Status" },
              ...statusOptions
            ]}
            className="w-48"
          />
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <Empty
          title="No students found"
          message={searchTerm ? "Try adjusting your search criteria" : "Start by adding your first student"}
          icon="Users"
          actionText="Add Student"
          action={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.Id}
              student={student}
              onViewDetails={handleViewDetails}
              onEdit={handleEditStudent}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingStudent ? "Edit Student" : "Add Student"}
              </h2>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStudent(null);
                  setNewStudent({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    grade: 9,
                    status: "active"
                  });
                }}
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
value={newStudent.firstName}
                  onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                  required
                />
                <Input
                  label="Last Name"
                  value={newStudent.lastName}
                  onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                  required
                />
              </div>
              
              <Input
                label="Email"
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                required
              />
              
              <Input
                label="Phone"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Grade"
                  options={gradeOptions}
value={newStudent.grade}
                  onChange={(e) => setNewStudent({...newStudent, grade: parseInt(e.target.value)})}
                />
                <Select
                  label="Status"
                  options={statusOptions}
                  value={newStudent.status}
                  onChange={(e) => setNewStudent({...newStudent, status: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStudent(null);
                    setNewStudent({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      grade: 9,
                      status: "active"
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStudent ? "Update Student" : "Add Student"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Students;