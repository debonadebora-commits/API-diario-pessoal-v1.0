let contador = 0
function logger(req, res, next)
{
    const inicio = Date.now()

    res.on('finish', () => {
        const tempo = Date.now() - inicio
    

    contador++
    console.log(`[${new Date().toLocaleString()}]#${contador} ${req.method} ${req.url} - ${tempo}ms`)
    })
    
    next()
}

export default logger