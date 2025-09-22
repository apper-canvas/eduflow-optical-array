import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StudentCard = ({ student, onViewDetails, onEdit }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <Card className="hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {student.first_name_c?.charAt(0) || 'S'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {student.first_name_c} {student.last_name_c}
            </h3>
            <p className="text-sm text-gray-600">Grade {student.grade_c}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(student.status_c)}>
          {student.status_c}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Mail" className="h-4 w-4" />
          <span className="truncate">{student.email_c}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Phone" className="h-4 w-4" />
          <span>{student.phone_c}</span>
        </div>
        {student.enrollment_date_c && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Calendar" className="h-4 w-4" />
            <span>Enrolled: {new Date(student.enrollment_date_c).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="small"
          onClick={() => onViewDetails(student)}
          className="flex-1"
        >
          <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          variant="outline"
          size="small"
          onClick={() => onEdit(student)}
          className="flex-1"
        >
          <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
    </Card>
  );
};

export default StudentCard;