const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// --- DADOS DO RELAX BOT (ATUALIZADOS) ---
const TOKEN_ACESSO = "EAAMz5j9geUkBQhArBdpZCWUBmiDSZBZADQK6LmLeLNVh56ZBE30H4Hxa4JGjwpmY4QA7UyJfZAWZAzkIITrReIjOURbyNdEoQtR8Bii44ZCagbgnkQZB2eodaEWs6ZBZAS7GEXhFr62kjvvEFmhsdw7wkZABo5UQJvUvrZB166hiNRVXnfpNKGa8CIyHiwAGU0HnYs2i64jL1RQDiOwzm5MvSTWxSKjWPZAElFPb02H9f9zfLEwNd4932MT34fEHnMQBkc3YdroaHQBoUaY72ZBhIxOkr2Aw2OLQZDZD";
const VERSAO_API = "v22.0"; 
const SENHA_WEBHOOK = "relax_bot_2026"; // Esta é a senha que você deve colocar no campo "Token de Verificação" no Meta

// 1. Rota de Validação do Webhook (Obrigatória para o Meta aceitar sua URL)
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

// 2. Rota que recebe as mensagens do WhatsApp
app.post('/webhook', async (req, res) => {
    const body = req.body;

    // Verifica se é uma notificação de mensagem
    if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        const msg = body.entry[0].changes[0].value.messages[0];
        const doNumero = msg.from; // Número de quem enviou
        const textoRecebido = msg.text ? msg.text.body : "";

        console.log(`Mensagem recebida de ${doNumero}: ${textoRecebido}`);

        // Lógica de Resposta
        const resposta = "Olá! Eu sou o Relax Bot. Recebi sua mensagem com sucesso! Como posso te ajudar hoje?";

        try {
            // Enviando a resposta de volta usando a API da Meta
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

    // Retorna 200 para avisar ao Meta que recebemos o evento
    res.sendStatus(200);
});

// A porta deve ser dinâmica para funcionar na Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Relax Bot online na porta ${PORT}`);
});