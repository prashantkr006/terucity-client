import axios from "axios";
import API_BASE_URL from "../config";

interface PositionData {
  name: string;
  department: string;
  industry: string;
}

// Create a new position
export const createPosition = async (positionData: PositionData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/positions/create`,
      positionData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating position:", error.response.data);
    throw error;
  }
};

// get all departments
export const getAllPositions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/positions`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching departments:", error.response.data);
    throw error;
  }
};

export const getPositionsByIndustryAndDepartment = async (
  industryId: string,
  departmentId: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/positions/byIndustryAndDepartment/${industryId}/${departmentId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching positions:", error.response.data);
    throw error;
  }
};
