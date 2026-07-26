import pool from "../database.js";

export async function buscarTodos (config) {

    const {
        where,
        valores,
        limite,
        offset
    } = config

    const sqlDados = `
        SELECT 
        entradas.id,
        entradas.corpo,
        entradas.humor,
        entradas.data_entrada,
        entradas.usuario_id,
        usuarios.nome
        FROM entradas
        JOIN usuarios ON usuario_id = usuarios.id
        ${where}
        ORDER BY usuarios.id
        LIMIT $${valores.length + 1}
        OFFSET $${valores.length + 2}
    `;

    const valoresDados = [
        ...valores,
        limite,
        offset
    ];

    const sqlTotal = `
        SELECT COUNT(*) AS total
    FROM entradas
    JOIN usuarios ON usuario_id = usuarios.id
    ${where}
    `;

    const [dados, total] = await Promise.all([
        pool.query(sqlDados, valoresDados),
        pool.query(sqlTotal, valores)
    ]);

    return {dados,total}
}

export async function buscarPorId (usuarioId,id) {
    const resultado = await pool.query(
        `
        SELECT * FROM entradas
        WHERE id = $1 
        AND usuario_id = $2
        `,
        [id,usuarioId]
    )

    return resultado
}

export async function criar (data, corpo, humor, usuarioId) {
    await pool.query(
        `
        INSERT INTO entradas (data_entrada, corpo, humor, usuario_id)
        VALUES ($1,$2,$3,$4)
        `,
        [data,corpo,humor,usuarioId]
    );

}

export async function atualizar (usuarioId,id,atualizacao,anotacao){
    await pool.query(
        `
        UPDATE entradas
        SET 
            data_entrada = $1,
            corpo = $2,
            humor = $3
        WHERE id = $4
        AND usuario_id = $5
        `,
        [
            atualizacao.data ?? anotacao.data_entrada,
            atualizacao.corpo ?? anotacao.corpo,
            atualizacao.humor ?? anotacao.humor,
            id,
            usuarioId
        ]
    )
}

export async function deletar (usuarioId, id) {
    await pool.query (
        `
        DELETE FROM entradas
        WHERE id = $1
        AND usuario_id = $2
        `,
        [id, usuarioId]
    )
}