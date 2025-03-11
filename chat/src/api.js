import * as OpenAI from "./open-ai.js";
import {WhatsAppBusinessAPI} from "./whatsapp-business.js";
import axios from 'axios';
import express from 'express';

const app = express();

export class API {
    constructor(port = 3000) {
        app.use(express.json());
        this.start(port);
        this.exposeCarmen();
    }

    start(port) {
        app.listen(port, () => {
            console.log(`Servidor funcionando en http://localhost:${port}`);
        });
    }

    exposeCarmen() {
        app.post('/webhook/carmen', async (req, res) => {
            const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

            if (!message) {
                return res.status(400).send({error: 'No message provided'});
            }

            try {
                const from = message.from;
                const text = message.text?.body;
                console.log(`Message from [${from}] to [${text}]`);

                const reply = await OpenAI.chat(
                    OpenAI.getOpenAI(process.env.OPENAI_API_KEY),
                    message
                );
                console.log(`Respuesta de Carmen: ${reply}`);
                await WhatsAppBusinessAPI.sendMessage(from, reply);
                res.status(200).send();
            } catch (error) {
                console.error('Error al comunicarse con OpenAI:', error);
                res.status(500).send({error: 'Error interno del servidor'});
            }
        });
    }
}
