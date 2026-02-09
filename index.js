const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// --- CONFIGURAÇÃO OFICIAL DO RELAX BOT ---
// Seu Token Permanente gerado via Usuário do Sistema
const TOKEN_ACESSO = "EAAMz5j9geUkBQtNodfSxniANpBX3oCETBrjyC6XoeOhbml2s6wV73VMDYQk08JyinTsnD8lMoRX2GikzMh4m0bgJTJTNk3SkVzGXcTIq1jWQl5H1wKQFkZCA3yw8gZAh4RPPZB1UEgvkKY5M9ogEZBec1dSOtBe2ZAu6MpC0f5A0TZCH3riQWSeDZCrqtyaiOAAZBQZDZD";

// Seu ID de Telefone oficial (ID do número real)
const ID_TELEFONE = "1058159627372166"; 

const VERSAO_API = "v22.0"; 
const SENHA_WEBHOOK = "relax_bot_2026"; 

// 1. Validação do Webhook (Meta -> Seu Servidor)
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

// 2. Recebimento e Resposta de Mensagens
app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        const msg = body.entry[0].changes[0].value.messages[0];
        const doNumero = msg.from; 
        const textoRecebido = msg.text ? msg.text.body : "";

        console.log(`Mensagem recebida de ${doNumero}: ${textoRecebido}`);

        // Resposta personalizada do Relax Bot
        const resposta = "Olá! Eu sou o Relax Bot. Recebi sua mensagem com sucesso! Como posso te ajudar hoje?";

        try {
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

// Porta padrão da Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Relax Bot oficial online na porta ${PORT}`);
});