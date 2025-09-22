import { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { gradeService } from "@/services/api/gradeService";
import { announcementService } from "@/services/api/announcementService";
import { attendanceService } from "@/services/api/attendanceService";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [students, grades, announcements, attendance] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        announcementService.getAll(),
        attendanceService.getAll()
      ]);

      // Calculate stats
      const activeStudents = students.filter(s => s.status === "active").length;
      const totalAssignments = grades.length;
      const averageGrade = grades.length > 0 
        ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / grades.length)
        : 0;
      
      const todayAttendance = attendance.filter(a => 
        a.date === new Date().toISOString().split('T')[0]
      );
      const presentToday = todayAttendance.filter(a => a.status === "present").length;
      const attendanceRate = todayAttendance.length > 0 
        ? Math.round((presentToday / todayAttendance.length) * 100)
        : 100;

      setStats({
        totalStudents: activeStudents,
        totalAssignments,
        averageGrade,
        attendanceRate
      });

      // Recent activities
      const activities = [
        { id: 1, type: "grade", message: "New grades posted for Algebra II", time: "2 hours ago", icon: "BookOpen" },
        { id: 2, type: "assignment", message: "Chemistry lab report due tomorrow", time: "4 hours ago", icon: "FileText" },
        { id: 3, type: "attendance", message: "3 students marked absent today", time: "6 hours ago", icon: "Users" },
        { id: 4, type: "announcement", message: "Parent-teacher conferences scheduled", time: "1 day ago", icon: "Megaphone" }
      ];

      setRecentActivities(activities);
      setRecentAnnouncements(announcements.slice(0, 3));

    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to EduFlow</h1>
            <p className="text-blue-100 text-lg">
              Managing your school has never been easier. Here's your overview for today.
            </p>
          </div>
          <div className="hidden lg:block">
            <ApperIcon name="GraduationCap" className="h-20 w-20 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Students"
          value={stats.totalStudents}
          icon="Users"
          change="+12 this month"
          changeType="positive"
        />
        <StatCard
          title="Total Assignments"
          value={stats.totalAssignments}
          icon="FileText"
          change="+3 this week"
          changeType="positive"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon="BookOpen"
          change="+2% from last month"
          changeType="positive"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="Calendar"
          change="-1% from yesterday"
          changeType="negative"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            <ApperIcon name="Activity" className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="rounded-lg bg-primary/10 p-2">
                  <ApperIcon name={activity.icon} className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Announcements</h2>
            <ApperIcon name="Megaphone" className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.Id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {announcement.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    announcement.priority === "high" 
                      ? "bg-error/10 text-error"
                      : announcement.priority === "medium"
                      ? "bg-warning/10 text-warning"
                      : "bg-info/10 text-info"
                  }`}>
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {announcement.content}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(announcement.dateCreated).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-left">
            <ApperIcon name="UserPlus" className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-gray-900">Add Student</div>
              <div className="text-sm text-gray-600">Enroll new student</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-success/5 border border-success/20 rounded-lg hover:bg-success/10 transition-colors duration-200 text-left">
            <ApperIcon name="BookOpen" className="h-5 w-5 text-success" />
            <div>
              <div className="font-medium text-gray-900">Create Assignment</div>
              <div className="text-sm text-gray-600">New homework or test</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-warning/5 border border-warning/20 rounded-lg hover:bg-warning/10 transition-colors duration-200 text-left">
            <ApperIcon name="Megaphone" className="h-5 w-5 text-warning" />
            <div>
              <div className="font-medium text-gray-900">Send Announcement</div>
              <div className="text-sm text-gray-600">Notify parents & students</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-info/5 border border-info/20 rounded-lg hover:bg-info/10 transition-colors duration-200 text-left">
            <ApperIcon name="BarChart3" className="h-5 w-5 text-info" />
            <div>
              <div className="font-medium text-gray-900">View Reports</div>
              <div className="text-sm text-gray-600">Analytics & insights</div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;