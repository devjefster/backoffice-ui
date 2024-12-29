import React, { ReactElement } from "react";
import { Button } from "flowbite-react";
import { HiArrowLeft } from "react-icons/hi";
import { NavigateFunction } from "react-router-dom";

interface TituloPaginaProps {
    titulo: string;
    subTitulo?: string;
    navigate?: NavigateFunction;
    url?: string;
}

const TituloPagina: React.FC<TituloPaginaProps> = ({ titulo, subTitulo, navigate, url }) => {
    const subtituloSection = (): ReactElement | null => {
        if (subTitulo) {
            return (
                <span className="bg-pink-200 text-pink-800 text-xl font-medium px-3 py-1 rounded-full ms-3">
                    {subTitulo}
                </span>
            );
        }
        return null;
    };

    const voltarFunction = (): ReactElement | null => {
        if (navigate && url) {
            return (
                <Button
                    color="light"
                    onClick={() => navigate(url)}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                    <HiArrowLeft className="w-5 h-5" />
                    Voltar
                </Button>
            );
        }
        return null;
    };

    return (
        <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
                <h2 className="text-4xl font-extrabold text-gray-800 flex items-center">
                    {titulo}
                    {subtituloSection()}
                </h2>
            </div>
            <div className="ml-auto">{voltarFunction()}</div>
        </div>
    );
};

export default TituloPagina;
