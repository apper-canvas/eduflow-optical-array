import gradesData from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    await this.delay();
    return [...this.grades];
  }

  async getById(id) {
    await this.delay();
    const grade = this.grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  }

  async getByStudentId(studentId) {
    await this.delay();
    return this.grades.filter(g => g.studentId === parseInt(studentId));
  }

  async create(gradeData) {
    await this.delay();
    const newId = Math.max(...this.grades.map(g => g.Id), 0) + 1;
    const newGrade = {
      Id: newId,
      ...gradeData,
      dateRecorded: gradeData.dateRecorded || new Date().toISOString().split('T')[0]
    };
    this.grades.push(newGrade);
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await this.delay();
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    this.grades[index] = { ...this.grades[index], ...gradeData };
    return { ...this.grades[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    this.grades.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const gradeService = new GradeService();