import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()


function autenticar(req, res, next) {

    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: "Token não enviado."
        });
    }

    const token = authorization.split(" ")[1];
    try {

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = usuario;
        next();

    } catch (erro) {

        return res.status(401).json({
            message: "Token inválido ou expirado."
        });
    }
}


export default autenticar;