import React, {useCallback, useEffect, useState} from "react";
import {Button, Checkbox, Spinner, TableCell, TextInput} from "flowbite-react";
import DataTable from "@components/table/DataTable";
import CustomPagination from "@components/table/CustomPagination";
import {useNavigate} from "react-router-dom";
import {HiOutlineEye, HiOutlineSearch} from "react-icons/hi";
import EstoqueService from "@features/estoque/service/EstoqueService";
import {EstoqueDTO, FiltrosEstoque} from "@features/estoque/model/Estoque";

const EstoqueList: React.FC = () => {
    const [estoques, setEstoques] = useState<EstoqueDTO[]>([]);
    const [filters, setFilters] = useState<FiltrosEstoque>({
        textoBusca: "",
        tipo: "",
        validadeMinima: "",
        validadeMaxima: "",
        fabricacaoMinima: "",
        fabricacaoMaxima: "",
        unidadeMedida: "",
        someLotesComEstoque: false,
    });
    const [pagination, setPagination] = useState({page: 0, size: 10, totalPages: 0});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const fetchEstoques = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await EstoqueService.listarEstoques(filters, pagination.page, pagination.size);
            if (data) {
                setEstoques(data.content);
                setPagination((prev) => ({...prev, totalPages: data.totalPages}));
            }
        } catch (err) {
            console.error("Erro ao carregar os estoques:", err);
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.page, pagination.size]);

    useEffect(() => {
        fetchEstoques();
    }, [fetchEstoques]);

    return (
        <div className="bg-gradient-to-b from-background to-background-alt">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestão de Estoques</h1>
            <div className="bg-white shadow rounded-lg p-4 mb-6">
                <h2 className="text-xl font-semibold mb-4">Filtrar Estoques</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <TextInput
                        type="text"
                        placeholder="Buscar Estoques"
                        value={filters.textoBusca}
                        onChange={(e) => setFilters({...filters, textoBusca: e.target.value})}
                        className="w-full"
                    />
                    <TextInput
                        type="text"
                        placeholder="Tipo"
                        value={filters.tipo}
                        onChange={(e) => setFilters({...filters, tipo: e.target.value})}
                        className="w-full"
                    />
                    <TextInput
                        type="date"
                        placeholder="Validade Mínima"
                        value={filters.validadeMinima}
                        onChange={(e) => setFilters({...filters, validadeMinima: e.target.value})}
                        className="w-full"
                    />
                    <TextInput
                        type="date"
                        placeholder="Validade Máxima"
                        value={filters.validadeMaxima}
                        onChange={(e) => setFilters({...filters, validadeMaxima: e.target.value})}
                        className="w-full"
                    />
                    <TextInput
                        type="date"
                        placeholder="Fabricação Mínima"
                        value={filters.fabricacaoMinima}
                        onChange={(e) => setFilters({...filters, fabricacaoMinima: e.target.value})}
                        className="w-full"
                    />
                    <TextInput
                        type="date"
                        placeholder="Fabricação Máxima"
                        value={filters.fabricacaoMaxima}
                        onChange={(e) => setFilters({...filters, fabricacaoMaxima: e.target.value})}
                        className="w-full"
                    />
                    <TextInput
                        type="text"
                        placeholder="Unidade de Medida"
                        value={filters.unidadeMedida}
                        onChange={(e) => setFilters({...filters, unidadeMedida: e.target.value})}
                        className="w-full"
                    />
                    <div className="flex items-center">
                        <Checkbox
                            checked={filters.someLotesComEstoque}
                            onChange={(e) => setFilters({...filters, someLotesComEstoque: e.target.checked})}
                            className="mr-2"
                        />
                        <label className="text-gray-700">Somente lotes com estoque</label>
                    </div>
                </div>
                <br/>
                <div className="flex justify-end mb-6 space-x-4">
                    <Button
                        gradientDuoTone="purpleToBlue"
                        onClick={fetchEstoques}
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
                </div>
            </div>
            <div className="bg-white shadow rounded-lg">
                <DataTable
                    data={estoques}
                    headers={[
                        {key: "insumo.nome", label: "Insumo/Produto", sortable: true},
                        {key: "quantidade", label: "Quantidade", sortable: true},
                        {key: "unidadeMedida", label: "Unidade Medida", sortable: true},
                        {key: "acoes", label: "Ações"},
                    ]}
                    emptyMessage="Nenhum estoque encontrado."
                    renderRow={(estoque) => (
                        <tr key={estoque.id} className="hover:bg-gray-100">
                            <TableCell>{estoque.insumo ? estoque.insumo.nome : estoque.produto.nome}</TableCell>
                            <TableCell>{estoque.quantidade}</TableCell>
                            <TableCell>{estoque.unidadeMedida}</TableCell>
                            <TableCell>
                                <Button
                                    gradientDuoTone="cyanToBlue"
                                    onClick={() => navigate(`/insumos/estoque/${estoque.id}`)}
                                    className="mr-2"
                                >
                                    <HiOutlineEye className="mr-1"/>
                                    Ver Detalhes
                                </Button>
                                <Button
                                    gradientDuoTone="purpleToPink"
                                    onClick={() => navigate(`/insumos/estoque/${estoque.id}/movimentacoes`)}
                                >
                                    Movimentações
                                </Button>
                            </TableCell>
                        </tr>
                    )}
                />
            </div>
            <CustomPagination pagination={pagination} setPagination={setPagination}/>
        </div>
    )
        ;
};

export default EstoqueList;
