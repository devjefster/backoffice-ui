import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Loader from "@components/Loader";
import InsumoService from "@features/insumos/service/InsumoService";
import InsumosForm from "@features/insumos/pages/InsumosForm";
import {InsumoDTO} from "@features/insumos/model/Insumo";

const InsumoWrapper: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [insumos, setInsumos] = useState<InsumoDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            InsumoService.buscarPorId(parseInt(id, 10))
                .then((response) => {
                    if (response) {
                        setInsumos(response.data);
                    }

                })
                .catch((error) => {
                    console.error("Failed to fetch insumo:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [id]);
    const handleSave = () => {
        navigate("/insumos/cadastros");
    };

    if (isLoading) {
        return <Loader/>;
    }

    if (id && !insumos) {
        return <div className="text-center text-red-500">Entrada de Insumos não encontrada.</div>;
    }

    if (!insumos) {
        return <div className="text-center text-red-500">Insumo não encontrado.</div>;
    }

    return <InsumosForm insumo={insumos} onSave={handleSave}/>;
};

export default InsumoWrapper;
