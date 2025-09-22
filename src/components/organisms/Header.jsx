import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ title, onMenuClick, showMenu = true }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showMenu && (
            <Button
              variant="ghost"
              size="medium"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <ApperIcon name="Bell" className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-error rounded-full text-xs"></span>
            </Button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setShowNotifications(false)}
                  >
                    <ApperIcon name="X" className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-info/10 rounded-lg">
                    <p className="text-sm font-medium text-info">New Assignment Submitted</p>
                    <p className="text-xs text-gray-600 mt-1">Math homework from Grade 10A</p>
                  </div>
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <p className="text-sm font-medium text-warning">Low Attendance Alert</p>
                    <p className="text-xs text-gray-600 mt-1">3 students below 80% attendance</p>
                  </div>
                  <div className="text-center pt-2">
                    <Button variant="outline" size="small">
                      View All Notifications
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-secondary">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;