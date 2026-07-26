import { acessaAnotacao, acessaAnotacaoPorID, atualizaAnotacao, criaAnotacao, deletaAnotacao } from '../services/anotacoesServices.js';

export async function acessarAnotacoes(req, res) {
   try {
        const resultado = await acessaAnotacao(
            req.usuario.id,
            req.query
        )

        res.status(200).json(resultado)

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar anotações."
        });
    };
}

export async function acessarAnotacoesPorID(req,res) {

    const resultado = await acessaAnotacaoPorID(
        req.usuario.id,
        req.params.id
    )

    if (!resultado) {
        return res.status(404).json({
            message: "anotação não encontrada",
            data: Date.now()
        });
    }

    res.status(200).json(resultado)
}

export async function criarAnotacoes(req,res) {
    const resultado = await criaAnotacao (
        req.usuario.id,
        req.body
    )

    if (!resultado) 
        return res.status(400)
            .json({
                message: 'nao foi possivel adicionar. Um ou mais dados estao invalidos', 
                data:Date.now()
            })
    

    res.status(201).json(resultado)

    next()
}

export async function atualizarAnotacoes (req, res) {
    const resultado = await atualizaAnotacao(
        req.usuario.id,
        req.params.id,
        req.body
    )

    if (!resultado)
        return res.status(400).json({message:'nao foi possivel atualizar. Dados invalidos.', data:Date.now()})
    
    res.status(200).json(resultado)
}

export async function deletarAnotacoes (req, res) {
    const resultado = await deletaAnotacao (
        req.usuario.id,
        req.params.id
    )

    if (!resultado) { 
        return res.status(404).json({message: 'anotação nao encontrada', data:Date.now()})   
    }

    res.status(200).json(resultado)
}