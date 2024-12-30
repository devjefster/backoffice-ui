import React, {useCallback, useState} from "react";
import DataTable from "@components/table/DataTable";
import CustomPagination from "@components/table/CustomPagination";
import {Button, Spinner, TableCell, TextInput} from "flowbite-react";
import {useNavigate} from "react-router-dom";
import {HiOutlineSearch, HiPlus} from "react-icons/hi";
import {FiltrosPessoa, Pessoa, TipoCadastro, TipoPessoa} from "@features/pessoa/model/Pessoa";
import CPFOrCNPJInput from "@components/inputs/CPFOrCNPJInput";
import PessoaService from "@features/pessoa/service/PessoaService";
import Seletor from "@components/comum/Seletor";

const FornecedorList = () => {
    const [fornecedores, setFornecedores] = useState<Pessoa[]>([]);
    const [filtros, setFiltros] = useState<FiltrosPessoa>({
        nome: "",
        tipoPessoa: null, // Manter null para valores não selecionados
        tipo: TipoCadastro[TipoCadastro.FORNECEDOR],
        cpfCnpj: ""
    });

    const [pagination, setPagination] = useState({page: 0, size: 10, totalPages: 0});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchFornecedor = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const data = await PessoaService.listarComFiltros(filtros, pagination.page, pagination.size);
            if (data) {
                setFornecedores(data.content);
                setPagination((prev) => ({...prev, totalPages: data.totalPages}));
            }
        } catch (err) {
            console.error("Erro ao carregar os fornecedores:", err);
            setFetchError("Erro ao carregar fornecedores. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, [filtros, pagination.page, pagination.size]);


    return (
        <div className="p-6 bg-background">
            <div className="mb-6 flex gap-4 items-center">
                <h2 className="flex items-center text-4xl font-extrabold text-primary">Fornecedores
                    <span
                        className="bg-pink-100 text-text-secondary text-2xl font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-fuchsia-200-200 dark:text-blue-800 ms-2">Listagem</span>
                </h2>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4 items-center">
                <TextInput
                    type="text"
                    placeholder="Busque por nome"
                    value={filtros.nome || ""}
                    onChange={(e) => setFiltros({...filtros, nome: e.target.value})}
                />
                <CPFOrCNPJInput
                    value={filtros.cpfCnpj || ""}
                    onChange={(value) => setFiltros({...filtros, cpfCnpj: value})}
                    required
                />
                <Seletor
                    enumType={TipoPessoa}
                    value={filtros.tipoPessoa || ""}
                    placeholder="Tipo de Pessoa"
                    onChange={(e) => setFiltros({...filtros, tipoPessoa: e as TipoPessoa | null})}
                />
            </div>
            <div className="mb-6 flex gap-4 items-center">
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
                    Novo Fornecedor
                </Button>
            </div>

            {fetchError && <p className="text-red-500">{fetchError}</p>}

            <DataTable
                data={fornecedores}
                headers={[
                    {key: "cpfCnpj", label: "CPF/CNPJ", sortable: false},
                    {key: "Nome", label: "Nome Fantasia", sortable: true},
                    {key: "razaoSocial", label: "Razão Social", sortable: true},
                    {key: "acoes", label: "Ações"},
                ]}
                emptyMessage="Nenhum fornecedor encontrado."
                renderRow={(fornecedor) => (
                    <>
                        <TableCell>{fornecedor.cpfCnpj}</TableCell>
                        <TableCell>{fornecedor.nomeFantasia || fornecedor.razaoSocial ? fornecedor.nomeFantasia : fornecedor.nome}</TableCell>
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
                    </>
                )}
            />

            {/* Pagination */}
            <CustomPagination pagination={pagination} setPagination={setPagination}/>

        </div>

    );
};

export default FornecedorList;
