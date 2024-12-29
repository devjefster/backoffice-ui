import { faCogs, faHome, faIndustry, faList, faTruck, faUser } from "@fortawesome/free-solid-svg-icons";

export const itensMenu = [
    { path: "/home", label: "Home", icon: faHome },
    {
        label: "Insumos",
        icon: faList,
        submenu: [
            { path: "/insumos/cadastro", label: "Cadastro" },
            { path: "/insumos/entrada", label: "Entrada" },
            { path: "/insumos/estoque", label: "Estoque" },
        ],
    },
    { path: "/formula-fabricacao", label: "Fabricação", icon: faIndustry },
    { path: "/fabricantes", label: "Fabricantes", icon: faIndustry },
    { path: "/fornecedores", label: "Fornecedores", icon: faTruck },

    { path: "/configuracoes", label: "Configurações", icon: faCogs },
];
