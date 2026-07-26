import app from './src/app.js';
import logger from './src/middleware/logger.js';
import pool from './src/database.js';
import dotenv from 'dotenv'
import anotacoesRouter from './src/routes/anotacoes.js';
import usuariosRouter from './src/routes/usuarios.js';

dotenv.config()


const PORT = process.env.PORT||3000;
try {
    await pool.query("SELECT NOW()");
    console.log("✅ Banco conectado!");
} catch (erro) {
    console.error("❌ Erro ao conectar:", erro);
}

app.use(logger)
app.use(anotacoesRouter)
app.use(usuariosRouter)

app.listen(PORT, () => {

console.log("Servidor escutando na porta", PORT);

});