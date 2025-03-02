import React from "react";
import {Pagination} from "flowbite-react";

interface PaginationProps {
    pagination: {
        page: number;
        size: number;
        totalPages: number;
    };
    setPagination: React.Dispatch<React.SetStateAction<{
        page: number;
        size: number;
        totalPages: number;
    }>>;
    onPageSizeChange?: (size: number) => void; // Optional prop for page size changes
}

const CustomPagination: React.FC<PaginationProps> = ({ pagination, setPagination, onPageSizeChange }) => {
    const { page, size, totalPages } = pagination;

    const handlePageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value, 10);
        setPagination((prev) => ({ ...prev, size: newSize, page: 0 })); // Reset to page 0
        onPageSizeChange?.(newSize);
    };

    return (
        <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-4">
                <label htmlFor="pageSize" className="text-sm text-gray-600">
                    Itens por página:
                </label>
                <select
                    id="pageSize"
                    value={size}
                    onChange={handlePageSizeChange}
                    className="border rounded-md p-2 text-sm"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
            <p className="text-sm text-gray-600">
                Página {page + 1} de {totalPages}
            </p>
            <Pagination
                currentPage={page + 1}
                layout="navigation"
                onPageChange={(newPage) => handlePageChange(newPage - 1)}
                showIcons
                totalPages={totalPages}
            />
        </div>
    );
};

export default CustomPagination;
