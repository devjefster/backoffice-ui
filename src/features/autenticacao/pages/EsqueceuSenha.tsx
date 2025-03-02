import React, {useState} from "react";
import {sendResetPasswordEmail} from "../service/loginService";
import {useNavigate} from "react-router-dom";

const EsqueceuSenha: React.FC = () => {
    const [email, setEmail] = useState<string>(""); // Explicit typing
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!email.trim()) { // Added trim to handle whitespace
            setMessage("Por favor, insira seu email.");
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            await sendResetPasswordEmail(email);
            setMessage("Email de redefinição enviado com sucesso!");
        } catch (error: any) {
            setMessage(
                error?.response?.data?.message || "Erro ao enviar email. Tente novamente mais tarde."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-lg shadow-md p-8 w-11/12 max-w-md">
                <h2 className="text-2xl font-semibold text-primary text-center mb-6">Esqueceu a Senha</h2>
                <input
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {message && (
                    <p
                        className={`mt-4 text-center ${
                            message.includes("sucesso") ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {message}
                    </p>
                )}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                    >
                        Voltar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-4 py-2 text-white rounded-md transition ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-primary hover:bg-accent"
                        }`}
                    >
                        {loading ? "Enviando..." : "Enviar Email"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EsqueceuSenha;
