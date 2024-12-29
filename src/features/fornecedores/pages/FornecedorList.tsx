import React, {useCallback, useEffect, useState} from "react";
import DataTable from "../../../components/table/DataTable";
import CustomPagination from "../../../components/table/CustomPagination";
import {Button, Spinner, TableCell, TextInput} from "flowbite-react";
import {useNavigate} from "react-router-dom";
import {HiOutlineSearch, HiPlus} from "react-icons/hi";
import FornecedorService from "../service/FornecedorService";
import {Fornecedor} from "../models/Fornecedor";

const FornecedorList = () => {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [filters, setFilters] = useState({textoBusca: ""});
    const [pagination, setPagination] = useState({page: 0, size: 10, totalPages: 0});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchFornecedor = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await FornecedorService.listarComFiltros(
                filters.textoBusca,
                pagination.page,
                pagination.size
            );
            if (data) {
                setFornecedores(data.content);
                setPagination((prev) => ({...prev, totalPages: data.totalPages}));
            }
        } catch (err) {
            console.error("Erro ao carregar os fornecedores:", err);
        } finally {
            setIsLoading(false);
        }
    }, [filters.textoBusca, pagination.page, pagination.size]);

    useEffect(() => {
        fetchFornecedor();
    }, [fetchFornecedor]);

    return (
        <div className="p-6 bg-background">
            <div className="mb-6 flex gap-4 items-center">
                <h2 className="flex items-center text-4xl font-extrabold text-primary">Fornecedores
                    <span
                        className="bg-pink-100 text-text-secondary text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-fuchsia-200-200 dark:text-blue-800 ms-2">Listagem</span>
                </h2>
            </div>

            {/* Filters Section */}
            <div className="mb-6 flex gap-4 items-center">
                {/* Nome Fantasia Input */}
                <TextInput
                    type="text"
                    placeholder="Busque por nome ou CNPJ/CPF"
                    value={filters.textoBusca}
                    onChange={(e) => setFilters({...filters, textoBusca: e.target.value})}
                    className="w-1/3"
                />


                {/* Buttons */}
                <Button
                    gradientDuoTone="purpleToBlue"
                    onClick={fetchFornecedor}
                    disabled={isLoading}
                >
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

                <Button
                    gradientDuoTone="greenToBlue"
                    onClick={() => navigate("/fornecedores/new")}
                >
                    <HiPlus className="mr-2"/>
                    Novo Fabricante
                </Button>
            </div>

            {/* Data Table */}
            <DataTable
                data={fornecedores}
                headers={[
                    {key: "nomeFantasia", label: "Nome Fantasia", sortable: true},
                    {key: "cpfCnpj", label: "CPF/CNPJ", sortable: false},
                    {key: "razaoSocial", label: "Razão Social", sortable: true},
                    {key: "acoes", label: "Ações"},
                ]}
                emptyMessage="Nenhum fornecedor encontrado."
                renderRow={(fornecedor) => (
                    <tr key={fornecedor.id} className="hover:bg-gray-50">
                        <TableCell>{fornecedor.nomeFantasia}</TableCell>
                        <TableCell>{fornecedor.cpfCnpj}</TableCell>
                        <TableCell>{fornecedor.razaoSocial}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button
                                    gradientDuoTone="cyanToBlue"
                                    onClick={() => navigate(`/fornecedores/${fornecedor.id}`)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    color="failure"
                                    onClick={() => console.log("Excluir", fornecedor.id)}
                                >
                                    Excluir
                                </Button>
                            </div>
                        </TableCell>
                    </tr>
                )}
            />

            {/* Pagination */}
            <CustomPagination pagination={pagination} setPagination={setPagination}/>

        </div>

    );
};

export default FornecedorList;
