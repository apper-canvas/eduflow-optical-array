import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, change, changeType = "neutral" }) => {
  const changeColor = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-secondary"
  };

  return (
    <Card className="hover:-translate-y-1 transition-transform duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${changeColor[changeType]}`}>
              <ApperIcon
                name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"}
                className="h-4 w-4 mr-1"
              />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-3">
          <ApperIcon name={icon} className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;