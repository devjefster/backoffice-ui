import React, {lazy, Suspense} from "react";
import {BrowserRouter as Router, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {AuthProvider} from "../utils/contexts/AuthContext";
import MainLayout from "../components/MainLayout";
import LoginPage from "../features/autenticacao/pages/LoginPage";
import EsqueceuSenha from "../features/autenticacao/pages/EsqueceuSenha";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loader from "../components/Loader";
import ClienteFormWrapper from "@features/autenticacao/pages/ClienteFormWrapper";
import Perfil from "@features/autenticacao/pages/Perfil";
import UsuarioList from "@features/autenticacao/pages/UsuarioList";
import UsuarioForm from "@features/autenticacao/pages/UsuarioForm";
import InsumoList from "@features/insumos/pages/InsumosList";
import InsumoForm from "@features/insumos/pages/InsumosForm";
import EntradaInsumosList from "@features/entrada_insumos/pages/EntradaInsumosList";
import EntradaInsumoFormWrapper from "@features/entrada_insumos/pages/EntradaInsumoFormWrapper";
import EstoqueList from "@features/estoque/pages/EstoqueList";
import EstoqueDetails from "@features/estoque/pages/EstoqueDetails";
import LoteEntradaDetails from "@features/entrada_insumos/pages/LoteEntradaDetails";
import MovimentacaoEstoque from "@features/estoque/pages/MovimentacaoEstoque";
import FormulaFabricacaoList from "@features/fabricacao/processos/pages/FormulaFabricacaoList";
import FormulaFabricacaoFormWrapper from "@features/fabricacao/processos/pages/FormulaFabricacaoFormWrapper";
import HomePage from "./HomePage"; // Assuming ClienteService is used to fetch cliente data

const FabricanteList = lazy(() => import("../features/fabricantes/pages/FabricanteList"));
const FabricanteForm = lazy(() => import("../features/fabricantes/pages/FabricanteForm"));
const FornecedorList = lazy(() => import("../features/fornecedores/pages/FornecedorList"));
const FornecedorForm = lazy(() => import("../features/fornecedores/pages/FornecedorForm"));
const ClienteList = lazy(() => import("../features/cliente/pages/ClienteList"));

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Suspense fallback={<Loader/>}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace/>}/>

                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/esqueceu-senha" element={<EsqueceuSenha/>}/>

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute/>}>
                            <Route element={<MainLayout/>}>
                                <Route path="/home" element={<HomePage/>}/>
                                <Route path="/fabricantes" element={<FabricanteList/>}/>
                                <Route path="/fabricantes/new" element={<FabricanteFormWrapper/>}/>
                                <Route path="/fabricantes/:id" element={<FabricanteFormWrapper/>}/>
                                <Route path="/fornecedores" element={<FornecedorList/>}/>
                                <Route path="/fornecedores/new" element={<FornecedorFormWrapper/>}/>
                                <Route path="/fornecedores/:id" element={<FornecedorFormWrapper/>}/>
                                <Route path="/clientes" element={<ClienteList/>}/>
                                <Route path="/clientes/:id" element={<ClienteFormWrapper/>}/>
                                <Route path="/perfil" element={<Perfil/>}/>
                                <Route path="/insumos/cadastro" element={<InsumoList/>}/>
                                <Route path="/insumos/:id" element={<InsumosFormWrapper/>}/>
                                <Route path="/insumos/new" element={<InsumosFormWrapper/>}/>
                                <Route path="/insumos/entrada" element={<EntradaInsumosList/>}/>
                                <Route path="/insumos/entrada/:id" element={<EntradaInsumoFormWrapper/>}/>
                                <Route path="/insumos/entrada/new" element={<EntradaInsumoFormWrapper/>}/>
                                <Route path="/usuarios" element={<UsuarioList/>}/>
                                <Route path="/usuarios/:id" element={<UsuarioFormWrapper/>}/>
                                <Route path="/insumos/estoque" element={<EstoqueList/>}/>
                                <Route path="/insumos/estoque/:id" element={<EstoqueDetails/>}/>
                                <Route path="/insumos/lote-entrada/:id" element={<LoteEntradaDetails/>}/>
                                <Route path="/insumos/estoque/:id/movimentacoes" element={<MovimentacaoEstoque/>}/>
                                <Route path="/formula-fabricacao" element={<FormulaFabricacaoList/>}/>
                                <Route path="/formula-fabricacao/:id" element={<FormulaFabricacaoFormWrapper/>}/>
                                <Route path="/formula-fabricacao/new" element={<FormulaFabricacaoFormWrapper/>}/>
                            </Route>
                        </Route>
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
};

function InsumosFormWrapper() {
    const navigate = useNavigate();
    const handleSave = () => navigate("/insumos");
    return <InsumoForm onSave={handleSave}/>;
}

function UsuarioFormWrapper() {
    const navigate = useNavigate();
    const handleSave = () => navigate("/usuarios");
    return <UsuarioForm onSave={handleSave}/>;
}

function FabricanteFormWrapper() {
    const navigate = useNavigate();
    const handleSave = () => navigate("/fabricantes");
    return <FabricanteForm onSave={handleSave}/>;
}

function FornecedorFormWrapper() {
    const navigate = useNavigate();
    const handleSave = () => navigate("/fornecedores");
    return <FornecedorForm onSave={handleSave}/>;
}

export default App;
