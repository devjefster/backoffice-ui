import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Loader from "@components/Loader";
import {Table, TableBody, TableCell, TableHead, TableRow} from "flowbite-react";
import EstoqueService from "@features/estoque/service/EstoqueService";
import {MovimentacaoEstoqueDTO} from "@features/estoque/model/Estoque";

const MovimentacaoEstoque: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoqueDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            EstoqueService.listarMovimentacoesEstoques(parseInt(id, 10))
                .then((response) => setMovimentacoes(response?.content || []))
                .catch((error) => console.error("Erro ao buscar movimentações:", error))
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    if (isLoading) return <Loader/>;
    if (movimentacoes.length === 0)
        return <div className="text-center text-gray-500">Nenhuma movimentação encontrada.</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Movimentações de Estoque</h1>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Lote</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Data</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movimentacoes.map((mov) => (
                            <TableRow key={mov.id} className="hover:bg-gray-100">
                                <TableCell>{mov.id}</TableCell>
                                <TableCell>{mov.loteEstoque.id}</TableCell>
                                <TableCell>{mov.tipo}</TableCell>
                                <TableCell>{mov.quantidade}</TableCell>
                                <TableCell>{new Date(mov.dataMovimentacao).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MovimentacaoEstoque;
