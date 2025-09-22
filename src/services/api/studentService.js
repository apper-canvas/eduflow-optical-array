import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "status_c"}}
        ],
        orderBy: [{"fieldName": "first_name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "status_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(studentData) {
    try {
      // Format data for database field names
      const formattedData = {
        first_name_c: studentData.firstName,
        last_name_c: studentData.lastName,
        email_c: studentData.email,
        phone_c: studentData.phone,
        grade_c: parseInt(studentData.grade),
        status_c: studentData.status
      };

      const params = {
        records: [formattedData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create student:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create student");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, studentData) {
    try {
      // Format data for database field names
      const formattedData = {
        Id: id,
        first_name_c: studentData.firstName,
        last_name_c: studentData.lastName,
        email_c: studentData.email,
        phone_c: studentData.phone,
        grade_c: parseInt(studentData.grade),
        status_c: studentData.status
      };

      const params = {
        records: [formattedData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update student:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update student");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete student:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const studentService = new StudentService();