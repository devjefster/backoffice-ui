export interface Contato{
    id:number,
    tipo:TipoContato,
    telefone:string,
    isWhatsapp:boolean,
    isTelegram:boolean,
    email:string,
    observacoes:string

}
export enum TipoContato{
    VENDEDOR, DONO, REPRESENTANTE, SOCIO, DIVULGADIR
}