import studentsData from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.students = [...studentsData];
  }

  async getAll() {
    await this.delay();
    return [...this.students];
  }

  async getById(id) {
    await this.delay();
    const student = this.students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  }

  async create(studentData) {
    await this.delay();
    const newId = Math.max(...this.students.map(s => s.Id), 0) + 1;
    const newStudent = {
      Id: newId,
      ...studentData,
      enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0],
      status: studentData.status || "active"
    };
    this.students.push(newStudent);
    return { ...newStudent };
  }

  async update(id, studentData) {
    await this.delay();
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students[index] = { ...this.students[index], ...studentData };
    return { ...this.students[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const studentService = new StudentService();