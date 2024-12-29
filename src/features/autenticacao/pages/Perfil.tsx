import React, { useEffect, useState, useRef } from "react";
import { atualizarUsuario, buscarUsuarioPeloId } from "../service/userService";
import { Usuario, AtualizarUsuario } from "../model/Usuario";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Tooltip } from "flowbite-react";
import EmailInput from "@components/inputs/EmailInput";
import TelefoneInput from "@components/inputs/TelefoneInput";
import { HiOutlineInformationCircle } from "react-icons/hi";

const Perfil: React.FC = () => {
    const [userData, setUserData] = useState<Usuario>({
        id: 0,
        nome: "",
        telefone: "",
        email: "",
        instagramUser: "",
        tiktokUser: "",
        fotoUsuarioId: undefined,
    });
    const [newPassword, setNewPassword] = useState<string>("");
    const [passwordVerification, setPasswordVerification] = useState<string>("");
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userId = Number(localStorage.getItem("userId"));
                if (!userId) {
                    navigate("/login");
                    return;
                }
                const data = await buscarUsuarioPeloId(userId);
                setUserData(data);
            } catch (error) {
                console.error("Erro ao buscar informações do usuário:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            setProfilePhoto(event.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (newPassword && newPassword !== passwordVerification) {
            alert("As senhas não coincidem.");
            return;
        }

        setLoading(true);
        try {
            const updatedData: AtualizarUsuario = {
                ...userData,
                novaSenha: newPassword || undefined,
                fotoPerfil: profilePhoto || undefined,
            };

            await atualizarUsuario(userData.id, updatedData);
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Erro ao atualizar perfil.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-50 min-h-screen py-10">
            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-3xl">
                <h2 className="text-4xl font-extrabold text-primary mb-6">Perfil</h2>

                {/* Profile Picture */}
                <div className="flex justify-center mb-8">
                    <label
                        htmlFor="profilePhotoInput"
                        className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer"
                    >
                        {profilePhoto ? (
                            <img
                                src={URL.createObjectURL(profilePhoto)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : userData.fotoUsuarioId ? (
                            <img
                                src={`/api/foto/${userData.fotoUsuarioId}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Adicionar Foto</span>
                            </div>
                        )}
                    </label>
                    <input
                        id="profilePhotoInput"
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                    />
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            Nome
                            <Tooltip content="Nome completo do usuário">
                                <HiOutlineInformationCircle className="ml-2 text-gray-500 cursor-pointer" />
                            </Tooltip>
                        </label>
                        <input
                            type="text"
                            value={userData.nome}
                            onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                            placeholder="Nome"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <EmailInput
                        value={userData.email}
                        onChange={(value) => setUserData({ ...userData, email: value })}
                        label="E-mail"
                        required
                    />

                    {/* Telefone */}
                    <TelefoneInput
                        value={userData.telefone || ""}
                        onChange={(value) => setUserData({ ...userData, telefone: value })}
                        label="Telefone"
                        required
                    />

                    {/* Nova Senha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            Nova Senha
                            <Tooltip content="Crie uma nova senha se necessário">
                                <HiOutlineInformationCircle className="ml-2 text-gray-500 cursor-pointer" />
                            </Tooltip>
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nova Senha"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Repetir Senha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                            Repetir Senha
                            <Tooltip content="Digite novamente a nova senha">
                                <HiOutlineInformationCircle className="ml-2 text-gray-500 cursor-pointer" />
                            </Tooltip>
                        </label>
                        <input
                            type="password"
                            value={passwordVerification}
                            onChange={(e) => setPasswordVerification(e.target.value)}
                            placeholder="Repetir Senha"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="mt-6 w-full flex justify-center items-center"
                >
                    {loading ? <Spinner size="sm" light /> : "Salvar Alterações"}
                </Button>
            </div>
        </div>
    );
};

export default Perfil;
