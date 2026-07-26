import { Router } from 'express'
import autenticar from '../middleware/autenticar.js';
import { 
        acessarAnotacoes, 
        acessarAnotacoesPorID, 
        atualizarAnotacoes, 
        criarAnotacoes, 
        deletarAnotacoes
    } 
    from '../controllers/anotacoesControllers.js';
const anotacoesRouter = Router()


anotacoesRouter.get('/anotacoes', autenticar, acessarAnotacoes)
anotacoesRouter.get('/anotacoes/:id', autenticar, acessarAnotacoesPorID)
anotacoesRouter.post('/anotacoes', autenticar, criarAnotacoes)
anotacoesRouter.patch('/anotacoes/:id', autenticar, atualizarAnotacoes)
anotacoesRouter.delete('/anotacoes/:id', autenticar, deletarAnotacoes)

export default anotacoesRouter