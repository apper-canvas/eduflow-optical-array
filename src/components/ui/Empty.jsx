import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available", 
  message = "Get started by adding some data", 
  action,
  actionText = "Get Started",
  icon = "Database"
}) => {
  return (
    <div className="text-center py-12">
      <ApperIcon name={icon} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {action && (
        <Button onClick={action}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default Empty;