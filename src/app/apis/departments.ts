import axios from "axios";
import API_BASE_URL from "../config";

//Create Department

export const createDepartment = async (
  departmentName: string,
  industryId: string
) => {
  try {
    console.log(departmentName, industryId);
    const response = await axios.post(`${API_BASE_URL}/departments/create`, {
      name: departmentName,
      industry: industryId,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating departments:", error.response.data);
  }
};

// get all departments
export const getAllDepartments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/departments`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching departments:", error.response.data);
    throw error;
  }
};

//get departments by industry
export const getDepartmentsByIndustry = async (industryId: string) => {
  console.log("api integration", industryId);
  try {
    const response = await axios.get(`/departments/byIndustry/${industryId}`, {
      baseURL: API_BASE_URL,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching departments:", error.response.data);

    throw error;
  }
};
