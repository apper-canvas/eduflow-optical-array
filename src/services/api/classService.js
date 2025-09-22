import { toast } from "react-toastify";

class ClassService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'class_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "room_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "student_ids_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch classes: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      // Parse JSON fields for client use
      const classes = (response.data || []).map(cls => ({
        ...cls,
        name: cls.name_c || cls.Name,
        teacherId: cls.teacher_id_c,
        room: cls.room_c,
        schedule: cls.schedule_c ? JSON.parse(cls.schedule_c) : {},
        studentIds: cls.student_ids_c ? JSON.parse(cls.student_ids_c) : []
      }));
      
      return classes;
    } catch (error) {
      console.error("Error fetching classes:", error?.response?.data?.message || error);
      toast.error("Failed to load classes");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "room_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "student_ids_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch class ${id}: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      const cls = response.data;
      if (!cls) return null;
      
      return {
        ...cls,
        name: cls.name_c || cls.Name,
        teacherId: cls.teacher_id_c,
        room: cls.room_c,
        schedule: cls.schedule_c ? JSON.parse(cls.schedule_c) : {},
        studentIds: cls.student_ids_c ? JSON.parse(cls.student_ids_c) : []
      };
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load class");
      return null;
    }
  }

  async create(classData) {
    try {
      const params = {
        records: [{
          Name: classData.name,
          name_c: classData.name,
          teacher_id_c: parseInt(classData.teacherId || classData.teacher_id || 1),
          room_c: classData.room,
          schedule_c: JSON.stringify(classData.schedule || {}),
          student_ids_c: JSON.stringify(classData.studentIds || []),
          Tags: classData.tags || ""
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create class: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} classes: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Class created successfully!");
          const cls = successful[0].data;
          return {
            ...cls,
            name: cls.name_c || cls.Name,
            teacherId: cls.teacher_id_c,
            room: cls.room_c,
            schedule: cls.schedule_c ? JSON.parse(cls.schedule_c) : {},
            studentIds: cls.student_ids_c ? JSON.parse(cls.student_ids_c) : []
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating class:", error?.response?.data?.message || error);
      toast.error("Failed to create class");
      return null;
    }
  }

  async update(id, classData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: classData.name,
          name_c: classData.name,
          teacher_id_c: parseInt(classData.teacherId || classData.teacher_id || 1),
          room_c: classData.room,
          schedule_c: JSON.stringify(classData.schedule || {}),
          student_ids_c: JSON.stringify(classData.studentIds || []),
          Tags: classData.tags || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update class: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} classes: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Class updated successfully!");
          const cls = successful[0].data;
          return {
            ...cls,
            name: cls.name_c || cls.Name,
            teacherId: cls.teacher_id_c,
            room: cls.room_c,
            schedule: cls.schedule_c ? JSON.parse(cls.schedule_c) : {},
            studentIds: cls.student_ids_c ? JSON.parse(cls.student_ids_c) : []
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating class:", error?.response?.data?.message || error);
      toast.error("Failed to update class");
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
        console.error(`Failed to delete class: ${response.message}`);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} classes: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Class deleted successfully!");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting class:", error?.response?.data?.message || error);
      toast.error("Failed to delete class");
      return false;
    }
  }
}

export const classService = new ClassService();