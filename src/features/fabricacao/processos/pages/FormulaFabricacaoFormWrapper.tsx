import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import Loader from "@components/Loader";
import FormulaFabricacaoService from "@features/fabricacao/processos/service/FormulaFabricacaoService";
import {FormulaFabricacaoDTO} from "@features/fabricacao/processos/model/FormulaFabricacao";
import FormulaFabricacaoForm from "@features/fabricacao/processos/pages/FormulaFabricacaoForm";

const FormulaFabricacaoFormWrapper: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formulaFabricacao, setFormulaFabricacao] = React.useState<FormulaFabricacaoDTO | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (id) {
            FormulaFabricacaoService.buscarPorId(parseInt(id, 10))
                .then((response) => setFormulaFabricacao(response || null))
                .catch((error) => console.error("Erro ao buscar Fórmula de Fabricação:", error))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [id]);

    const handleSave = () => {
        navigate("/formula-fabricacao");
    };

    if (isLoading) {
        return <Loader/>;
    }

    if (id && !formulaFabricacao) {
        return <div className="text-center text-red-500">Fórmula de Fabricação não encontrada.</div>;
    }

    return <FormulaFabricacaoForm formula={formulaFabricacao} onSave={handleSave}/>;
};

export default FormulaFabricacaoFormWrapper;
