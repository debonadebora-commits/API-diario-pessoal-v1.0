import { buscarTodos, buscarPorId, atualizar, criar, deletar } from "../repository/anotacoesRepository.js";

export async function acessaAnotacao(usuarioId,filtros) {
    const {
        humor,
        data,
        busca,
        page = 1,
        limit = 5
    } = filtros;

    const pagina = Number(page);
    const limite = Number(limit);
    const offset = (pagina - 1) * limite;

    let where = "WHERE 1=1";
    const valores = [];


    if (humor) {
        valores.push(humor);
        where += ` AND humor = $${valores.length}`;
    }

    if (data) {
        valores.push(data);
        where += ` AND data = $${valores.length}`;
    }

    if (busca) {
        valores.push(`%${busca}%`);
        where += ` AND corpo ILIKE $${valores.length}`;
    }

    valores.push(usuarioId);
    where += ` AND entradas.usuario_id = $${valores.length}`;

    const anotacoes = await buscarTodos({
        where,
        valores,
        limite,
        offset
    })

    return {
    dados: anotacoes.dados.rows,
    total: Number(anotacoes.total.rows[0].total),
    pagina,
    limite,
    data: Date.now()
    }
}

export async function acessaAnotacaoPorID (usuarioId, id) {

    const anotacao = await buscarPorId(usuarioId, id)
    
    if (anotacao.rows.length === 0) {
        return null
    }

    return ({dados: anotacao.rows[0], data: Date.now()})
}

export async function criaAnotacao (usuarioId,novaAnotacao){

    if (!novaAnotacao.data||!novaAnotacao.corpo) {
        return null
    }

    const anotacao = await criar(
        novaAnotacao.data, 
        novaAnotacao.corpo, 
        novaAnotacao.humor, 
        usuarioId
    )

    return ({message: 'adicionado com sucesso!', data: Date.now()})
    
}

export async function atualizaAnotacao (usuarioId, id, atualizacao){
    const anotacao = await buscarPorId(usuarioId, id)
    if (anotacao.rows.length === 0) {
        return null
    }
    const dados = anotacao.rows[0]

    const resultado = await atualizar(usuarioId, id, atualizacao, dados)

    return ({message:'atualizado com sucesso!', data: Date.now()})
}

export async function deletaAnotacao (usuarioId, id){
    const anotacao = await buscarPorId(usuarioId,id)
    if (anotacao.rows.length === 0) {
        return null
    }
    const resultado = await deletar(usuarioId, id)

    return ({message: 'deletado com sucesso!', data: Date.now()})
}