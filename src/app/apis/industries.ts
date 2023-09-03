import axios from "axios";
import API_BASE_URL from "../config";

export interface IndustryData {
  industries: Industry[];
  totalIndustries: number;
  totalPages: number;
}

export interface Industry {
  id: string;
  name: string;
}

export const createIndustry = async (
  industry: string,
  department?: string,
  position?: string
) => {
  try {
    const requestBody = {
      industry,
      department,
      position,
    };

    const response = await axios.post(
      `${API_BASE_URL}/industries/create`,
      requestBody
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating industry:", error.response.data);

    throw error;
  }
};

export const getAllIndustries = async (
  page?: number,
  limit?: number
): Promise<IndustryData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/industries`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching industries:", error.response.data);
    throw error;
  }
};
