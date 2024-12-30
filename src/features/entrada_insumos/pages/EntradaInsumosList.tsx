import React, {useCallback, useEffect, useState} from "react";
import {EntradaInsumosDTO} from "@features/entrada_insumos/model/EntradaInsumos";
import {Button, Spinner, TableCell, TextInput} from "flowbite-react";
import {useNavigate} from "react-router-dom";
import {HiOutlineSearch, HiTrash} from "react-icons/hi";
import EntradaInsumosService from "@features/entrada_insumos/service/EntradaInsumosService";
import DataTable from "@components/table/DataTable";
import CustomPagination from "@components/table/CustomPagination";
import DeleteModal from "@components/comum/DeleteModal";
import TypeAhead from "@components/inputs/TypeAhead";
import TituloPagina from "@components/comum/TituloPagina";
import PessoaService from "@features/pessoa/service/PessoaService";


const EntradaInsumosList = () => {
    const [entradas, setEntradas] = useState<EntradaInsumosDTO[]>([]);
    const [filters, setFilters] = useState({
        textoBusca: "",
        fornecedorId: null,
        dataInicio: "",
        dataFim: "",
    });
    const [pagination, setPagination] = useState({page: 0, size: 10, totalPages: 0});
    const [isLoading, setIsLoading] = useState(false);

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedEntradaId, setSelectedEntradaId] = useState<number | null>(null);
    const [selectedEntradaName, setSelectedEntradaName] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchEntradas = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await EntradaInsumosService.listar(
                filters.textoBusca,
                filters.fornecedorId,
                filters.dataInicio,
                filters.dataFim,
                pagination.page,
                pagination.size
            );
            if (data) {
                setEntradas(data.content);
                setPagination((prev) => ({...prev, totalPages: data.totalPages}));
            }
        } catch (err) {
            console.error("Erro ao carregar as entradas de insumos:", err);
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.page, pagination.size]);

    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (!hasFetched) {
            fetchEntradas();
            setHasFetched(true);
        }
    }, [fetchEntradas, hasFetched]);


    const openDeleteModal = (entrada: EntradaInsumosDTO) => {
        setSelectedEntradaId(entrada.id || null);
        setSelectedEntradaName(entrada.fornecedor?.nomeFantasia || null);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedEntradaId) return;
        try {
            await EntradaInsumosService.deletarEntrada(selectedEntradaId);
            fetchEntradas();
        } catch (err) {
            console.error("Erro ao excluir a entrada de insumos:", err);
        } finally {
            setModalOpen(false);
        }
    };
    const fetchPaginatedList = async (serviceMethod: Function, query: string, additionalParams?: any) => {
        try {
            const response = await serviceMethod(query, 0, 10, additionalParams);
            return response?.content || [];
        } catch (error) {
            console.error("Error fetching paginated list:", error);
            return [];
        }
    };

    return (
        <div className="bg-gradient-to-b from-background to-background-alt">
            <TituloPagina titulo={"Entrada de Insumos"} subTitulo={"Listagem"}/>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-2">
                <TextInput
                    type="text"
                    placeholder="Busque por fornecedor ou insumo"
                    value={filters.textoBusca}
                    onChange={(e) => setFilters({...filters, textoBusca: e.target.value})}
                />
                <TypeAhead
                    fetchOptions={(query) => fetchPaginatedList(PessoaService.listarComFiltros, query)}
                    onSelect={(selected) => setFilters({...filters, fornecedorId: selected.id})}
                    placeholder="Selecione o fornecedor"
                />
                <TextInput
                    type="date"
                    placeholder="Data de Início"
                    value={filters.dataInicio}
                    onChange={(e) => setFilters({...filters, dataInicio: e.target.value})}
                />
                <TextInput
                    type="date"
                    placeholder="Data de Fim"
                    value={filters.dataFim}
                    onChange={(e) => setFilters({...filters, dataFim: e.target.value})}
                />
            </div>
            <div className="flex justify-end mb-6 space-x-4">
                <Button
                    gradientDuoTone="purpleToBlue"
                    onClick={fetchEntradas}
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner size="sm" light className="mr-2"/> : <HiOutlineSearch className="mr-2"/>}
                    Filtrar
                </Button>
                <Button
                    gradientDuoTone="greenToBlue"
                    onClick={() => navigate("/insumos/entrada/new")}
                    disabled={isLoading}
                >
                    Nova Entrada
                </Button>
            </div>


            {/* Data Table */}
            <DataTable
                data={entradas}
                headers={[
                    {key: "fornecedor.nomeFantasia", label: "Fornecedor", sortable: true},
                    {key: "dataEntrada", label: "Data Entrada", sortable: true},
                    {key: "custoFrete", label: "Custo Frete", sortable: true},
                    {key: "custoOutros", label: "Custo Outros", sortable: true},
                    {key: "custoTotal", label: "Custo Total", sortable: true},
                    {key: "acoes", label: "Ações"},
                ]}
                renderRow={(entrada) => (
                    <tr key={entrada.id} className="hover:bg-gray-50">
                        <TableCell>{entrada.fornecedor?.nomeFantasia || "N/A"}</TableCell>
                        <TableCell>{new Date(entrada.dataEntrada).toLocaleDateString()}</TableCell>
                        <TableCell>R$ {entrada.custoFrete.toFixed(2)}</TableCell>
                        <TableCell>R$ {entrada.custoOutros.toFixed(2)}</TableCell>
                        <TableCell>R$ {(entrada.custoFrete + entrada.custoOutros).toFixed(2)}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button gradientDuoTone="cyanToBlue"
                                        onClick={() => navigate(`/entrada-insumos/${entrada.id}`)}>
                                    Editar
                                </Button>
                                <Button color="failure" onClick={() => openDeleteModal(entrada)}>
                                    <HiTrash className="w-5 h-5"/>
                                    Excluir
                                </Button>
                            </div>
                        </TableCell>
                    </tr>
                )}
                emptyMessage="Nenhuma entrada de insumo encontrada."
            />

            <CustomPagination pagination={pagination} setPagination={setPagination}/>
            <DeleteModal isOpen={isModalOpen} entityName={selectedEntradaName} onClose={() => setModalOpen(false)}
                         onConfirm={handleDelete}/>
        </div>
    );
};

export default EntradaInsumosList;
