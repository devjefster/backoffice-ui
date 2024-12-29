import React, {useEffect, useState} from "react";
import {Button, Label, TableCell, Tabs, TextInput, Tooltip} from "flowbite-react";
import InsumoService from "../service/InsumoService";
import {useNavigate} from "react-router-dom";
import {InsumoDTO} from "@features/insumos/model/Insumo";
import TituloPagina from "@components/comum/TituloPagina";
import Seletor from "@components/comum/Seletor";
import {Enum} from "../../../model/Comum";
import DataTable from "@components/table/DataTable";
import {HiOutlineInformationCircle} from "react-icons/hi";


const InsumoForm: React.FC<{
    insumo?: InsumoDTO | null;
    onSave: (formData: InsumoDTO) => void
}> = ({
          insumo,
          onSave,
      }) => {
    const [formData, setFormData] = useState<InsumoDTO>({
        id: 0,
        nome: "",
        descricao: "",
        tipoInsumo: "",
        unidadeMedida: "",
        fabricantes: [],
        fornecedores: [],
        grades: [],
    });
    const [tipoOptions, setTipoOptions] = useState<Enum[]>([]);
    const [unidadeMedidaOptions, setUnidadeMedidaOptions] = useState<Enum[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (insumo) setFormData(insumo);
        fetchNums();
    }, [insumo]);

    const fetchNums = async () => {
        try {
            const tiposResponse = await InsumoService.obterTiposDeInsumo();
            const unidadesResponse = await InsumoService.obterUnidadeMedida();
            setTipoOptions(tiposResponse);
            setUnidadeMedidaOptions(unidadesResponse);
        } catch (error) {
            console.error("Erro ao carregar filtros:", error);
        }
    };

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({...prev, [key]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.id && formData.id > 0) {
                const updated = await InsumoService.atualizar(formData.id, formData);
                onSave(updated.data);
            } else {
                const created = await InsumoService.criar(formData);
                onSave(created.data);
            }
        } catch (error) {
            console.error("Erro ao salvar o insumo:", error);
        }
    };

    return (
        <form className="space-y-8 bg-white shadow-lg p-8 rounded-lg" onSubmit={handleSubmit}>
            <TituloPagina titulo={"Insumo"} subTitulo={!insumo?.id || insumo?.id === 0 ? ("Novo") : ("Atualizar")}
                          navigate={navigate} url={"/insumos/cadastro"}/>
            <Tabs>
                {/* First Tab: Form */}
                <Tabs.Item title="Dados Gerais">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="nome" className="flex items-center">
                                Nome
                                <Tooltip content="Nome do Insumo">
                                    <HiOutlineInformationCircle className="ml-2 text-gray-500 cursor-pointer"/>
                                </Tooltip>
                            </Label>
                            <TextInput
                                id="nome"
                                type="text"
                                placeholder="Digite o Nome do insumo"
                                value={formData.nome || ""}
                                onChange={(e) => handleChange("nome", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="descricao" className="flex items-center">
                                Descrição
                            </Label>
                            <TextInput
                                id="descricao"
                                type="text"
                                placeholder="Digite a descrição do insumo"
                                value={formData.nome || ""}
                                onChange={(e) => handleChange("descricao", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="tipoInsumo">Tipo de Insumo</Label>
                            <Seletor
                                opcoes={tipoOptions}
                                value={formData.tipoInsumo}
                                placeholder="Selecione o Tipo de Insumo"
                                onChange={(e) => handleChange("tipoInsumo", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="tipoInsumo">Unidade Medida</Label>
                            <Seletor
                                opcoes={unidadeMedidaOptions}
                                value={formData.unidadeMedida}
                                placeholder="Selecione a Unidade de Medida"
                                onChange={(e) => handleChange("tipoUnidade", e.target.value)}
                            />
                        </div>

                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button type="button" color="gray" onClick={() => navigate("/insumos")}>
                            Cancelar
                        </Button>
                        <Button type="submit" gradientDuoTone="cyanToBlue">
                            Salvar
                        </Button>
                    </div>
                </Tabs.Item>

                {/* Second Tab: Lists */}
                <Tabs.Item title="Detalhes">
                    <div>
                        <h3 className="text-lg font-semibold mt-6 mb-4">Fabricantes</h3>
                        <DataTable
                            data={formData.fabricantes}
                            headers={[
                                {key: "id", label: "Id", sortable: true},
                                {key: "Nome", label: "Nome"},
                            ]}
                            renderRow={(fabricante) => (
                                <>
                                    <TableCell>{fabricante.id}</TableCell>
                                    <TableCell>{fabricante.nomeFantasia}</TableCell>
                                </>
                            )}
                            emptyMessage="Nenhum fabricante encontrado."/>
                        <h3 className="text-lg font-semibold mt-6 mb-4">Fornecedores</h3>
                    </div>
                    <div>
                        <DataTable
                            data={formData.fornecedores}
                            headers={[
                                {key: "id", label: "Id", sortable: true},
                                {key: "Nome", label: "Nome"},
                            ]}
                            renderRow={(fornecedor) => (
                                <>
                                    <TableCell>{fornecedor.id}</TableCell>
                                    <TableCell>{fornecedor.nomeFantasia}</TableCell>
                                </>
                            )}
                            emptyMessage="Nenhum fornecedor encontrado."/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mt-6 mb-4">Grades</h3>
                        <DataTable
                            data={formData.grades}
                            headers={[
                                {key: "id", label: "Id", sortable: true},
                                {key: "Nome", label: "Nome"},
                                {key: "valores", label: "Valores"},
                            ]}
                            renderRow={(grade) => (
                                <>
                                    <TableCell>{grade.id}</TableCell>
                                    <TableCell>{grade.nome}</TableCell>
                                    <TableCell>{grade.valores.join(", ")}</TableCell>
                                </>
                            )}
                            emptyMessage="Nenhuma grade encontrada."/>
                    </div>
                </Tabs.Item>
            </Tabs>

        </form>
    )
};

export default InsumoForm;
