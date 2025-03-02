import React, {useEffect, useState} from "react";
import {Button, Label, TableCell, TextInput} from "flowbite-react";
import {HiCheckCircle, HiOutlinePlus, HiTrash} from "react-icons/hi";
import {EntradaInsumoItemDTO, EntradaInsumosDTO} from "@features/entrada_insumos/model/EntradaInsumos";
import TypeAhead from "@components/inputs/TypeAhead";
import InsumoService from "@features/insumos/service/InsumoService";
import PessoaService from "@features/pessoa/service/PessoaService";
import {useNavigate} from "react-router-dom";
import DataTable from "@components/table/DataTable";
import DinheiroInput from "@components/inputs/DinheiroInput";
import TituloPagina from "@components/comum/TituloPagina";
import {Enum} from "../../../model/Comum";
import Seletor from "@components/comum/Seletor";

const EntradaInsumosForm: React.FC<{
    entradaInsumo?: EntradaInsumosDTO | null;
    onSave: (formData: EntradaInsumosDTO) => void
}> = ({entradaInsumo, onSave}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [unidadeMedidaOptions, setUnidadeMedidaOptions] = useState<Enum[]>([]);
    const [formData, setFormData] = useState<EntradaInsumosDTO>({
        id: 0,
        fornecedor: null,
        dataEntrada: new Date().toISOString().split("T")[0],
        custoFrete: 0,
        custoOutros: 0,
        itens: [],
    });
    const [novoItem, setNovoItem] = useState<Partial<EntradaInsumoItemDTO>>({
        quantidade: 0,
        precoUnitario: 0,
        unidadeMedidaEntrada: null,
        validade: null,
        custoTotal: 0,
    });
    const fetchEnums = async () => {
        try {
            const unidadesResponse = await InsumoService.obterUnidadeMedida();
            setUnidadeMedidaOptions(unidadesResponse);
        } catch (error) {
            console.error("Erro ao carregar valores:", error);
        }
    };
    useEffect(() => {
        if (entradaInsumo) setFormData(entradaInsumo);
        fetchEnums();
    }, [entradaInsumo]);


    const handleNovoItemChange = (key: string, value: any) => {
        setNovoItem((prev) => ({...prev, [key]: value}));
    };
    const addItem = () => {
        if (!novoItem.insumo || !novoItem.fabricante || !novoItem.quantidade || !novoItem.precoUnitario || !novoItem.unidadeMedidaEntrada) {
            alert("Todos os campos são obrigatórios, exceto a validade.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            itens: [...prev.itens, {...novoItem} as EntradaInsumoItemDTO],
        }));

        // Resetar o novo item
        setNovoItem({
            quantidade: 0,
            precoUnitario: 0,
            unidadeMedidaEntrada: null,
            validade: null,
            custoTotal: 0,
        });
    };

