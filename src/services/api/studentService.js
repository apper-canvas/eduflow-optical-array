import { toast } from "react-toastify";

class StudentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'student_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch students: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      toast.error("Failed to load students");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch student ${id}: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load student");
      return null;
    }
  }

  async create(studentData) {
    try {
      const params = {
        records: [{
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          email_c: studentData.email,
          phone_c: studentData.phone,
          grade_c: parseInt(studentData.grade),
          parent_id_c: studentData.parent_id || null,
          enrollment_date_c: studentData.enrollmentDate || new Date().toISOString().split('T')[0],
          status_c: studentData.status || "active",
          Tags: studentData.tags || ""
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create student: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} students: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Student created successfully!");
          return successful[0].data;
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      toast.error("Failed to create student");
      return null;
    }
  }

  async update(id, studentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          email_c: studentData.email,
          phone_c: studentData.phone,
          grade_c: parseInt(studentData.grade),
          parent_id_c: studentData.parent_id || null,
          enrollment_date_c: studentData.enrollmentDate,
          status_c: studentData.status,
          Tags: studentData.tags || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update student: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} students: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Student updated successfully!");
          return successful[0].data;
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      toast.error("Failed to update student");
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
        console.error(`Failed to delete student: ${response.message}`);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} students: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Student deleted successfully!");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      toast.error("Failed to delete student");
      return false;
    }
  }
}

export const studentService = new StudentService();