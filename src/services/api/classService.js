import classesData from "@/services/mockData/classes.json";

class ClassService {
  constructor() {
    this.classes = [...classesData];
  }

  async getAll() {
    await this.delay();
    return [...this.classes];
  }

  async getById(id) {
    await this.delay();
    const classItem = this.classes.find(c => c.Id === parseInt(id));
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  }

  async create(classData) {
    await this.delay();
    const newId = Math.max(...this.classes.map(c => c.Id), 0) + 1;
    const newClass = {
      Id: newId,
      ...classData,
      studentIds: classData.studentIds || []
    };
    this.classes.push(newClass);
    return { ...newClass };
  }

  async update(id, classData) {
    await this.delay();
    const index = this.classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    this.classes[index] = { ...this.classes[index], ...classData };
    return { ...this.classes[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    this.classes.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const classService = new ClassService();