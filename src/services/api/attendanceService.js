import attendanceData from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async getAll() {
    await this.delay();
    return [...this.attendance];
  }

  async getById(id) {
    await this.delay();
    const record = this.attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  }

  async getByStudentId(studentId) {
    await this.delay();
    return this.attendance.filter(a => a.studentId === parseInt(studentId));
  }

  async getByDate(date) {
    await this.delay();
    return this.attendance.filter(a => a.date === date);
  }

  async create(attendanceData) {
    await this.delay();
    const newId = Math.max(...this.attendance.map(a => a.Id), 0) + 1;
    const newRecord = {
      Id: newId,
      ...attendanceData,
      date: attendanceData.date || new Date().toISOString().split('T')[0]
    };
    this.attendance.push(newRecord);
    return { ...newRecord };
  }

  async update(id, attendanceData) {
    await this.delay();
    const index = this.attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    this.attendance[index] = { ...this.attendance[index], ...attendanceData };
    return { ...this.attendance[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    this.attendance.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const attendanceService = new AttendanceService();