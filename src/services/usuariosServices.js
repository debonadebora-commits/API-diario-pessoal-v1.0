import { buscarPorNome, criar } from "../repository/usuariosRepository.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export async function cadastro (usuario){
    const { nome, senha } = usuario

    if (!nome || !senha) 
        return null

    const existente = await buscarPorNome(nome);

    if (existente.rows.length > 0) {
        return null;
    }

    const senhaHash = await bcrypt.hash(
        senha,
        10
    );

    await criar (nome, senhaHash)

    return ({message:'criado com sucesso', data: Date.now()})
}

export async function autentica (usuario){
    const { nome, senha } = usuario
    if (!nome || !senha) 
        return null

    const usuarioEncontrado = await buscarPorNome(nome)

    if (usuarioEncontrado.rows.length === 0) {
        return null
    }

    const user = usuarioEncontrado.rows[0];

    const senhaCorreta = await bcrypt.compare(
            senha,
            user.senha
        );
    
    
    if (!senhaCorreta) 
        return null
    
    const token = jwt.sign(
        {
            id: user.id,
            nome: user.nome
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return (
        {message: "autenticação concluída.",
        usuario: user.nome,
        token,
        data: Date.now()}
    )
}