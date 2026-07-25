import app from './src/app.js';
import logger from './src/middleware/logger.js';
// import anotacoes from './dados/anotações.js';
// import usuarios from './dados/usuarios.js';
import autenticar from './src/middleware/autenticar.js';
import pool from './database.js';

const PORT = 3000;

try {
    await pool.query("SELECT NOW()");
    console.log("✅ Banco conectado!");
} catch (erro) {
    console.error("❌ Erro ao conectar:", erro);
}

app.use(logger)
app.post('/login', async (req, res) => {
    const {nome, senha} = req.body
    if (!nome || !senha){
        return res.status(400).json({'message': 'nao foi possivel autenticar. Um ou mais dados estao invalidos', data:Date.now()})
    }
    const usuarioEncontrado = await pool.query(
        `
        SELECT * FROM usuarios
        WHERE nome = $1 
        AND senha = $2
        `,
        [nome,senha]
    )

    const dados = usuarioEncontrado.rows[0]
    
    if (usuarioEncontrado.rows.length === 0){
        return res.status(401).json({'message': 'nao foi possivel autenticar. nome ou senha estao incorretos.', data:Date.now()})
    }

    res.status(200).json({
        'message': 'autenticação concluída.',
        'usuario': dados.nome, 
        'token': dados.token,
        data:Date.now()
    })
})

app.get('/teste', (req, res) => {
    res.json({message: 'testando', data:Date.now()});
});

app.get('/anotacoes', autenticar, async (req, res) => {
    try {
        const {
            humor,
            data,
            busca,
            page = 1,
            limit = 5
        } = req.query;

        const pagina = Number(page);
        const limite = Number(limit);
        const offset = (pagina - 1) * limite;
        const usuarioId = req.usuario.id

        // Aqui vamos guardar apenas os filtros
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

        


        // Consulta que busca os dados
        const sqlDados = `
            SELECT 
            entradas.id,
            entradas.corpo,
            entradas.humor,
            entradas.data_cadastro,
            entradas.usuario_id,
            usuarios.nome
            FROM entradas
            JOIN usuarios ON usuario_id = usuarios.id
            ${where}
            ORDER BY usuarios.id
            LIMIT $${valores.length + 1}
            OFFSET $${valores.length + 2}
        `;

        const valoresDados = [
            ...valores,
            limite,
            offset
        ];

        // Consulta que conta quantos registros existem
        const sqlTotal = `
            SELECT COUNT(*) AS total
        FROM entradas
        JOIN usuarios ON usuario_id = usuarios.id
        ${where}
        `;

        // Executa as duas consultas ao mesmo tempo
        const [dados, total] = await Promise.all([
            pool.query(sqlDados, valoresDados),
            pool.query(sqlTotal, valores)
        ]);

        res.json({
            dados: dados.rows,
            total: Number(total.rows[0].total),
            pagina,
            limite,
            data: Date.now()
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar anotações."
        });
    }
});


app.get('/anotacoes/:id', autenticar, async (req, res) => {

    const id = req.params.id
    const usuarioId = req.usuario.id

    const anotacaoEncontrada = await pool.query(
        `
        SELECT * FROM entradas
        WHERE id = $1 
        AND usuario_id = $2
        `,
        [id,usuarioId]
    )

    if (anotacaoEncontrada.rows.length === 0) {
        return res.status(404).json({message: 'anotação nao encontrada', data:Date.now()})
    }

    res.status(200).json({dados: anotacaoEncontrada.rows[0], data:Date.now()})

})


app.post('/anotacoes', autenticar, async (req, res) => {

    const novaAnotacao = req.body
    const usuarioId = req.usuario.id

    if (!novaAnotacao.data||!novaAnotacao.corpo) {
        return res.status(400)
        .json({
            'message': 'nao foi possivel adicionar. Um ou mais dados estao invalidos', 
            data:Date.now()
        })
    }
    const anotacao = await pool.query(
        `
        INSERT INTO entradas (data_cadastro, corpo, humor, usuario_id)
        VALUES ($1,$2,$3,$4)
        `,
        [novaAnotacao.data,novaAnotacao.corpo,novaAnotacao.humor,usuarioId]
    );


    res.status(201).json({message: 'adicionado com sucesso', data:Date.now()})
})

app.patch('/anotacoes/:id', autenticar, async (req, res) => {
    const id = req.params.id   
    const usuarioId = req.usuario.id
    const anotacaoEncontrada = await pool.query(
        `
        SELECT * FROM entradas
        WHERE id = $1 
        AND usuario_id = $2
        `,
        [id,usuarioId]
    )

    const dados = anotacaoEncontrada.rows[0]
    if (anotacaoEncontrada.rows.length === 0) { 
        return res.status(404).json({message: 'anotação nao encontrada', data:Date.now()})   
    }
    await pool.query(
        `
        UPDATE entradas
        SET 
            data_cadastro = $1,
            corpo = $2,
            humor = $3
        WHERE id = $4
        AND usuario_id = $5
        `,
        [
            req.body.data ?? dados.data_cadastro,
            req.body.corpo ?? dados.corpo,
            req.body.humor ?? dados.humor,
            id,
            usuarioId
        ]
    )
    res.status(200).json({message: 'atualizado com sucesso', data:Date.now()})
})

app.delete('/anotacoes/:id', autenticar, async (req, res) => {

    const id = req.params.id
    const usuarioId = req.usuario.id
    const anotacaoEncontrada = await pool.query(
        `
        SELECT * FROM entradas
        WHERE id = $1 
        AND usuario_id = $2
        `,
        [id,usuarioId]
    )

    if (anotacaoEncontrada.rows.length === 0) { 
        return res.status(404).json({message: 'anotação nao encontrada', data:Date.now()})   
    }

    await pool.query (
        `
        DELETE FROM entradas
        WHERE id = $1
        AND usuario_id = $2
        `,
        [id, usuarioId]
    )

res.status(200).json({message: 'removido com sucesso', data:Date.now()})

})


app.listen(PORT, () => {

console.log("Servidor escutando na porta", PORT);

});