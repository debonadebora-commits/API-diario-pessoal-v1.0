import usuarios from "../../dados/usuarios.js"

function autenticar(req, res, next) {

    const { nome } = req.query
    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).json({message: "Token não enviado", data: Date.now()});
    }

    const token = authorization.split(" ")[1];

    const usuarioEncontrado = usuarios.find(
        usuario => usuario.nome === nome && usuario.token == token)

    if (!usuarioEncontrado) {
        return res.status(401).json({message: "Não autenticado.", data: Date.now()})
    }

    req.usuario = usuarioEncontrado

    next()
}
export default autenticar