import { toast } from "react-toastify";

class AttendanceService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'attendance_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch attendance: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to expected format
      const attendance = (response.data || []).map(record => ({
        ...record,
        studentId: record.student_id_c?.Id || record.student_id_c,
        date: record.date_c,
        status: record.status_c || "absent",
        notes: record.notes_c || ""
      }));
      
      return attendance;
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error);
      toast.error("Failed to load attendance records");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch attendance ${id}: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      const record = response.data;
      if (!record) return null;
      
      return {
        ...record,
        studentId: record.student_id_c?.Id || record.student_id_c,
        date: record.date_c,
        status: record.status_c || "absent",
        notes: record.notes_c || ""
      };
    } catch (error) {
      console.error(`Error fetching attendance ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load attendance record");
      return null;
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "student_id_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch attendance for student ${studentId}: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      const attendance = (response.data || []).map(record => ({
        ...record,
        studentId: record.student_id_c?.Id || record.student_id_c,
        date: record.date_c,
        status: record.status_c || "absent",
        notes: record.notes_c || ""
      }));
      
      return attendance;
    } catch (error) {
      console.error(`Error fetching attendance for student ${studentId}:`, error?.response?.data?.message || error);
      toast.error("Failed to load student attendance");
      return [];
    }
  }

  async getByDate(date) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "EqualTo", "Values": [date]}],
        orderBy: [{"fieldName": "student_id_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch attendance for date ${date}: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      const attendance = (response.data || []).map(record => ({
        ...record,
        studentId: record.student_id_c?.Id || record.student_id_c,
        date: record.date_c,
        status: record.status_c || "absent",
        notes: record.notes_c || ""
      }));
      
      return attendance;
    } catch (error) {
      console.error(`Error fetching attendance for date ${date}:`, error?.response?.data?.message || error);
      toast.error("Failed to load date attendance");
      return [];
    }
  }

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          Name: `Attendance for ${attendanceData.studentId}`,
          student_id_c: parseInt(attendanceData.studentId),
          date_c: attendanceData.date || new Date().toISOString().split('T')[0],
          status_c: attendanceData.status || "absent",
          notes_c: attendanceData.notes || "",
          Tags: attendanceData.tags || ""
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create attendance: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} attendance records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Attendance recorded successfully!");
          const record = successful[0].data;
          return {
            ...record,
            studentId: record.student_id_c?.Id || record.student_id_c,
            date: record.date_c,
            status: record.status_c || "absent",
            notes: record.notes_c || ""
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating attendance:", error?.response?.data?.message || error);
      toast.error("Failed to record attendance");
      return null;
    }
  }

  async update(id, attendanceData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Attendance for ${attendanceData.studentId}`,
          student_id_c: parseInt(attendanceData.studentId),
          date_c: attendanceData.date,
          status_c: attendanceData.status || "absent",
          notes_c: attendanceData.notes || "",
          Tags: attendanceData.tags || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update attendance: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} attendance records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Attendance updated successfully!");
          const record = successful[0].data;
          return {
            ...record,
            studentId: record.student_id_c?.Id || record.student_id_c,
            date: record.date_c,
            status: record.status_c || "absent",
            notes: record.notes_c || ""
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating attendance:", error?.response?.data?.message || error);
      toast.error("Failed to update attendance");
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
        console.error(`Failed to delete attendance: ${response.message}`);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} attendance records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Attendance deleted successfully!");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting attendance:", error?.response?.data?.message || error);
      toast.error("Failed to delete attendance");
      return false;
    }
  }
}

export const attendanceService = new AttendanceService();

export const attendanceService = new AttendanceService();