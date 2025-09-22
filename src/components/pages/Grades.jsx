import GradeBook from "@/components/organisms/GradeBook";

const Grades = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
        <p className="text-gray-600">Manage student grades and assignments</p>
      </div>
      
      <GradeBook />
    </div>
  );
};

export default Grades;