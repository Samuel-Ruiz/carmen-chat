process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const express = require('express');
const axios = require('axios');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
/**
 * Webhook to receive messages from the whatsapp business api
 * Then send the message to the OpenAI API to get a response
 * Then send the response back to the whatsapp business api
 */
app.post('/webhook/carmen', async (req, res) => {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
        return res.status(400).send({error: 'Mensaje no proporcionado'});
    }

    try {
        const from = message.from;
        const text = message.text?.body;
        console.log(`Mensaje de ${from}: ${text}`);

        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
                {role: 'system', content: `You are talking to ${from}`},
                {role: 'user', content: text ?? ''},
            ],
        });

        const reply = response.choices[0].message.content;
        console.log(`Respuesta de Carmen: ${reply}`);

        // Send the reply back to the whatsapp business api
        await axios.post(`https://graph.facebook.com/v22.0/619076797948159/messages`,
            {
                messaging_product: 'whatsapp',
                to: from,
                type: "text",
                text: {body: reply}
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_BUSINESS_API_KEY}`
                }
            })
        res.send({reply});
    } catch (error) {
        console.error('Error al comunicarse con OpenAI:', error);
        res.status(500).send({error: 'Error interno del servidor'});
    }
});

app.listen(port, () => {
    console.log(`Servidor funcionando en http://localhost:${port}`);
});
