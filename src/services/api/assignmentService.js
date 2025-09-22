import { toast } from "react-toastify";

class AssignmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'assignment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch assignments: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to expected format
      const assignments = (response.data || []).map(assignment => ({
        ...assignment,
        title: assignment.title_c || assignment.Name,
        description: assignment.description_c,
        maxScore: assignment.max_score_c,
        dueDate: assignment.due_date_c,
        category: assignment.category_c,
        classId: assignment.class_id_c?.Id || assignment.class_id_c
      }));
      
      return assignments;
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      toast.error("Failed to load assignments");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch assignment ${id}: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      const assignment = response.data;
      if (!assignment) return null;
      
      return {
        ...assignment,
        title: assignment.title_c || assignment.Name,
        description: assignment.description_c,
        maxScore: assignment.max_score_c,
        dueDate: assignment.due_date_c,
        category: assignment.category_c,
        classId: assignment.class_id_c?.Id || assignment.class_id_c
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load assignment");
      return null;
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          Name: assignmentData.title,
          title_c: assignmentData.title,
          description_c: assignmentData.description || "",
          max_score_c: parseInt(assignmentData.maxScore || 100),
          due_date_c: assignmentData.dueDate,
          category_c: assignmentData.category || "homework",
          class_id_c: parseInt(assignmentData.classId),
          Tags: assignmentData.tags || ""
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create assignment: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} assignments: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Assignment created successfully!");
          const assignment = successful[0].data;
          return {
            ...assignment,
            title: assignment.title_c || assignment.Name,
            description: assignment.description_c,
            maxScore: assignment.max_score_c,
            dueDate: assignment.due_date_c,
            category: assignment.category_c,
            classId: assignment.class_id_c?.Id || assignment.class_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to create assignment");
      return null;
    }
  }

  async update(id, assignmentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: assignmentData.title,
          title_c: assignmentData.title,
          description_c: assignmentData.description || "",
          max_score_c: parseInt(assignmentData.maxScore || 100),
          due_date_c: assignmentData.dueDate,
          category_c: assignmentData.category || "homework",
          class_id_c: parseInt(assignmentData.classId),
          Tags: assignmentData.tags || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update assignment: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} assignments: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Assignment updated successfully!");
          const assignment = successful[0].data;
          return {
            ...assignment,
            title: assignment.title_c || assignment.Name,
            description: assignment.description_c,
            maxScore: assignment.max_score_c,
            dueDate: assignment.due_date_c,
            category: assignment.category_c,
            classId: assignment.class_id_c?.Id || assignment.class_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to update assignment");
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
        console.error(`Failed to delete assignment: ${response.message}`);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} assignments: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Assignment deleted successfully!");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      toast.error("Failed to delete assignment");
      return false;
    }
  }
}

export const assignmentService = new AssignmentService();