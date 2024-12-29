import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {LoteEntradaDTO} from "@features/entrada_insumos/model/EntradaInsumos";
import Loader from "@components/Loader";
import {Table, TableBody, TableCell, TableHead, TableRow} from "flowbite-react";
import {formatarData} from "@utils/formatarData";
import LoteEntradaInsumosService from "@features/entrada_insumos/service/LoteEntradaInsumosService";
import TituloPagina from "@components/comum/TituloPagina";

const LoteEntradaDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [lote, setLote] = useState<LoteEntradaDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            LoteEntradaInsumosService.buscarPorId(parseInt(id, 10))
                .then((response) => setLote(response || null))
                .catch((error) => console.error("Error fetching Lote entrada:", error))
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    if (isLoading) return <Loader/>;
    if (!lote) return <div className="text-center text-red-500">Lote de Entrada não encontrado.</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <TituloPagina titulo={"Lote de Entrada"} navigate={navigate}
                          url={"/entrada-insumos"}/>
            <div className="bg-white shadow rounded-lg p-6">

                {/* Lote Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p><strong>ID do Lote:</strong> {lote.id || "N/A"}</p>
                        <p><strong>Quantidade Convertida:</strong> {lote.quantidadeConvertida}</p>
                        <p><strong>Unidade de Medida:</strong> {lote.unidadeMedida}</p>
                    </div>
                    <div>
                        <p><strong>Validade:</strong> {formatarData(lote.validade)}</p>
                    </div>
                </div>

                {/* Grades Section */}
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Grades</h2>
                {lote.grades && lote.grades.length > 0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Descrição</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lote.grades.map((grade) => (
                                <TableRow key={grade.id} className="hover:bg-gray-100">
                                    <TableCell>{grade.id}</TableCell>
                                    <TableCell>{grade.nome}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-gray-500">Nenhuma grade associada a este lote.</p>
                )}
            </div>
        </div>
    );
};

export default LoteEntradaDetails;
