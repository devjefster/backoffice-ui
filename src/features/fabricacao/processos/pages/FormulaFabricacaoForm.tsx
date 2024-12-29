import React, {useCallback, useEffect, useState} from "react";
import {Button, Label, TableCell, TextInput} from "flowbite-react";
import {HiArrowLeft, HiCheckCircle, HiOutlinePlus, HiTrash, HiXCircle} from "react-icons/hi";
import {CriarFormulaFabricacaoRequest, FormulaFabricacaoDTO, ProcessoFabricacaoDTO} from "../model/FormulaFabricacao";
import {useNavigate} from "react-router-dom";
import TypeAhead from "@components/inputs/TypeAhead";
import DataTable from "@components/table/DataTable";
import InsumoService from "@features/insumos/service/InsumoService";

const FormulaFabricacaoForm: React.FC<{
    formula?: FormulaFabricacaoDTO | null;
    onSave: (formData: FormulaFabricacaoDTO) => void
}> = ({formula, onSave}) => {
    const [formData, setFormData] = useState<CriarFormulaFabricacaoRequest>({
        produtoId: 0,
        nome: "",
        descricao: "",
        processosFabricacao: [],
        volumeTotal: 0,
    });

    const [novoProcesso, setNovoProcesso] = useState<Partial<ProcessoFabricacaoDTO>>({
        insumoId: 0,
        porcentagem: 0,
        tipoProcesso: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (formula) {
            setFormData({
                produtoId: formula.produtoId,
                nome: formula.nome || "",
                descricao: formula.descricao || "",
                processosFabricacao: formula.processosFabricacao,
                volumeTotal: formula.processosFabricacao.reduce((sum, proc) => sum + proc.porcentagem, 0),
            });
        }
    }, [formula]);

    const handleChange = useCallback((key: keyof CriarFormulaFabricacaoRequest, value: any) => {
        setFormData((prev) => ({...prev, [key]: value}));
    }, []);

    const handleNovoProcessoChange = (key: keyof ProcessoFabricacaoDTO, value: any) => {
        setNovoProcesso((prev) => ({...prev, [key]: value}));
    };

    const adicionarProcesso = () => {
        if (novoProcesso.insumoId && novoProcesso.porcentagem && novoProcesso.tipoProcesso) {
            setFormData((prev) => ({
                ...prev,
                processosFabricacao: [...prev.processosFabricacao, novoProcesso as ProcessoFabricacaoDTO],
            }));
            setNovoProcesso({insumoId: 0, porcentagem: 0, tipoProcesso: ""});
        } else {
            alert("Preencha todos os campos do processo antes de adicionar.");
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
        <form className="space-y-8 p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center">
                <h2 className="text-4xl font-extrabold text-pink-600">Fórmula de Fabricação</h2>
                <Button color="gray" onClick={() => navigate("/formula-fabricacao")}
                        className="flex items-center gap-2">
                    <HiArrowLeft className="w-5 h-5"/>
                    Voltar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="nome" className="text-gray-700 font-semibold">Nome da Fórmula</Label>
                    <TextInput id="nome" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)}
                               required className="rounded-md"/>
                </div>
                <div>
                    <Label htmlFor="descricao" className="text-gray-700 font-semibold">Descrição</Label>
                    <TextInput id="descricao" value={formData.descricao}
                               onChange={(e) => handleChange("descricao", e.target.value)} className="rounded-md"/>
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Adicionar Processo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <TypeAhead
                        fetchOptions={(query) => fetchPaginatedList(InsumoService.listarComFiltros, query)}
                        onSelect={(insumo) => handleNovoProcessoChange("insumoId", insumo.id)}
                        placeholder="Buscar Insumo"
                    />
                    <TextInput type="number" placeholder="Porcentagem" value={novoProcesso.porcentagem || ""}
                               onChange={(e) => handleNovoProcessoChange("porcentagem", parseFloat(e.target.value))}
                               className="rounded-md"/>
                    <Button type="button" onClick={adicionarProcesso} gradientDuoTone="greenToBlue" >
                        <HiOutlinePlus className="mr-2"/>
                        Adicionar Processo
                    </Button>
                </div>
            </div>

            <DataTable
                data={formData.processosFabricacao}
                headers={[
                    {key: "insumoId", label: "ID do Insumo"},
                    {key: "porcentagem", label: "Porcentagem"},
                    {key: "tipoProcesso", label: "Tipo de Processo"},
                    {key: "acoes", label: "Ações"},
                ]}
                renderRow={(processo) => (
                    <>
                        <TableCell>{processo.insumoId}</TableCell>
                        <TableCell>{processo.porcentagem}%</TableCell>
                        <TableCell>{processo.tipoProcesso}</TableCell>
                        <TableCell>
                            <Button color="failure" size="sm" onClick={() => console.log("Remover")}>
                                <HiTrash className="w-5 h-5"/>
                            </Button>
                        </TableCell>
                    </>
                )}
                emptyMessage="Nenhum processo adicionado."
            />

            <div className="flex justify-end gap-4">
                <Button type="button" color="gray" className="rounded-md">
                    <HiXCircle className="mr-2"/>
                    Cancelar
                </Button>
                <Button type="submit" gradientDuoTone="greenToBlue" className="rounded-md">
                    <HiCheckCircle className="mr-2"/>
                    Salvar
                </Button>
            </div>
        </form>
    );
};

export default FormulaFabricacaoForm;
