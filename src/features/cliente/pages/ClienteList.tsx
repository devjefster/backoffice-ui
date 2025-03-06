import React, {useCallback, useEffect, useState} from "react";
import ClienteService from "../service/ClienteService";
import DataTable from "../../../components/table/DataTable";
import CustomPagination from "../../../components/table/CustomPagination";
import {Button, Spinner, TableCell, TextInput} from "flowbite-react";
import {useNavigate} from "react-router-dom";
import {HiOutlineSearch} from "react-icons/hi";
import {Cliente} from "../model/Cliente";

const ClienteList = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filters, setFilters] = useState({textoBusca: ""});
    const [pagination, setPagination] = useState({page: 0, size: 10, totalPages: 0});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchClientes = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await ClienteService.listarComFiltros(
                filters.textoBusca,
                pagination.page,
                pagination.size
            );
            if (data) {
                setClientes(data.content);
                setPagination((prev) => ({
                    ...prev,
                    totalPages: data.page?.totalPages ?? 1,
                }));
            }
        } catch (err) {
            console.error("Erro ao carregar os clientes:", err);
        } finally {
            setIsLoading(false);
        }
    }, [filters.textoBusca, pagination.page, pagination.size]);
    const handlePaginationChange = (newPage: number, newSize: number) => {
        setPagination({page: newPage, size: newSize, totalPages: pagination.totalPages});
    };
    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <div className="mb-6 flex gap-4 items-center">
                <h2 className="flex items-center text-4xl font-extrabold text-primary">Clientes
                    <span
                        className="bg-pink-100 text-text-secondary text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-fuchsia-200-200 dark:text-blue-800 ms-2">Listagem</span>
                </h2>
            </div>


            <div className="mb-6 flex gap-4 items-center">
                <TextInput
                    type="text"
                    placeholder="Busque por nome ou CNPJ/CPF"
                    value={filters.textoBusca}
                    onChange={(e) => setFilters({...filters, textoBusca: e.target.value})}
                    className="w-1/3"
                />
                <Button onClick={fetchClientes} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Spinner size="sm" light className="mr-2"/>
                            Filtrando...
                        </>
                    ) : (
                        <>
                            <HiOutlineSearch className="mr-2"/>
                            Filtrar
                        </>
                    )}
                </Button>
            </div>

            {/* Data Table */}
            <DataTable
                data={clientes}
                headers={[
                    {key: "cpfCnpj", label: "CPF/CNPJ", sortable: false},
                    {key: "razaoSocial", label: "Nome", sortable: true},
                    {key: "acoes", label: "Ações"},
                ]}
                emptyMessage="Nenhum cliente encontrado."
                renderRow={(cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                        <TableCell>{cliente.razaoSocial}</TableCell>
                        <TableCell>{cliente.cpfCnpj}</TableCell>
                        <TableCell>
                            <Button
                                gradientDuoTone="cyanToBlue"
                                onClick={() => navigate(`/clientes/${cliente.id}`)}
                            >
                                Visualizar
                            </Button>
                        </TableCell>
                    </tr>
                )}
            />

            <CustomPagination
                pagination={pagination}
                onPaginationChange={handlePaginationChange} // Single callback
            />

        </div>
    );
};

export default ClienteList;
