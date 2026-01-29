const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// --- SEUS DADOS (Preencha aqui) ---
const TOKEN_ACESSO = "COLE_AQUI_O_TOKEN_GERADO"; // O token temporário ou permanente
const ID_TELEFONE = "967974033069652"; // ID da image_6f71e2.jpg
const VERSAO_API = "v22.0"; // Versão que aparece no seu painel
const SENHA_WEBHOOK = "relax_bot_2026"; // Senha que você inventará para o Meta validar seu servidor

// 1. Rota de Validação (O Meta usa isso para confirmar que seu servidor existe)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === SENHA_WEBHOOK) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// 2. Rota de Recebimento de Mensagens
app.post('/webhook', async (req, res) => {
    const body = req.body;
    if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        const msg = body.entry[0].changes[0].value.messages[0];
        const doNumero = msg.from;
        const textoRecebido = msg.text.body;

        console.log(`Mensagem de ${doNumero}: ${textoRecebido}`);

        // Resposta Automática
        const resposta = "Olá! Eu sou o Relax Bot. Recebi sua mensagem com sucesso!";

        try {
            await axios.post(`https://graph.facebook.com/${VERSAO_API}/${ID_TELEFONE}/messages`, {
                messaging_product: "whatsapp",
                to: doNumero,
                text: { body: resposta }
            }, {
                headers: { 'Authorization': `Bearer ${TOKEN_ACESSO}` }
            });
        } catch (error) {
            console.error("Erro no envio:", error.response?.data || error.message);
        }
    }
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot online na porta ${PORT}`));