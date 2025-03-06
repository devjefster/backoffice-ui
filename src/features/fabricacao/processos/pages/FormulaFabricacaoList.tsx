import React, {useCallback, useEffect, useState} from "react";
import FormulaFabricacaoService from "../service/FormulaFabricacaoService";
import {FormulaFabricacaoDTO} from "../model/FormulaFabricacao";
import {Button, Spinner, TableCell, TextInput} from "flowbite-react";
import {useNavigate} from "react-router-dom";
import {HiOutlineSearch, HiPlus} from "react-icons/hi";
import DataTable from "@components/table/DataTable";
import CustomPagination from "@components/table/CustomPagination";

const FormulaFabricacaoList = () => {
    const [formulas, setFormulas] = useState<FormulaFabricacaoDTO[]>([]);
    const [filters, setFilters] = useState({
        textoBusca: "",
        tipoProcesso: "",
        dataInicio: "",
        dataFim: ""
    });
    const [pagination, setPagination] = useState({page: 0, size: 10, totalPages: 0});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchFormulas = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await FormulaFabricacaoService.listarComFiltros(
                filters.textoBusca,
                filters.dataInicio,
                filters.dataFim,
                pagination.page,
                pagination.size
            );
            if (data) {
                setFormulas(data.content);
                setPagination((prev) => ({
                    ...prev,
                    totalPages: data.page?.totalPages ?? 1,
                }));
            }
        } catch (err) {
            console.error("Erro ao carregar as fórmulas de fabricação:", err);
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.page, pagination.size]);

    useEffect(() => {
        fetchFormulas();
    }, [fetchFormulas]);
    const handlePaginationChange = (newPage: number, newSize: number) => {
        setPagination({page: newPage, size: newSize, totalPages: pagination.totalPages});
    };
    return (
        <div className="p-8 bg-background">
            <div className="mb-6 flex gap-4 items-center">
                <h2 className="flex items-center text-4xl font-extrabold text-primary">
                    Fórmulas de Fabricação
                    <span
                        className="bg-pink-100 text-text-secondary text-2xl font-semibold me-2 px-2.5 py-0.5 rounded ms-2">
                        Listagem
                    </span>
                </h2>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                <TextInput
                    type="text"
                    placeholder="Busque por nome da fórmula"
                    value={filters.textoBusca}
                    onChange={(e) => setFilters({...filters, textoBusca: e.target.value})}
                />
                <TextInput
                    type="date"
                    placeholder="Data Início"
                    value={filters.dataInicio}
                    onChange={(e) => setFilters({...filters, dataInicio: e.target.value})}
                />
                <TextInput
                    type="date"
                    placeholder="Data Fim"
                    value={filters.dataFim}
                    onChange={(e) => setFilters({...filters, dataFim: e.target.value})}
                />
                <Button gradientDuoTone="purpleToBlue" onClick={fetchFormulas} disabled={isLoading}>
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
                    onClick={() => navigate("/formula-fabricacao/new")}
                >
                    <HiPlus className="mr-2"/>
                    Nova Fórmula
                </Button>
            </div>

            <DataTable
                data={formulas}
                headers={[
                    {key: "nome", label: "Nome da Fórmula", sortable: true},
                    {key: "descricao", label: "Descrição", sortable: false},
                    {key: "produto.nome", label: "Produto", sortable: true},
                    {key: "acoes", label: "Ações"},
                ]}
                emptyMessage="Nenhuma fórmula de fabricação encontrada."
                renderRow={(formula: FormulaFabricacaoDTO) => (
                    <tr key={formula.id} className="hover:bg-gray-50">
                        <TableCell>{formula.nome}</TableCell>
                        <TableCell>{formula.descricao}</TableCell>
                        <TableCell>{formula.produto?.nome}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button gradientDuoTone="cyanToBlue"
                                        onClick={() => navigate(`/formula-fabricacao/${formula.id}`)}>
                                    Editar
                                </Button>
                                <Button color="failure" onClick={() => console.log("Excluir", formula.id)}>
                                    Excluir
                                </Button>
                            </div>
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

export default FormulaFabricacaoList;
