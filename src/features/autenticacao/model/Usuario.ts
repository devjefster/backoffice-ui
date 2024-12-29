export interface CriarUsuario extends Usuario{
    fotoPerfil?: File; // Already optional
    password?: string; // Make this optional
}

export interface AtualizarUsuario extends Usuario {
    novaSenha?: string; // Already optional
    fotoPerfil?: File; // Already optional
    password?: string; // Make this optional
}

export interface Usuario {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    instagramUser?: string;
    tiktokUser?: string;
    fotoUsuarioId?: number;
    loginId?: number;
    login?: Login;
}

export interface Login {
    id: number;
    username: string;
    password: string;
    role: RoleEnum;
    authorities: Array<RoleEnum>; // Corresponds to GrantedAuthority
}

export interface Token {
    id: number;
    token: string;
}

export enum RoleEnum {
    USUARIO, USUARIO_PREMIUM, ADMIN, DONO
}