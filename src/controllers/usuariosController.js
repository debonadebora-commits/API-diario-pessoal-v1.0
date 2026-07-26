import { autentica, cadastro } from '../services/usuariosServices.js'

export async function cadastrar (req, res) {
    const resultado = await cadastro(req.body)
    if (!resultado) 
        return res.status(400).json({message: 'nao foi possivel cadastrar. Um ou mais dados estao invalidos', data: Date.now()})
    
    res.status(201).json(resultado)
}

export async function login (req, res) {
    const resultado = await autentica(req.body)
    if (!resultado) 
        res.status(401).json({
            message: "nome ou senha incorretos.",
            data: Date.now()
        });
    res.status(200).json(
        resultado
    );
};