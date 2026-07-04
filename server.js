import express from 'express';

const app = express();
app.use(express.json())
const PORT = 3000;

let anotacoes = 
[{
    id: 1,
    data: '24/07',
    corpo: 'hoje me senti feliz',
    humor: '8/10'
    }, {
    id: 2,
    data: '25/07',
    corpo: 'hoje me senti triste',
    humor: '2/10'
}]

app.get('/teste', (req, res) => {
    res.send('testando 123');
});

app.get('/anotacoes', (req, res) => {
    res.send(anotacoes)
})

app.get('/anotacoes/:id', (req, res) => {
    const id = req.params.id
    const anotacaoEncontrada = anotacoes.find(anotacao => anotacao.id == id)
    res.status(200).json(anotacaoEncontrada)
})

app.post('/anotacoes', (req, res) => {
    const novaAnotacao = req.body
    anotacoes.push(novaAnotacao)
    res.send('adicionado com sucesso')
})

app.put('/anotacoes/:id', (req, res) => {
    const id = req.params.id
    const anotacaoEncontrada = anotacoes.find(anotacao => anotacao.id == id)
    anotacaoEncontrada.data = req.body.data;
    anotacaoEncontrada.corpo = req.body.corpo;
    anotacaoEncontrada.humor = req.body.humor;
    res.send('atualizado com sucesso')
})

app.delete('/anotacoes/:id', (req, res) => {
    const id = req.params.id
    const idEncontrado = anotacoes.findIndex(anotacao => anotacao.id == id)
    anotacoes.splice(idEncontrado,1)
    res.send('removido com sucesso')
})

app.listen(PORT, () => {
    console.log("Servidor escutando na porta", PORT);
});
