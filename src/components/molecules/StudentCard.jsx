import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const StudentCard = ({ student, onViewDetails, onEdit }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "active": return "success";
      case "inactive": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  };

  return (
    <Card className="hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-secondary">Grade {student.grade}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(student.status)}>
          {student.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Mail" className="h-4 w-4" />
          {student.email}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Phone" className="h-4 w-4" />
          {student.phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" className="h-4 w-4" />
          Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="small"
          onClick={() => onViewDetails(student)}
          className="flex-1"
        >
          <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button
          variant="ghost"
          size="small"
          onClick={() => onEdit(student)}
        >
          <ApperIcon name="Edit" className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default StudentCard;