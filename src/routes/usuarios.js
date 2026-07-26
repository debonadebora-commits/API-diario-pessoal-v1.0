import { Router } from 'express'
import { cadastrar, login } from '../controllers/usuariosController.js'

const usuariosRouter = Router()

usuariosRouter.post('/cadastrar', cadastrar)
usuariosRouter.post('/login', login)

export default usuariosRouter