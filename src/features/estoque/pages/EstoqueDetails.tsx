import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Loader from "@components/Loader";
import {Table, TableBody, TableCell, TableHead, TableRow} from "flowbite-react";
import EstoqueService from "@features/estoque/service/EstoqueService";
import {formatarData} from "@utils/formatarData";
import {EstoqueDTO, LoteEstoqueDTO} from "@features/estoque/model/Estoque";

const EstoqueDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [estoque, setEstoque] = useState<EstoqueDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            EstoqueService.buscarPorId(parseInt(id, 10))
                .then((response) => setEstoque(response.data || null))
                .catch((error) => console.error("Erro ao buscar o estoque:", error))
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    if (isLoading) return <Loader/>;
    if (!estoque) return <div className="text-center text-red-500">Estoque não encontrado.</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Detalhes do Estoque</h1>
                <div className="mb-6">
                    <p><strong>Produto:</strong> {estoque.insumo ? estoque.insumo?.nome : estoque.produto.nome}</p>
                    <p><strong>UnidadeMedida:</strong> {estoque.unidadeMedida}</p>
                    <p><strong>Quantidade Total:</strong> {estoque.quantidade}</p>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">Lotes</h2>
                {estoque.lotes && estoque.lotes.length > 0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Unidade de Medida</TableCell>
                                <TableCell>Validade</TableCell>
                                <TableCell>Custo Unitário</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {estoque.lotes.map((lote: LoteEstoqueDTO) => (
                                <TableRow key={lote.id} className="hover:bg-gray-100">
                                    <TableCell>{lote.id}</TableCell>
                                    <TableCell>{lote.quantidade}</TableCell>
                                    <TableCell>{lote.unidadeMedida}</TableCell>
                                    <TableCell>{formatarData(lote.validade)}</TableCell>
                                    <TableCell>R$ {lote.custoUnitario.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-gray-500">Nenhum lote encontrado para este estoque.</p>
                )}
            </div>
        </div>
    );
};

export default EstoqueDetails;
