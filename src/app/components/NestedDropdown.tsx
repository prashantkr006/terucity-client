"use client";
import React, { useState, useEffect } from "react";
import { getAllIndustries } from "../apis/industries";
import { getDepartmentsByIndustry } from "../apis/departments";
import { getPositionsByIndustryAndDepartment } from "../apis/positions";

interface Industry {
  id: string;
  name: string;
}

interface Department {
  id: string;
  industryId: string;
  name: string;
}

interface Position {
  id: string;
  departmentId: string;
  industryId: string;
  name: string;
}

const NestedDropdown: React.FC<{ industries: Industry[] }> = ({
  industries,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const handleIndustryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const industryId = event.target.value;
    setSelectedIndustry(industryId);
    setSelectedDepartment(null);
    setSelectedPosition(null);

    try {
      // Fetch departments based on the selected industry
      const data = await getDepartmentsByIndustry(event.target.value);
      console.log("department data is ", data);

      const departmentData = data.map(
        (department: { _id: string; name: string; industry: string }) => ({
          id: department._id,
          name: department.name,
          industryId: department.industry,
        })
      );
      setDepartments(departmentData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleDepartmentChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const departmentId = event.target.value;
    setSelectedDepartment(departmentId);
    setSelectedPosition(null);

    try {
      if (selectedIndustry) {
        const position = await getPositionsByIndustryAndDepartment(
          selectedIndustry,
          departmentId
        );

        const positionsData = position.map((pos: any) => ({
          id: pos._id, // Map _id to id
          departmentId: pos.department._id, // Map department._id to departmentId
          industryId: pos.industry._id, // Map industry._id to industryId
          name: pos.name,
        }));

        setPositions(positionsData);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handlePositionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const positionId = event.target.value;
    setSelectedPosition(positionId);
  };

  return (
    <div className="flex flex-col space-y-1">
      <select
        value={selectedIndustry || ""}
        onChange={handleIndustryChange}
        className="py-2 px-4 border-2 border-amber-500 rounded-full"
      >
        <option value="">Select Industry</option>
        {industries.map((industry) => (
          <option
            key={industry.id}
            value={industry.id}
            className="py-2 my-2 px-4 border-2 border-amber-500 rounded-full"
          >
            {industry.name}
          </option>
        ))}
      </select>

      {selectedIndustry !== null && (
        <select
          value={selectedDepartment || ""}
          onChange={handleDepartmentChange}
          className="py-2 px-4 border-2 border-amber-500 rounded-full"
        >
          <option value="">Select Department</option>
          {departments
            .filter((department) => department.industryId === selectedIndustry)
            .map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
        </select>
      )}

      {selectedDepartment !== null && (
        <select
          value={selectedPosition || ""}
          onChange={handlePositionChange}
          className="py-2 px-4 border-2 border-amber-500 rounded-full"
        >
          <option value="">Select Position</option>
          {positions
            .filter((position) => position.departmentId === selectedDepartment)
            .map((position) => (
              <option key={position.id} value={position.id}>
                {position.name}
              </option>
            ))}
        </select>
      )}
    </div>
  );
};

export default NestedDropdown;
