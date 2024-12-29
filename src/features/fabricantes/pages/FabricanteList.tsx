import React, {useCallback, useEffect, useState} from "react";
import FabricanteService from "../service/FabricanteService";
import {Fabricante} from "../models/Fabricante";
import DataTable from "../../../components/table/DataTable";
import CustomPagination from "../../../components/table/CustomPagination";
import {Button, Spinner, TableCell, TextInput} from "flowbite-react";
import {useNavigate} from "react-router-dom";
import {HiOutlineSearch, HiPlus} from "react-icons/hi";
import TituloPagina from "@components/comum/TituloPagina";

const FabricanteList = () => {
    const [fabricantes, setFabricantes] = useState<Fabricante[]>([]);
    const [filters, setFilters] = useState({textoBusca: ""});
    const [pagination, setPagination] = useState({page: 0, size: 10, totalPages: 0});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const fetchFabricantes = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await FabricanteService.listarComFiltros(
                filters.textoBusca,
                pagination.page,
                pagination.size
            );
            if (data) {
                setFabricantes(data.content);
                setPagination((prev) => ({...prev, totalPages: data.totalPages}));
            }
        } catch (err) {
            console.error("Erro ao carregar os fabricantes:", err);
        } finally {
            setIsLoading(false);
        }
    }, [filters.textoBusca, pagination.page, pagination.size]);

    useEffect(() => {
        fetchFabricantes();
    }, [fetchFabricantes]);

    return (
        <div className="p-6 bg-background">
            <TituloPagina titulo={"Fabricantes"} subTitulo={"Listagem"}/>
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
                    onClick={fetchFabricantes}
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
                    onClick={() => navigate("/fabricantes/new")}
                >
                    <HiPlus className="mr-2"/>
                    Novo Fabricante
                </Button>
            </div>

            {/* Data Table */}
            <DataTable
                data={fabricantes}
                headers={[
                    {key: "nomeFantasia", label: "Nome Fantasia", sortable: true},
                    {key: "cpfCnpj", label: "CPF/CNPJ", sortable: false},
                    {key: "razaoSocial", label: "Razão Social", sortable: true},
                    {key: "acoes", label: "Ações"},
                ]}
                emptyMessage="Nenhum fabricante encontrado."
                renderRow={(fabricante) => (
                    <tr key={fabricante.id} className="hover:bg-gray-50">
                        <TableCell>{fabricante.nomeFantasia}</TableCell>
                        <TableCell>{fabricante.cpfCnpj}</TableCell>
                        <TableCell>{fabricante.razaoSocial}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button
                                    gradientDuoTone="cyanToBlue"
                                    onClick={() => navigate(`/fabricantes/${fabricante.id}`)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    color="failure"
                                    onClick={() => console.log("Excluir", fabricante.id)}
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

export default FabricanteList;
