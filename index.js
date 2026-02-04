const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// --- DADOS DO RELAX BOT (ATUALIZADOS COM TOKEN PERMANENTE) ---
const TOKEN_ACESSO = "EAAMz5j9geUkBQtNodfSxniANpBX3oCETBrjyC6XoeOhbml2s6wV73VMDYQk08JyinTsnD8lMoRX2GikzMh4m0bgJTJTNk3SkVzGXcTIq1jWQl5H1wKQFkZCA3yw8gZAh4RPPZB1UEgvkKY5M9ogEZBec1dSOtBe2ZAu6MpC0f5A0TZCH3riQWSeDZCrqtyaiOAAZBQZDZD";
const ID_TELEFONE = "967974033069652"; 
const VERSAO_API = "v22.0"; 
const SENHA_WEBHOOK = "relax_bot_2026"; 

// 1. Rota de Validação do Webhook (Necessário para a Meta validar seu servidor)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === SENHA_WEBHOOK) {
        console.log("Webhook validado com sucesso!");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// 2. Rota que recebe e responde as mensagens no WhatsApp
app.post('/webhook', async (req, res) => {
    const body = req.body;

    // Verifica se é uma mensagem de texto recebida
    if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        const msg = body.entry[0].changes[0].value.messages[0];
        const doNumero = msg.from; 
        const textoRecebido = msg.text ? msg.text.body : "";

        console.log(`Mensagem recebida de ${doNumero}: ${textoRecebido}`);

        // Resposta padrão do Relax Bot
        const resposta = "Olá! Eu sou o Relax Bot. Recebi sua mensagem com sucesso! Como posso te ajudar hoje?";

        try {
            // Chamada para a API da Meta para enviar a resposta
            await axios.post(`https://graph.facebook.com/${VERSAO_API}/${ID_TELEFONE}/messages`, {
                messaging_product: "whatsapp",
                to: doNumero,
                text: { body: resposta }
            }, {
                headers: { 
                    'Authorization': `Bearer ${TOKEN_ACESSO}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Resposta enviada com sucesso!");
        } catch (error) {
            console.error("Erro ao enviar resposta:", error.response ? error.response.data : error.message);
        }
    }

    res.sendStatus(200);
});

// Porta configurada para a Render (Hospedagem)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Relax Bot online na porta ${PORT}`);
});