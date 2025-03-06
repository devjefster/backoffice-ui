import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../service/loginService";
import {useAuth} from "@utils/contexts/AuthContext";
import avatar1 from "@assets/images/avatar/avatar1.png";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Load saved data and token
    useEffect(() => {
        const savedUsername = localStorage.getItem("username");
        const savedPhoto = localStorage.getItem("profilePhoto");
        const token = localStorage.getItem("token");

        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }

        if (savedPhoto) {
            setProfilePhoto(savedPhoto);
        }

        if (token) {
            login(token);
            navigate("/fabricantes");
        }
    }, [login, navigate]);

    const handleLogin = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            const token = await loginUser(username, password);
            login(token.token); // Save authenticated state in context
            localStorage.setItem("token", token.token);
            if (rememberMe) {
                localStorage.setItem("username", username);
                localStorage.setItem("profilePhoto", profilePhoto || "");
            } else {
                localStorage.removeItem("username");
                localStorage.removeItem("token");
                localStorage.removeItem("profilePhoto");
            }

            navigate("/home"); // Navigate to a protected route
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message || "Erro ao efetuar login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white rounded-lg shadow-md p-8 w-11/12 max-w-md">
                <h2 className="text-2xl font-bold text-primary text-center mb-4">Bem Vindo</h2>

                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300">
                        <img
                            src={profilePhoto || avatar1}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring focus:border-primary"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring focus:border-primary"
                />
                {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

                <div className="flex justify-between items-center mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="mr-2"
                        />
                        <span className="text-gray-700">Lembrar-me</span>
                    </label>
                    <button
                        onClick={() => navigate("/esqueceu-senha")}
                        className="text-primary text-sm font-bold"
                    >
                        Esqueceu a senha?
                    </button>
                </div>

                <button
                    onClick={handleLogin}
                    className={`w-full bg-primary text-white py-2 rounded ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
