const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// --- DADOS DO RELAX BOT (ATUALIZADOS COM O NOVO TOKEN) ---
const TOKEN_ACESSO = "EAAMz5j9geUkBQiBZAbTun4fnsr2KYeaJOXyVZCwwmm0KSNEg8ikwtYTCQilGQXlvqJz2XP8ZC0U0IcgFQQo7QrZBjpQvyLrb2tqoKpsnm9jkHvd2FDvlAZBwk59HcUKjP3h2lnkDZCRnDjeUxdl5PqEIeyhjieUorbfkbSczttX34S6yVdoviBJc9JMvONtyUovLnoAm0D7Uht3xv3ZA4sAjwWYGNcVhkmZBdG0l0HABfCVm1g6Tls6zTjomBEr3NJbIeuuwKnjspLOdKv76UiUwjoTmF4wHdLgQRBrZCRwZDZD";
const ID_TELEFONE = "967974033069652"; 
const VERSAO_API = "v22.0"; 
const SENHA_WEBHOOK = "relax_bot_2026"; 

// 1. Rota de Validação do Webhook (Para a Meta validar seu servidor)
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

// 2. Rota que recebe e responde as mensagens
app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        const msg = body.entry[0].changes[0].value.messages[0];
        const doNumero = msg.from; 
        const textoRecebido = msg.text ? msg.text.body : "";

        console.log(`Mensagem recebida de ${doNumero}: ${textoRecebido}`);

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

// Porta configurada para a Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Relax Bot online na porta ${PORT}`);
});