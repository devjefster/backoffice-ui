import React, { useState } from "react";
import { Table } from "flowbite-react";

interface TableHeader {
    key: string;
    label: string;
    sortable?: boolean;
}

interface TableProps<T> {
    data: T[];
    headers: TableHeader[];
    renderRow: (item: T, index: number) => React.ReactNode;
    emptyMessage?: string;
    onSort?: (key: string, order: "asc" | "desc") => void;
}

const DataTable = <T,>({
                           data,
                           headers,
                           renderRow,
                           emptyMessage = "Nenhum dado encontrado.",
                           onSort,
                       }: TableProps<T>) => {
    const [sortState, setSortState] = useState<{ key: string; order: "asc" | "desc" } | null>(null);

    const handleSort = (key: string) => {
        if (!onSort) return;

        let order: "asc" | "desc" = "asc";
        if (sortState && sortState.key === key) {
            order = sortState.order === "asc" ? "desc" : "asc";
        }

        setSortState({ key, order });
        onSort(key, order);
    };

    return (
        <div className="overflow-x-auto">
            <Table hoverable className="min-w-full text-left">
                <Table.Head>
                    {headers.map((header, index) => (
                        <Table.HeadCell
                            key={index}
                            onClick={() => header.sortable && handleSort(header.key)}
                            className={`cursor-pointer ${header.sortable ? "hover:underline" : ""}`}
                        >
                            {header.label}
                            {header.sortable && (
                                <span className="ml-2">
                                    {sortState?.key === header.key
                                        ? sortState.order === "asc"
                                            ? "▲"
                                            : "▼"
                                        : "⇅"}
                                </span>
                            )}
                        </Table.HeadCell>
                    ))}
                </Table.Head>
                <Table.Body className="divide-y">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <Table.Row key={index} className="bg-white hover:bg-gray-100">
                                {renderRow(item, index)}
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={headers.length} className="text-center text-gray-500 py-4">
                                {emptyMessage}
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </div>
    );
};

export default DataTable;
