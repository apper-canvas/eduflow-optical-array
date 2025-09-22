import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ filters = [], onFilterChange, onClearFilters }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {filters.map((filter, index) => (
        <div key={index} className="min-w-[200px]">
          <Select
            label={filter.label}
            options={filter.options}
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
          />
        </div>
      ))}
      {onClearFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="mt-6"
        >
          <ApperIcon name="X" className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterBar;