import pool from "../database.js";

export async function criar (nome, senha){
    await pool.query(
    `
        INSERT INTO usuarios(nome, senha)
        VALUES($1, $2)
    `,
    [
        nome,
        senha
    ])
}

export async function buscarPorNome (nome){
    const usuarioEncontrado = await pool.query(
        `
        SELECT *
        FROM usuarios
        WHERE nome = $1
        `,
        [nome]
    );
    return usuarioEncontrado
}