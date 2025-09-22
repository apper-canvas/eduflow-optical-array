import { toast } from "react-toastify";

class AnnouncementService {
  constructor() {
    if (!window.ApperSDK) {
      throw new Error('ApperSDK not loaded. Make sure the SDK script is included.');
    }
    
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
this.tableName = 'announcement_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "target_audience_c"}},
          {"field": {"Name": "date_created_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "date_created_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch announcements: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to expected format
      const announcements = (response.data || []).map(announcement => ({
        ...announcement,
        title: announcement.title_c || announcement.Name,
        content: announcement.content_c,
        authorId: announcement.author_id_c,
        targetAudience: announcement.target_audience_c ? announcement.target_audience_c.split(',') : ["students"],
        dateCreated: announcement.date_created_c,
        priority: announcement.priority_c || "medium"
      }));
      
      return announcements;
    } catch (error) {
      console.error("Error fetching announcements:", error?.response?.data?.message || error);
      toast.error("Failed to load announcements");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "target_audience_c"}},
          {"field": {"Name": "date_created_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch announcement ${id}: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      const announcement = response.data;
      if (!announcement) return null;
      
      return {
        ...announcement,
        title: announcement.title_c || announcement.Name,
        content: announcement.content_c,
        authorId: announcement.author_id_c,
        targetAudience: announcement.target_audience_c ? announcement.target_audience_c.split(',') : ["students"],
        dateCreated: announcement.date_created_c,
        priority: announcement.priority_c || "medium"
      };
    } catch (error) {
      console.error(`Error fetching announcement ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load announcement");
      return null;
    }
  }

  async create(announcementData) {
    try {
      const params = {
        records: [{
          Name: announcementData.title,
          title_c: announcementData.title,
          content_c: announcementData.content,
          author_id_c: parseInt(announcementData.authorId || 1),
          target_audience_c: Array.isArray(announcementData.targetAudience) 
            ? announcementData.targetAudience.join(',') 
            : "students",
          date_created_c: announcementData.dateCreated || new Date().toISOString().split('T')[0],
          priority_c: announcementData.priority || "medium",
          Tags: announcementData.tags || ""
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create announcement: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} announcements: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Announcement created successfully!");
          const announcement = successful[0].data;
          return {
            ...announcement,
            title: announcement.title_c || announcement.Name,
            content: announcement.content_c,
            authorId: announcement.author_id_c,
            targetAudience: announcement.target_audience_c ? announcement.target_audience_c.split(',') : ["students"],
            dateCreated: announcement.date_created_c,
            priority: announcement.priority_c || "medium"
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating announcement:", error?.response?.data?.message || error);
      toast.error("Failed to create announcement");
      return null;
    }
  }

  async update(id, announcementData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: announcementData.title,
          title_c: announcementData.title,
          content_c: announcementData.content,
          author_id_c: parseInt(announcementData.authorId || 1),
          target_audience_c: Array.isArray(announcementData.targetAudience) 
            ? announcementData.targetAudience.join(',') 
            : "students",
          date_created_c: announcementData.dateCreated,
          priority_c: announcementData.priority || "medium",
          Tags: announcementData.tags || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update announcement: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} announcements: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Announcement updated successfully!");
          const announcement = successful[0].data;
          return {
            ...announcement,
            title: announcement.title_c || announcement.Name,
            content: announcement.content_c,
            authorId: announcement.author_id_c,
            targetAudience: announcement.target_audience_c ? announcement.target_audience_c.split(',') : ["students"],
            dateCreated: announcement.date_created_c,
            priority: announcement.priority_c || "medium"
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating announcement:", error?.response?.data?.message || error);
      toast.error("Failed to update announcement");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to delete announcement: ${response.message}`);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} announcements: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Announcement deleted successfully!");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting announcement:", error?.response?.data?.message || error);
      toast.error("Failed to delete announcement");
      return false;
    }
  }
}

export const announcementService = new AnnouncementService();