// Função para converter uma string formatada em número
    const parseCurrency = (value: string) => {
        return Number(value.replace(/[^\d,-]/g, "").replace(",", "."));
    };
    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({...prev, [key]: value}));
        custoTotal();
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fornecedor || !formData.dataEntrada) {
            alert("Fornecedor e Data de Entrada são obrigatórios.");
            return;
        }
        onSave(formData);
        navigate("/entrada-insumos");
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
    const handleEnumChange = (key: string, value: any) => {
        setNovoItem((prev) => ({
            ...prev,
            [key]: value === "" ? null : value // Se for vazio, define como null
        }));
    };

    const custoTotal = () => {
        let custoTotal = 0;
        custoTotal += formData.custoOutros;
        custoTotal += formData.custoFrete;
        formData.itens.forEach(item => {
            custoTotal += item.precoUnitario * item.quantidade;
        })
        return custoTotal;
    }
    const removeItem = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            itens: prev.itens.filter((_, i) => i !== index),
        }));
    };

    // @ts-ignore
    return (
        <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-white shadow-lg rounded-lg">
            <TituloPagina titulo={"Entrada de Insumos"} subTitulo={"Formulário"} navigate={navigate}
                          url={"/entrada-insumos"}/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="fornecedor" className="text-gray-700 font-semibold">Fornecedor *</Label>
                    <TypeAhead fetchOptions={(query) => fetchPaginatedList(PessoaService.listarComFiltros, query)}
                               onSelect={(selected) => handleChange("fornecedor", selected)}
                               placeholder="Selecione o fornecedor"/>
                </div>
                <div>
                    <Label htmlFor="dataEntrada" className="text-gray-700 font-semibold">Data de Entrada *</Label>
                    <TextInput id="dataEntrada" type="date" value={formData.dataEntrada}
                               onChange={(e) => handleChange("dataEntrada", e.target.value)} className="rounded-md"/>
                </div>
                <div>
                    <Label htmlFor="custoFrete" className="text-gray-700 font-semibold">Custo Frete</Label>
                    <DinheiroInput
                        value={formData.custoFrete.toString()}
                        onChange={(value) => handleChange("custoFrete", parseFloat(value))}
                        placeholder="Custo Frete"
                    />
                </div>

                <div>
                    <Label htmlFor="custoOutros" className="text-gray-700 font-semibold">Custo Outros</Label>
                    <DinheiroInput
                        value={formData.custoOutros.toString()}
                        onChange={(value) => handleChange("custoOutros", parseFloat(value))}
                        placeholder="Custo Outros"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Itens</h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-4">
                    <TypeAhead
                        fetchOptions={(query) => fetchPaginatedList(InsumoService.listarComFiltros, query)}
                        onSelect={(selected) => handleNovoItemChange("insumo", selected)}
                        placeholder="Selecione o insumo"
                    />
                    <TypeAhead
                        fetchOptions={(query) => fetchPaginatedList(PessoaService.listarComFiltros, query)}
                        onSelect={(selected) => handleNovoItemChange("fabricante", selected)}
                        placeholder="Selecione o fabricante"
                    />
                    <TextInput
                        type="number"
                        placeholder="Quantidade"
                        value={novoItem.quantidade || ""}
                        onChange={(e) => handleNovoItemChange("quantidade", parseFloat(e.target.value))}
                    />
                    <DinheiroInput
                        value={(novoItem.precoUnitario ?? 0).toString()}
                        onChange={(value) => handleNovoItemChange("precoUnitario", parseCurrency(value))}
                        placeholder="Custo Outros"
                    />
                    <Seletor
                        enums={unidadeMedidaOptions}
                        value={novoItem.unidadeMedidaEntrada}
                        placeholder="Selecione a Unidade de Medida"
                        onChange={(e) => handleEnumChange("unidadeMedida", e)}
                    />
                    <Button gradientDuoTone="greenToBlue" onClick={addItem}>
                        <HiOutlinePlus className="mr-2"/>
                        Adicionar Item
                    </Button>
                </div>
                <div className="grid">
                    <DataTable
                        data={formData.itens}
                        headers={[
                            {key: "insumo", label: "Insumo"},
                            {key: "fabricante", label: "Fabricante"},
                            {key: "precoUnitario", label: "Preço Unitário"},
                            {key: "precoTotal", label: "Preço Total"},
                            {key: "acoes", label: "Ações"},
                        ]}
                        renderRow={(item, index) => (
                            <>
                                <TableCell>{item.insumo.nome}</TableCell>
                                <TableCell>{item.fabricante.nomeFantasia}%</TableCell>
                                <TableCell>{formatCurrency(item.precoUnitario)}</TableCell>
                                <TableCell>{item.unidadeMedidaEntrada}</TableCell>
                                <TableCell>{formatCurrency(item.precoUnitario * item.quantidade)}</TableCell>
                                <TableCell>
                                    <Button color="failure" size="sm" onClick={() => removeItem(index)}>
                                        <HiTrash className="w-5 h-5"/>
                                    </Button>
                                </TableCell>
                            </>
                        )}
                        emptyMessage="Nenhum item adicionado."
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <TextInput
                    type="text"
                    readOnly
                    placeholder="Custo Total"
                    value={formatCurrency(custoTotal())}
                    onChange={(e) => handleNovoItemChange("precoUnitario", parseCurrency(e.target.value))}
                />
            </div>
            <div className="flex justify-end gap-4">
                <Button type="submit" gradientDuoTone="greenToBlue" disabled={isSubmitting}>
                    <HiCheckCircle className="mr-2"/>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
            </div>
        </form>
    );
};

export default EntradaInsumosForm;
