import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import StatCard from "@/components/molecules/StatCard";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const Reports = () => {
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");

      const [students, grades, attendance] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);

      // Calculate overview statistics
      const totalStudents = students.length;
      const activeStudents = students.filter(s => s.status === "active").length;
      const totalAssignments = grades.length;
      
      // Grade distribution
      const gradePercentages = grades.map(g => (g.score / g.maxScore) * 100);
      const averageGrade = gradePercentages.length > 0 
        ? Math.round(gradePercentages.reduce((sum, grade) => sum + grade, 0) / gradePercentages.length)
        : 0;

      const gradeDistribution = {
        'A (90-100)': gradePercentages.filter(g => g >= 90).length,
        'B (80-89)': gradePercentages.filter(g => g >= 80 && g < 90).length,
        'C (70-79)': gradePercentages.filter(g => g >= 70 && g < 80).length,
        'D (60-69)': gradePercentages.filter(g => g >= 60 && g < 70).length,
        'F (0-59)': gradePercentages.filter(g => g < 60).length
      };

      // Attendance statistics
      const presentRecords = attendance.filter(a => a.status === "present").length;
      const totalRecords = attendance.length;
      const attendanceRate = totalRecords > 0 
        ? Math.round((presentRecords / totalRecords) * 100)
        : 100;

      setReportData({
        overview: {
          totalStudents,
          activeStudents,
          totalAssignments,
          averageGrade,
          attendanceRate
        },
        gradeDistribution,
        attendance: {
          present: presentRecords,
          absent: attendance.filter(a => a.status === "absent").length,
          late: attendance.filter(a => a.status === "late").length,
          rate: attendanceRate
        }
      });

    } catch (err) {
      setError("Failed to load report data. Please try again.");
      console.error("Error loading report data:", err);
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { value: "overview", label: "Overview" },
    { value: "grades", label: "Grade Report" },
    { value: "attendance", label: "Attendance Report" },
    { value: "students", label: "Student Report" }
  ];

  const periodOptions = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" }
  ];

  const handleExportReport = () => {
    // Mock export functionality
    const reportName = reportTypes.find(r => r.value === selectedReport)?.label || "Report";
    alert(`Exporting ${reportName} for ${periodOptions.find(p => p.value === selectedPeriod)?.label}...`);
  };

  if (loading) {
    return <Loading message="Generating reports..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReportData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analytics and insights for your school</p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            options={reportTypes}
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="w-48"
          />
          <Select
            options={periodOptions}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-40"
          />
          <Button onClick={handleExportReport}>
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      {selectedReport === "overview" && reportData.overview && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value={reportData.overview.totalStudents}
              icon="Users"
              change="+5% from last month"
              changeType="positive"
            />
            <StatCard
              title="Active Students"
              value={reportData.overview.activeStudents}
              icon="UserCheck"
              change="+2% from last month"
              changeType="positive"
            />
            <StatCard
              title="Total Assignments"
              value={reportData.overview.totalAssignments}
              icon="FileText"
              change="+8 this week"
              changeType="positive"
            />
            <StatCard
              title="Average Grade"
              value={`${reportData.overview.averageGrade}%`}
              icon="BookOpen"
              change="+3% from last month"
              changeType="positive"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Grade Distribution */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Grade Distribution</h2>
                <ApperIcon name="BarChart3" className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {Object.entries(reportData.gradeDistribution).map(([grade, count]) => {
                  const total = Object.values(reportData.gradeDistribution).reduce((sum, c) => sum + c, 0);
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                  
                  return (
                    <div key={grade} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${
                          grade.startsWith('A') ? 'bg-success' :
                          grade.startsWith('B') ? 'bg-info' :
                          grade.startsWith('C') ? 'bg-warning' :
                          grade.startsWith('D') ? 'bg-accent' : 'bg-error'
                        }`} />
                        <span className="text-sm font-medium text-gray-900">{grade}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              grade.startsWith('A') ? 'bg-success' :
                              grade.startsWith('B') ? 'bg-info' :
                              grade.startsWith('C') ? 'bg-warning' :
                              grade.startsWith('D') ? 'bg-accent' : 'bg-error'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 min-w-[3rem]">{count} ({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Attendance Overview */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Attendance Overview</h2>
                <ApperIcon name="Calendar" className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  {reportData.attendance.rate}%
                </div>
                <div className="text-gray-600">Overall Attendance Rate</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-success rounded"></div>
                    <span className="text-sm text-gray-600">Present</span>
                  </div>
                  <span className="font-medium">{reportData.attendance.present}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-error rounded"></div>
                    <span className="text-sm text-gray-600">Absent</span>
                  </div>
                  <span className="font-medium">{reportData.attendance.absent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-warning rounded"></div>
                    <span className="text-sm text-gray-600">Late</span>
                  </div>
                  <span className="font-medium">{reportData.attendance.late}</span>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Other Report Types */}
      {selectedReport !== "overview" && (
        <Card className="p-8 text-center">
          <ApperIcon name="FileText" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {reportTypes.find(r => r.value === selectedReport)?.label} Report
          </h3>
          <p className="text-gray-600 mb-6">
            Detailed {reportTypes.find(r => r.value === selectedReport)?.label.toLowerCase()} report for {periodOptions.find(p => p.value === selectedPeriod)?.label.toLowerCase()}.
          </p>
          <Button>
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Reports;