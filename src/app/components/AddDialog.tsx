import React, { useState, useEffect } from "react";
import { Industry, createIndustry, getAllIndustries } from "../apis/industries";
import {
  createDepartment,
  getDepartmentsByIndustry,
} from "../apis/departments";
import { createPosition } from "../apis/positions";

interface AddDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

enum Tab {
  Industries = "Industries",
  Department = "Department",
  Position = "Position",
}

const AddDialog: React.FC<AddDialogProps> = ({ isOpen, onClose }) => {
  const resetState = () => {
    setSelectedTab(Tab.Industries);
    setIndustry("");
    setDepartment("");
    setPosition("");
    setIndustryError("");
    setDepartmentError("");
    setPositionError("");
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset the state when the dialog is closed
      resetState();
    }
  }, [isOpen]);

  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Industries);
  const [industry, setIndustry] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [industriesList, setIndustriesList] = useState<Industry[]>([]);
  const [departmentsList, setDepartmentsList] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Define state variables for error messages
  const [industryError, setIndustryError] = useState<string>("");
  const [departmentError, setDepartmentError] = useState<string>("");
  const [positionError, setPositionError] = useState<string>("");

  useEffect(() => {
    if (selectedTab === Tab.Department) {
      getAllIndustries().then((data: any) => {
        // Transform the data to match the structure you need
        console.log(data)
        const transformedData = data.industries.map((item: { _id: any; name: any }) => ({
          id: item._id,
          name: item.name,
        }));

        setIndustriesList(transformedData);
      });
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === Tab.Position) {
      getAllIndustries().then((data: any) => {
        // Transform the data to match the structure you need
        const transformedData = data.industries.map((item: { _id: any; name: any }) => ({
          id: item._id,
          name: item.name,
        }));

        setIndustriesList(transformedData);
      });
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === Tab.Position && industry) {
      // Fetch departments by industry ID and store them in departmentsList
      getDepartmentsByIndustry(industry)
        .then((data: any[]) => {
          // Transform the data to match the structure you need
          const transformedData = data.map((item) => ({
            id: item._id,
            name: item.name,
          }));

          setDepartmentsList(transformedData);
        })
        .catch((error) => {
          console.error("Error fetching departments:", error);
        });
    }
  }, [industry]);

  const handleSubmit = async () => {
    // Reset error messages
    setIndustryError("");
    setDepartmentError("");
    setPositionError("");

    let isValid = true;

    if (selectedTab === Tab.Industries && industry.trim() === "") {
      setIndustryError("Industry is required.");
      isValid = false;
      return;
    }

    if (
      selectedTab === Tab.Department &&
      (department.trim() === "" || industry.trim() === "")
    ) {
      if (department.trim() === "") {
        setDepartmentError("Department is required");
        isValid = false;
        return;
      }
      if (industry.trim() === "") {
        setIndustryError("Industry is required");
        isValid = false;
        return;
      }
    }

    if (
      selectedTab === Tab.Position &&
      (department.trim() === "" ||
        industry.trim() === "" ||
        position.trim() === "")
    ) {
      if (position.trim() === "") {
        setPositionError("Position is required");
        isValid = false;
        return;
      }
      if (industry.trim() === "") {
        setIndustryError("Industry is required");
        isValid = false;
        return;
      }
      if (department.trim() === "") {
        setDepartmentError("Department is required");
        isValid = false;
        return;
      }
    }

    if (isValid) {
      // Send data to the API here
      try {
        if (selectedTab === Tab.Industries) {
          const response = await createIndustry(industry, department, position);
          console.log(response);
        }

        if (selectedTab === Tab.Department) {
          // Find the industryId that matches the selected industry name
          const response = await createDepartment(department, industry);
          console.log(response);
        }

        if (selectedTab === Tab.Position) {
          console.log(industry, department, position);
          const positionData = {
            name: position,
            department: department,
            industry: industry,
          };
          const response = await createPosition(positionData);
        }

        // Close the dialog
        onClose();
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 ${
        isOpen ? "block" : "hidden"
      } bg-gray-500 bg-opacity-75 flex items-center justify-center`}
    >
      <div className="bg-white p-4 rounded-lg md:w-2/3 lg:w-1/3">
        <div className="flex">
          <h2 className="text-gray-600 text-base md:text-lg flex-1 text-center">
            Add Category
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-gray-500 mt-2 text-center">
          What Category do you want to add?
        </p>
        <div className="mt-4">
          <div className="flex items-center justify-around">
            {Object.values(Tab).map((tab) => (
              <button
                key={tab}
                className={`p-1 md:px-4 md:py-2 md:w-1/4 md:h-10 rounded-lg ${
                  selectedTab === tab
                    ? "bg-blue-500 text-white"
                    : "text-blue-500 hover:bg-blue-100 border-2 border-blue-500"
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {selectedTab === Tab.Industries ? (
              <input
                type="text"
                placeholder="Industry*"
                className={`w-full p-2 border rounded ${
                  industryError ? "border-red-500" : ""
                }`}
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setIndustryError("");
                }}
              />
            ) : (
              <select
                className={`w-full p-2 border rounded ${
                  industryError ? "border-red-500" : ""
                }`}
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setIndustryError("");
                }}
              >
                <option value="">Select an industry</option>
                {/* Populate the options with industry names and store IDs as values */}
                {industriesList.map((industryItem) => (
                  <option key={industryItem.id} value={industryItem.id}>
                    {industryItem.name}
                  </option>
                ))}
              </select>
            )}
            {industryError && (
              <p className="text-red-500 mt-2">{industryError}</p>
            )}
          </div>

          <div className="mt-4">
            {selectedTab !== Tab.Position ? (
              <input
                type="text"
                placeholder="Department"
                className={`w-full p-2 border rounded ${
                  departmentError ? "border-red-500" : ""
                }`}
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setDepartmentError("");
                }}
              />
            ) : (
              <select
                className={`w-full p-2 border rounded ${
                  departmentError ? "border-red-500" : ""
                }`}
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setDepartmentError("");
                }}
              >
                <option value="">Select a Department</option>
                {/* Populate the options with industry names and store IDs as values */}
                {departmentsList.map((departmentItem) => (
                  <option key={departmentItem.id} value={departmentItem.id}>
                    {departmentItem.name}
                  </option>
                ))}
              </select>
            )}
            {departmentError && (
              <p className="text-red-500 mt-2">{departmentError}</p>
            )}
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Position"
              className={`w-full p-2 border rounded ${
                positionError ? "border-red-500" : ""
              }`}
              value={position}
              onChange={(e) => {
                setPosition(e.target.value);
                setPositionError("");
              }}
            />
            {positionError && (
              <p className="text-red-500 mt-2">{positionError}</p>
            )}
          </div>

          <div className="mt-4 text-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDialog;
