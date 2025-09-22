import ClassSchedule from "@/components/organisms/ClassSchedule";

const Schedule = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-600">View and manage class schedules</p>
      </div>
      
      <ClassSchedule />
    </div>
  );
};

export default Schedule;