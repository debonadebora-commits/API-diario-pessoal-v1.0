import express from 'express';

const app = express();
app.use(express.json())
const PORT = 3000;

let anotacoes = 
[{
    id: Date.now(),
    data: '24/07',
    corpo: 'hoje me senti feliz',
    humor: '8/10'
    }, {
    id: Date.now()+1,
    data: '25/07',
    corpo: 'hoje me senti triste',
    humor: '2/10'
}]


app.get('/teste', (req, res) => {
    res.json({message: 'testando', data:Date.now()});
});

app.get('/anotacoes', (req, res) => {
    const {humor, data, busca, page = 1, limit = 2} = req.query
    const pagina = Number(page)
    const limite = Number(limit)

    let resultado = anotacoes
    if (busca){
        resultado = resultado.filter(anotacao => 
        anotacao.corpo.toLowerCase().includes(busca.toLowerCase())
    )}
    if (humor){
        resultado = resultado.filter(anotacao => anotacao.humor === humor)
    }
    if (data) {
        resultado = resultado.filter(anotacao => anotacao.data === data)
    }
    const inicio = (pagina - 1) * limite
    const fim = inicio + limite

    const total = resultado.length;

    resultado = resultado.slice(inicio, fim)

    res.json({
    dados: resultado,
    total,
    pagina: pagina,
    limite: limite,
    data: Date.now()
});
})

app.get('/anotacoes/:id', (req, res) => {
    const id = req.params.id
    const anotacaoEncontrada = anotacoes.find(anotacao => anotacao.id === Number(id))
    if (!anotacaoEncontrada) {
      return res.status(404).json({message: 'anotação nao encontrada', data:Date.now()})
    }
    res.status(200).json({dados: anotacaoEncontrada, data:Date.now()})
})

app.post('/anotacoes', (req, res) => {
    const novaAnotacao = req.body
    if (!novaAnotacao.data
        ||!novaAnotacao.corpo) {
        return res.status(400).json({'message': 'nao foi possivel adicionar. Um ou mais dados estao invalidos', data:Date.now()})
    }

    const id = Date.now();
    const anotacao = {
        id,
        data: novaAnotacao.data,
        corpo: novaAnotacao.corpo,
        humor: novaAnotacao.humor ?? '--/--'
    };
    anotacoes.push(anotacao)
    res.status(201).json({message: 'adicionado com sucesso', data:Date.now()})
})

app.put('/anotacoes/:id', (req, res) => {
    const id = req.params.id
    const anotacaoEncontrada = anotacoes.find(anotacao => anotacao.id === Number(id))
    if (!anotacaoEncontrada) {
        return res.status(404).json({message: 'anotação nao encontrada', data:Date.now()})
    }
    if (req.body.data) 
        anotacaoEncontrada.data = req.body.data;
    if (req.body.corpo) 
        anotacaoEncontrada.corpo = req.body.corpo;
    if (req.body.humor) 
        anotacaoEncontrada.humor = req.body.humor;
    res.json({message: 'atualizado com sucesso', data:Date.now()})
})

app.delete('/anotacoes/:id', (req, res) => {
    const id = req.params.id
    const idEncontrado = anotacoes.findIndex(anotacao => anotacao.id === Number(id))
    if (idEncontrado === -1) {
        return res.status(404).json({message: 'anotação nao encontrada', data:Date.now()})
    }
    anotacoes.splice(idEncontrado,1)
    res.json({message: 'removido com sucesso', data:Date.now()})
})

app.listen(PORT, () => {
    console.log("Servidor escutando na porta", PORT);
});
