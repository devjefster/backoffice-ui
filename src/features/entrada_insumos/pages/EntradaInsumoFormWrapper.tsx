import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import EntradaInsumosService from "@features/entrada_insumos/service/EntradaInsumosService";
import Loader from "@components/Loader";
import { EntradaInsumosDTO } from "@features/entrada_insumos/model/EntradaInsumos";
import EntradaInsumosForm from "@features/entrada_insumos/pages/EntradaInsumosForm";

const EntradaInsumoFormWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [entradaInsumo, setEntradaInsumo] = React.useState<EntradaInsumosDTO | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (id) {
            EntradaInsumosService.buscarPorId(parseInt(id, 10))
                .then((response) => setEntradaInsumo(response || null))
                .catch((error) => console.error("Error fetching EntradaInsumo:", error))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [id]);

    const handleSave = () => {
        navigate("/insumos/entrada");
    };

    if (isLoading) {
        return <Loader />;
    }

    if (id && !entradaInsumo) {
        return <div className="text-center text-red-500">Entrada de Insumos não encontrada.</div>;
    }

    return <EntradaInsumosForm entradaInsumo={entradaInsumo} onSave={handleSave} />;
};

export default EntradaInsumoFormWrapper;
