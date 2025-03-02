import React, {useCallback, useEffect, useState} from "react";
import InsumoService from "../service/InsumoService";
import {Button, Spinner, TableCell} from "flowbite-react";
import {HiOutlineSearch, HiOutlineX, HiPencil, HiPlus, HiTrash} from "react-icons/hi";
import {InsumoDTO} from "@features/insumos/model/Insumo";
import DataTable from "@components/table/DataTable";
import CustomPagination from "@components/table/CustomPagination";
import {useNavigate} from "react-router-dom";
import TituloPagina from "@components/comum/TituloPagina";
import TextoBuscaInput from "@components/comum/InputBuscaTexto";
import Seletor from "@components/comum/Seletor";
import DeleteModal from "@components/comum/DeleteModal";

const InsumoList = () => {
    const [insumos, setInsumos] = useState<InsumoDTO[]>([]);
    const [filters, setFilters] = useState({textoBusca: "", tipo: "", unidadeMedida: ""});
    const [pagination, setPagination] = useState({page: 0, size: 10, totalPages: 0});
    const [isLoading, setIsLoading] = useState(false);
    const [tiposInsumo, setTiposInsumo] = useState<{ chave: string; valor: string }[]>([]);
    const [unidadesMedida, setUnidadesMedida] = useState<{ chave: string; valor: string }[]>([]);
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [insumoToDelete, setInsumoToDelete] = useState<string | null>(null)

    const fetchInsumos = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await InsumoService.listarComFiltros(filters.textoBusca, filters.tipo, pagination.page, pagination.size);
            if (response) {
                setInsumos(response.content || []);
                setPagination((prev) => ({...prev, totalPages: response.totalPages}));
            }
        } catch (error) {
            console.error("Erro ao carregar insumos:", error);
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.page, pagination.size]);

    const fetchFiltros = async () => {
        try {
            const tiposResponse = await InsumoService.obterTiposDeInsumo();
            const unidadesResponse = await InsumoService.obterUnidadeMedida();
            setTiposInsumo(tiposResponse);
            setUnidadesMedida(unidadesResponse);
        } catch (error) {
            console.error("Erro ao carregar filtros:", error);
        }
    };

    useEffect(() => {
        fetchInsumos();
        fetchFiltros();
    }, [fetchInsumos]);

    const handleResetFilters = () => {
        setFilters({textoBusca: "", tipo: "", unidadeMedida: ""});
        fetchInsumos();
    };

    const handleDelete = async (id: number) => {
        try {
            await InsumoService.deletar(id);
            fetchInsumos();
        } catch (error) {
            console.error("Erro ao deletar insumo:", error);
        } finally {
            closeDeleteModal();
        }
    };
    const openDeleteModal = (nomeInsumno: string) => {
        setIsDeleteModalOpen(true);
        setInsumoToDelete(nomeInsumno)
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setInsumoToDelete(null)
    };
    const handleChange = (key: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === "" ? null : value // Se for vazio, define como null
        }));
    };

    return (
        <div className="bg-gradient-to-b from-background to-background-alt">
            <TituloPagina titulo="Insumo" subTitulo="Listagem"/>

            <div className="flex gap-4 mb-6">
                <TextoBuscaInput
                    placeholder="Buscar por nome"
                    val={filters.textoBusca}
                    change={(value) => setFilters({...filters, textoBusca: value})}
                    onEnter={fetchInsumos}
                />

                <Seletor
                    enums={tiposInsumo}
                    value={filters.tipo}
                    placeholder="Selecione o Tipo de Insumo"
                    onChange={(e) => handleChange("tipo",e)}
                />

                <Seletor
                    enums={unidadesMedida}
                    value={filters.unidadeMedida}
                    placeholder="Selecione a Unidade de Medida"
                    onChange={(e) => handleChange("unidadeMedida",e)}
                />
            </div>
            <div className="flex justify-end mb-6 space-x-4">
                <Button gradientDuoTone="purpleToBlue" onClick={fetchInsumos} disabled={isLoading} className="flex items-center gap-2">
                    <HiOutlineSearch className="w-5 h-5"/>
                    {isLoading ? "Carregando..." : "Filtrar"}
                </Button>

                <Button color="gray" onClick={handleResetFilters}  className="flex items-center gap-2">
                    <HiOutlineX className="w-5 h-5"/>
                    Limpar Filtros
                </Button>

                <Button gradientDuoTone="greenToBlue" onClick={() => navigate("/insumos/:new")}  className="flex items-center gap-2">
                    <HiPlus className="w-5 h-5"/>
                    Novo Insumo
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center my-10">
                    <Spinner size="xl"/>
                </div>
            ) : (
                <DataTable
                    data={insumos}
                    headers={[
                        {key: "nome", label: "Nome", sortable: true},
                        {key: "descricao", label: "Descrição"},
                        {key: "tipo", label: "Tipo", sortable: true},
                        {key: "acoes", label: "Ações"},
                    ]}
                    renderRow={(insumo) => (
                        <>
                            <TableCell>{insumo.nome}</TableCell>
                            <TableCell>{insumo.descricao}</TableCell>
                            <TableCell>{insumo.tipo}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button size="xs" onClick={() => navigate(`/insumos/${insumo.id}/edit`)} className="flex items-center gap-2">
                                        <HiPencil className="mr-1"/> Editar
                                    </Button>
                                    <Button
                                        type="button"
                                        color="failure"
                                        onClick={() => openDeleteModal(insumo.nome)}
                                        className="flex items-center gap-2"
                                    >
                                        <HiTrash className="w-5 h-5"/>
                                        Excluir
                                    </Button>
                                    <DeleteModal
                                        isOpen={isDeleteModalOpen}
                                        entityName={insumoToDelete}
                                        onClose={closeDeleteModal}
                                        onConfirm={() => handleDelete(insumo.id)} // Certifique-se de passar o id correto
                                    />
                                </div>
                            </TableCell>
                        </>
                    )}
                    emptyMessage="Nenhum insumo encontrado."
                />
            )}

            <CustomPagination
                pagination={pagination}
                setPagination={setPagination}
                onPageSizeChange={(size) => setPagination((prev) => ({...prev, size, page: 0}))}
            />

        </div>
    );
};

export default InsumoList;
