import pool from "../../database.js";

async function autenticar(req, res, next) {

    const { nome } = req.query;
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: "Token não enviado."
        });
    }

    const token = authorization.split(" ")[1];

    const resultado = await pool.query(
        `
        SELECT *
        FROM usuarios
        WHERE nome ILIKE $1
        AND token = $2
        `,
        [nome, token]
    );

    if (resultado.rows.length === 0) {
        return res.status(401).json({
            message: "Não autenticado."
        });
    }

    req.usuario = resultado.rows[0];

    next();
}

export default autenticar;