import announcementsData from "@/services/mockData/announcements.json";

class AnnouncementService {
  constructor() {
    this.announcements = [...announcementsData];
  }

  async getAll() {
    await this.delay();
    return [...this.announcements];
  }

  async getById(id) {
    await this.delay();
    const announcement = this.announcements.find(a => a.Id === parseInt(id));
    if (!announcement) {
      throw new Error("Announcement not found");
    }
    return { ...announcement };
  }

  async create(announcementData) {
    await this.delay();
    const newId = Math.max(...this.announcements.map(a => a.Id), 0) + 1;
    const newAnnouncement = {
      Id: newId,
      ...announcementData,
      dateCreated: announcementData.dateCreated || new Date().toISOString().split('T')[0]
    };
    this.announcements.push(newAnnouncement);
    return { ...newAnnouncement };
  }

  async update(id, announcementData) {
    await this.delay();
    const index = this.announcements.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Announcement not found");
    }
    this.announcements[index] = { ...this.announcements[index], ...announcementData };
    return { ...this.announcements[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.announcements.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Announcement not found");
    }
    this.announcements.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const announcementService = new AnnouncementService();