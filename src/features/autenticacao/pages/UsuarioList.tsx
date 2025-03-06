import React, {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Spinner, TableCell, TextInput} from "flowbite-react";
import {HiOutlineSearch, HiPlus} from "react-icons/hi";
import DataTable from "../../../components/table/DataTable";
import CustomPagination from "../../../components/table/CustomPagination";
import {Usuario} from "../model/Usuario";
import {deletar, listarComFiltros} from "@features/autenticacao/service/userService";

const UsuarioList: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [filters, setFilters] = useState({textoBusca: ""});
    const [pagination, setPagination] = useState({page: 0, size: 10, totalPages: 0});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchUsuarios = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await listarComFiltros(filters.textoBusca, pagination.page, pagination.size);
            if (data) {
                setUsuarios(data.content);
                setPagination((prev) => ({
                    ...prev,
                    totalPages: data.page?.totalPages ?? 1,
                }));
            }
        } catch (err) {
            console.error("Erro ao carregar os usuários:", err);
        } finally {
            setIsLoading(false);
        }
    }, [filters.textoBusca, pagination.page, pagination.size]);
    const handlePaginationChange = (newPage: number, newSize: number) => {
        setPagination({page: newPage, size: newSize, totalPages: pagination.totalPages});
    };
    const handleDelete = async (id: number) => {
        if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
            try {
                await deletar(id);
                alert("Usuário excluído com sucesso!");
                fetchUsuarios();
            } catch (err) {
                console.error("Erro ao excluir o usuário:", err);
                alert("Erro ao excluir o usuário.");
            }
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    return (
        <div className="p-6 bg-background">
            {/* Header */}
            <div className="mb-6 flex gap-4 items-center">
                <h2 className="flex items-center text-4xl font-extrabold text-primary">
                    Usuários
                    <span
                        className="bg-pink-100 text-text-secondary text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-fuchsia-200-200 dark:text-blue-800 ms-2">
                        Listagem
                    </span>
                </h2>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-4 items-center">
                <TextInput
                    type="text"
                    placeholder="Busque por nome, telefone ou e-mail"
                    value={filters.textoBusca}
                    onChange={(e) => setFilters({...filters, textoBusca: e.target.value})}
                    className="w-1/3"
                />

                <Button gradientDuoTone="purpleToBlue" onClick={fetchUsuarios} disabled={isLoading}>
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

                <Button gradientDuoTone="greenToBlue" onClick={() => navigate("/usuarios/new")}>
                    <HiPlus className="mr-2"/>
                    Novo Usuário
                </Button>
            </div>

            {/* Data Table */}
            <DataTable
                data={usuarios}
                headers={[
                    {key: "nome", label: "Nome", sortable: true},
                    {key: "email", label: "E-mail", sortable: true},
                    {key: "telefone", label: "Telefone", sortable: false},
                    {key: "acoes", label: "Ações"},
                ]}
                emptyMessage="Nenhum usuário encontrado."
                renderRow={(usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                        <TableCell>{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.telefone}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button
                                    gradientDuoTone="cyanToBlue"
                                    onClick={() => navigate(`/usuarios/${usuario.id}`)}
                                >
                                    Editar
                                </Button>
                                <Button color="failure" onClick={() => handleDelete(usuario.id)}>
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

export default UsuarioList;
