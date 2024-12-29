import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClienteService from "../../cliente/service/ClienteService";
import {Cliente} from "../../cliente/model/Cliente";
import Loader from "@components/Loader";
import ClienteForm from "../../cliente/pages/ClienteForm";

const ClienteFormWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            ClienteService.buscarPorId(parseInt(id, 10))
                .then((response) => {
                    setCliente(response.data);
                })
                .catch((error) => {
                    console.error("Failed to fetch cliente:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [id]);

    if (isLoading) {
        return <Loader />;
    }

    if (!cliente) {
        return <div className="text-center text-red-500">Cliente não encontrado.</div>;
    }

    return <ClienteForm cliente={cliente} />;
};

export default ClienteFormWrapper;
