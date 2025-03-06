import React from "react";
import {Pagination} from "flowbite-react";

interface PaginationProps {
    pagination: {
        page: number;
        size: number;
        totalPages: number;
    };
    onPaginationChange: (newPage: number, newSize: number) => void; // Single function for updates
}
const CustomPagination: React.FC<PaginationProps> = ({ pagination, onPaginationChange }) => {
    const { page, size, totalPages } = pagination;

    const handlePageChange = (newPage: number) => {
        onPaginationChange(newPage, size);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value, 10);
        onPaginationChange(0, newSize); // Reset to page 0 when size changes
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
