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
        aplicacao: null,
        dimensoes: null,
        especificacoesTecnicas: null,
        material: null,
        tipoConsumivel: null, // Permite valores opcionais
        tipoEmbalagem: null,
        tipoMateriaPrima: null,
        id: 0,
        nome: "",
        descricao: "",
        tipo: null,
        unidadeMedida: null,
        fabricantes: [],
        fornecedores: [],
        grades: []
    });

    const [tipoOptions, setTipoOptions] = useState<Enum[]>([]);
    const [tipoMaterialPrima, setTipoMaterialPrima] = useState<Enum[]>([]);
    const [tipoEmbalagens, setTipoEmbalagens] = useState<Enum[]>([]);
    const [tipoConsumivel, setTipoConsumivel] = useState<Enum[]>([]);
    const [unidadeMedidaOptions, setUnidadeMedidaOptions] = useState<Enum[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (insumo) {
            setFormData((prev) => ({
                ...prev,
                ...insumo,
                tipo: insumo.tipo || null,
                unidadeMedida: insumo.unidadeMedida || null,
                tipoMateriaPrima: insumo.tipoMateriaPrima || null,
                tipoConsumivel: insumo.tipoConsumivel || null,
                tipoEmbalagem: insumo.tipoEmbalagem || null,
            }));
        }
        fetchNums();
    }, [insumo]);

    const fetchNums = async () => {
        try {
            const tiposResponse = await InsumoService.obterTiposDeInsumo();
            const unidadesResponse = await InsumoService.obterUnidadeMedida();
            const tipoMaterialPrima = await InsumoService.obterSubtiposPorTipoInsumo('MATERIA_PRIMA');
            const tipoConsumivel = await InsumoService.obterSubtiposPorTipoInsumo('CONSUMIVEIS');
            const tipoEmbalagens = await InsumoService.obterSubtiposPorTipoInsumo('EMBALAGEM');
            setTipoOptions(tiposResponse);
            setTipoMaterialPrima(tipoMaterialPrima);
            setTipoEmbalagens(tipoEmbalagens);
            setTipoConsumivel(tipoConsumivel);
            setUnidadeMedidaOptions(unidadesResponse);
        } catch (error) {
            console.error("Erro ao carregar filtros:", error);
        }
    };

    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value === "" ? null : value // Se for vazio, define como null
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const sanitizedData = {
                ...formData,
                tipo: formData.tipo || null,
                unidadeMedida: formData.unidadeMedida || null,
                tipoMateriaPrima: formData.tipoMateriaPrima || null,
                tipoConsumivel: formData.tipoConsumivel || null,
                tipoEmbalagem: formData.tipoEmbalagem || null
            };
            if (formData.id && formData.id > 0) {
                const updated = await InsumoService.atualizar(formData.id, sanitizedData);
                onSave(updated.data);
                alert("Insumo alterado com sucesso!");
            } else {
                const created = await InsumoService.criar(sanitizedData);
                onSave(created.data);
                alert("Insumo cadastrado com sucesso!");
            }
        } catch (error) {
            alert("Erro ao salvar o insumo: " + error);
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
                                value={formData.descricao || ""}
                                onChange={(e) => handleChange("descricao", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="tipo">Tipo de Insumo</Label>
                            <Seletor
                                enums={tipoOptions}
                                value={formData.tipo}
                                placeholder="Selecione o Tipo de Insumo"
                                onChange={(e) => handleChange("tipo", e)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <Label htmlFor="tipo">Unidade Medida</Label>
                            <Seletor
                                enums={unidadeMedidaOptions}
                                value={formData.unidadeMedida}
                                placeholder="Selecione a Unidade de Medida"
                                onChange={(e) => handleChange("unidadeMedida", e)}
                            />
                        </div>

                    </div>
                    <div className="mt-5 grid grid-cols-2 md:grid-cols-2 gap-6">
                        {formData.tipo === "MATERIA_PRIMA" && (
                            <>
                                <div className="flex flex-col">
                                    <Label htmlFor="tipo">Tipo Matéria Prima</Label>
                                    <Seletor
                                        enums={tipoMaterialPrima}
                                        value={formData.tipoMateriaPrima}
                                        placeholder="Selecione o Tipo de matéria prima"
                                        onChange={(e) => {
                                            handleChange("tipoMateriaPrima", e)
                                        }}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="especificacoesTecnicas" className="flex items-center">
                                        Especificações Técnicas
                                    </Label>
                                    <TextInput
                                        id="especificacoesTecnicas"
                                        type="text"
                                        placeholder="Digite as Especificações Técnicas"
                                        value={formData.especificacoesTecnicas || ""}
                                        onChange={(e) => handleChange("especificacoesTecnicas", e.target.value)}/>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                        {formData.tipo === "CONSUMIVEIS" && (
                            <>
                                <div className="flex flex-col">
                                    <Label htmlFor="tipoConsumivel">Tipo de Consumíveis</Label>
                                    <Seletor
                                        enums={tipoConsumivel}
                                        value={formData.tipoConsumivel}
                                        placeholder="Selecione o Tipo Consumível"
                                        onChange={(e) => {
                                            handleChange("tipoConsumivel", e)
                                        }}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="aplicacao" className="flex items-center">
                                        Aplicação
                                    </Label>
                                    <TextInput
                                        id="aplicacao"
                                        type="text"
                                        placeholder="Digite as Especificações Técnicas"
                                        value={formData.aplicacao || ""}
                                        onChange={(e) => handleChange("aplicacao", e.target.value)}/>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                        {formData.tipo === "EMBALAGEM" && (
                            <>
                                <div className="flex flex-col">
                                    <Label htmlFor="tipo">Tipo de Embalagem</Label>
                                    <Seletor
                                        enums={tipoEmbalagens}
                                        value={formData.tipoEmbalagem}
                                        placeholder="Selecione o Tipo de matéria prima"
                                        onChange={(e) => {
                                            handleChange("tipoEmbalagem", e)
                                        }}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="dimensoes" className="flex items-center">
                                        Dimensões
                                    </Label>
                                    <TextInput
                                        id="dimensoes"
                                        type="text"
                                        placeholder="Digite as Dimensões"
                                        value={formData.dimensoes || ""}
                                        onChange={(e) => handleChange("dimensoes", e.target.value)} required/>
                                </div>
                                <div>
                                    <Label htmlFor="material" className="flex items-center">
                                        Material
                                    </Label>
                                    <TextInput
                                        id="material"
                                        type="text"
                                        placeholder="Digite o Material"
                                        value={formData.material || ""}
                                        onChange={(e) => handleChange("material", e.target.value)} required/>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <Button type="button" color="gray" onClick={() => navigate("/insumos/cadastro")}>
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
