import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DataTable from "@/components/molecules/DataTable";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { gradeService } from "@/services/api/gradeService";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";

const GradeBook = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingGrade, setEditingGrade] = useState(null);
  const [newScore, setNewScore] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [gradesData, studentsData, assignmentsData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        assignmentService.getAll()
      ]);
      
      setGrades(gradesData);
      setStudents(studentsData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load grade data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setNewScore(grade.score.toString());
  };

  const handleSaveGrade = async () => {
    if (!editingGrade || !newScore) return;

    try {
      const updatedGrade = {
        ...editingGrade,
        score: parseFloat(newScore)
      };

      await gradeService.update(editingGrade.Id, updatedGrade);
      
      setGrades(prev => prev.map(g => 
        g.Id === editingGrade.Id ? updatedGrade : g
      ));
      
      setEditingGrade(null);
      setNewScore("");
      toast.success("Grade updated successfully!");
    } catch (err) {
      toast.error("Failed to update grade");
      console.error("Error updating grade:", err);
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown";
  };

  const getAssignmentName = (assignmentId) => {
    const assignment = assignments.find(a => a.Id === assignmentId);
    return assignment ? assignment.title : "Unknown";
  };

  const calculatePercentage = (score, maxScore) => {
    return Math.round((score / maxScore) * 100);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 80) return "text-info";
    if (percentage >= 70) return "text-warning";
    return "text-error";
  };

  const columns = [
    {
      key: "studentId",
      label: "Student",
      render: (studentId) => getStudentName(studentId)
    },
    {
      key: "assignmentId",
      label: "Assignment",
      render: (assignmentId) => getAssignmentName(assignmentId)
    },
    {
      key: "score",
      label: "Score",
      render: (score, grade) => (
        <div className="flex items-center gap-2">
          {editingGrade?.Id === grade.Id ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                className="w-20"
                min="0"
                max={grade.maxScore}
              />
              <Button size="small" onClick={handleSaveGrade}>
                <ApperIcon name="Check" className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="small" 
                onClick={() => setEditingGrade(null)}
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <span 
              className="cursor-pointer hover:text-primary" 
              onClick={() => handleEditGrade(grade)}
            >
              {score}/{grade.maxScore}
            </span>
          )}
        </div>
      )
    },
    {
      key: "percentage",
      label: "Percentage",
      render: (_, grade) => {
        const percentage = calculatePercentage(grade.score, grade.maxScore);
        return (
          <span className={`font-semibold ${getGradeColor(percentage)}`}>
            {percentage}%
          </span>
        );
      }
    },
    {
      key: "dateRecorded",
      label: "Date Recorded",
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Grades</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadData}>
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (grades.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="BookOpen" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Grades Yet</h3>
        <p className="text-gray-600 mb-4">
          Start by creating assignments and recording student grades.
        </p>
        <Button>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Grade
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Grade Book</h2>
        <div className="flex items-center gap-4">
          <Select
            options={[
              { value: "", label: "All Classes" },
              { value: "math", label: "Mathematics" },
              { value: "science", label: "Science" },
              { value: "english", label: "English" }
            ]}
            className="w-48"
          />
          <Button>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Grade
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={grades}
        onEdit={handleEditGrade}
        actions={false}
      />
    </div>
  );
};

export default GradeBook;