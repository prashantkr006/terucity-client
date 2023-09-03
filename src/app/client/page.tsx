"use client";
import React, { useState, useEffect } from "react";
import PaginationFooter from "../components/PagignationFooter"; // Import the PaginationFooter component
import { Industry, getAllIndustries } from "../apis/industries";
import { getDepartmentsByIndustry } from "../apis/departments";
import { getPositionsByIndustryAndDepartment } from "../apis/positions";

export default function SelectComponents() {
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  const [departments, setDepartments] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [positions, setPositions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [industries, setIndustries] = useState<Industry[]>([]); // State variable for industries data
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page
  const [totalPages, setTotalPages] = useState<number>(0); // Total pages, initially 0
  const [limit, setlimit] = useState<number>(5); // Rows per page, initially 5

  // Function to fetch industries data with pagination
  const fetchIndustries = async (page: number, limit: number) => {
    try {
      // Fetch industries with pagination from the API
      const response = await getAllIndustries(page, limit);

      // Extract data from the API response
      const { industries, totalIndustries, totalPages } = response;

      console.log(response);
      const industriesData = industries.map((apiIndustry: any) => ({
        id: apiIndustry._id,
        name: apiIndustry.name,
      }));
      setIndustries(industriesData);

      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  useEffect(() => {
    // Fetch initial industries data when the component mounts
    fetchIndustries(currentPage, limit);
  }, [currentPage, limit]);

  const handlePageChange = (newPage: number) => {
    // Handle page change and fetch data for the new page
    setCurrentPage(newPage);
    fetchIndustries(newPage, limit);
  };

  const handlelimitChange = (newlimit: number) => {
    // Handle rows per page change and reset to the first page
    setlimit(newlimit);
    setCurrentPage(1);
    fetchIndustries(1, newlimit); // Fetch data for the first page with the new limit
  };

  // Fetch Industries
  // useEffect(() => {
  //   const fetchIndustriesData = async () => {
  //     try {
  //       getAllIndustries().then((data: any) => {
  //         // Transform the data to match the structure you need
  //         console.log(data);
  //         const transformedData = data.industries.map(
  //           (item: { _id: any; name: any }) => ({
  //             id: item._id,
  //             name: item.name,
  //           })
  //         );

  //         setIndustries(transformedData);
  //       });
  //     } catch (error) {
  //       console.error("Error fetching industries:", error);
  //     }
  //   };

  //   fetchIndustriesData();
  // }, []);

  // Fetch Departments when the selectedIndustry changes
  useEffect(() => {
    if (selectedIndustry) {
      const fetchDepartmentsData = async () => {
        try {
          const data = await getDepartmentsByIndustry(selectedIndustry);
          const transformedData = data.map(
            (item: { _id: string; name: string }) => ({
              id: item._id,
              name: item.name,
            })
          );

          setDepartments(transformedData);
        } catch (error) {
          console.error("Error fetching departments:", error);
        }
      };

      fetchDepartmentsData();
    }
  }, [selectedIndustry]);

  // Fetch Positions when the selectedDepartment changes
  useEffect(() => {
    if (selectedDepartment) {
      const fetchPositionsData = async () => {
        try {
          const data = await getPositionsByIndustryAndDepartment(
            selectedIndustry,
            selectedDepartment
          );
          console.log(data);
          const transformedData = data.map(
            (item: { _id: string; name: string }) => ({
              id: item._id,
              name: item.name,
            })
          );
          console.log(transformedData);
          setPositions(transformedData);
        } catch (error) {
          console.error("Error fetching positions:", error);
        }
      };

      fetchPositionsData();
    }
  }, [selectedDepartment, selectedIndustry]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="container flex flex-col mx-auto space-y-4 w-3/4">
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="p-2"
        >
          <option value="">Select Industry</option>
          {industries.map((industry) => (
            <option key={industry.id} value={industry.id}>
              {industry.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="p-2"
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>

        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="p-2"
        >
          <option value="">Select Position</option>
          {positions.map((position) => (
            <option key={position.id} value={position.id}>
              {position.name}
            </option>
          ))}
        </select>
      </div>
      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onlimitChange={handlelimitChange}
      />
    </div>
  );
}
