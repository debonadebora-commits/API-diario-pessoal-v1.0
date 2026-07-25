import autenticar from "./autenticar.js"

let contador = 0
function logger(req, res, next)
{
    const inicio = Date.now()

    res.on('finish', () => {
        const tempo = Date.now() - inicio
        const status = res.statusCode
        const usuario = req.usuario.id ?? 'anonimo'

    contador++
    console.log(`[${new Date().toLocaleString()}]#${contador} 
     ${req.method} ${req.url}
     usuario: ${usuario} 
     status: ${status} 
     ${tempo}ms`)
    })
    
    next()
}

export default logger