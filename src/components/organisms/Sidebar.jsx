import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/" },
    { id: "students", label: "Students", icon: "Users", path: "/students" },
    { id: "grades", label: "Grades", icon: "BookOpen", path: "/grades" },
    { id: "classes", label: "Classes", icon: "School", path: "/classes" },
    { id: "schedule", label: "Schedule", icon: "Calendar", path: "/schedule" },
    { id: "announcements", label: "Announcements", icon: "Megaphone", path: "/announcements" },
    { id: "reports", label: "Reports", icon: "BarChart3", path: "/reports" }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">EduFlow</h2>
              <p className="text-xs text-secondary">School Management</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 custom-scrollbar overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary",
                    isActive 
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-r-4 border-primary font-medium" 
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  <ApperIcon name={item.icon} className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-br from-primary/10 to-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <ApperIcon name="HelpCircle" className="h-5 w-5 text-primary" />
                <span className="font-medium text-primary">Need Help?</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Check our documentation for detailed guides and tutorials.
              </p>
              <button className="text-sm text-primary hover:text-blue-700 font-medium">
                View Documentation →
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">EduFlow</h2>
                <p className="text-xs text-secondary">School Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 custom-scrollbar overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary",
                    isActive 
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-r-4 border-primary font-medium" 
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  <ApperIcon name={item.icon} className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;