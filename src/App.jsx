import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/pages/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Students from "@/components/pages/Students";
import Grades from "@/components/pages/Grades";
import Classes from "@/components/pages/Classes";
import Schedule from "@/components/pages/Schedule";
import Announcements from "@/components/pages/Announcements";
import Reports from "@/components/pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="grades" element={<Grades />} />
          <Route path="classes" element={<Classes />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;