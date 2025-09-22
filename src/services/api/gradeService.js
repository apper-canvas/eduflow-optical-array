import { toast } from "react-toastify";

class GradeService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'grade_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "date_recorded_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "assignment_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch grades: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to expected format
      const grades = (response.data || []).map(grade => ({
        ...grade,
        score: grade.score_c,
        maxScore: grade.max_score_c,
        dateRecorded: grade.date_recorded_c,
        teacherId: grade.teacher_id_c,
        studentId: grade.student_id_c?.Id || grade.student_id_c,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c
      }));
      
      return grades;
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      toast.error("Failed to load grades");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "date_recorded_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "assignment_id_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Failed to fetch grade ${id}: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      const grade = response.data;
      if (!grade) return null;
      
      return {
        ...grade,
        score: grade.score_c,
        maxScore: grade.max_score_c,
        dateRecorded: grade.date_recorded_c,
        teacherId: grade.teacher_id_c,
        studentId: grade.student_id_c?.Id || grade.student_id_c,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c
      };
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load grade");
      return null;
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "date_recorded_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "assignment_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "student_id_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}],
        orderBy: [{"fieldName": "date_recorded_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch grades for student ${studentId}: ${response.message}`);
        toast.error(response.message);
        return [];
      }
      
      const grades = (response.data || []).map(grade => ({
        ...grade,
        score: grade.score_c,
        maxScore: grade.max_score_c,
        dateRecorded: grade.date_recorded_c,
        teacherId: grade.teacher_id_c,
        studentId: grade.student_id_c?.Id || grade.student_id_c,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c
      }));
      
      return grades;
    } catch (error) {
      console.error(`Error fetching grades for student ${studentId}:`, error?.response?.data?.message || error);
      toast.error("Failed to load student grades");
      return [];
    }
  }

  async create(gradeData) {
    try {
      const params = {
        records: [{
          Name: `Grade for ${gradeData.studentId}`,
          score_c: parseInt(gradeData.score),
          max_score_c: parseInt(gradeData.maxScore),
          date_recorded_c: gradeData.dateRecorded || new Date().toISOString().split('T')[0],
          teacher_id_c: parseInt(gradeData.teacherId || 1),
          student_id_c: parseInt(gradeData.studentId),
          assignment_id_c: parseInt(gradeData.assignmentId),
          Tags: gradeData.tags || ""
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to create grade: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} grades: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Grade recorded successfully!");
          const grade = successful[0].data;
          return {
            ...grade,
            score: grade.score_c,
            maxScore: grade.max_score_c,
            dateRecorded: grade.date_recorded_c,
            teacherId: grade.teacher_id_c,
            studentId: grade.student_id_c?.Id || grade.student_id_c,
            assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      toast.error("Failed to record grade");
      return null;
    }
  }

  async update(id, gradeData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Grade for ${gradeData.studentId}`,
          score_c: parseInt(gradeData.score),
          max_score_c: parseInt(gradeData.maxScore),
          date_recorded_c: gradeData.dateRecorded || new Date().toISOString().split('T')[0],
          teacher_id_c: parseInt(gradeData.teacherId || 1),
          student_id_c: parseInt(gradeData.studentId),
          assignment_id_c: parseInt(gradeData.assignmentId),
          Tags: gradeData.tags || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to update grade: ${response.message}`);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} grades: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Grade updated successfully!");
          const grade = successful[0].data;
          return {
            ...grade,
            score: grade.score_c,
            maxScore: grade.max_score_c,
            dateRecorded: grade.date_recorded_c,
            teacherId: grade.teacher_id_c,
            studentId: grade.student_id_c?.Id || grade.student_id_c,
            assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
      toast.error("Failed to update grade");
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
        console.error(`Failed to delete grade: ${response.message}`);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} grades: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Grade deleted successfully!");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      toast.error("Failed to delete grade");
      return false;
    }
  }
}

export const gradeService = new GradeService();