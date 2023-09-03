"use client";
import React, { useState, useEffect } from "react";
import NestedDropdown from "./components/NestedDropdown";
import AddDialog from "./components/AddDialog";
import PaginationFooter from "./components/PagignationFooter";
import { Industry, getAllIndustries } from "./apis/industries";

interface HomeProps {
  // Add any props if needed
}

const Home: React.FC<HomeProps> = (props) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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

  const handleAddButtonClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  return (
    <main className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="container mx-auto space-y-4 w-3/4">
        <div className="w-full text-right">
          <button
            onClick={handleAddButtonClick}
            className="bg-gray-400 text-black text-lg font-semibold py-2 px-4"
          >
            Add +
          </button>
        </div>
        <NestedDropdown industries={industries} />
      </div>

      {/* Include the PaginationFooter component below the industries data */}
      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onlimitChange={handlelimitChange}
      />
      <AddDialog isOpen={isAddDialogOpen} onClose={handleCloseAddDialog} />
    </main>
  );
};

export default Home;
