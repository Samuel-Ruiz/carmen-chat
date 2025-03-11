import axios from "axios";


export class WhatsAppBusinessAPI {
    static async sendMessage(to, message) {
        await axios.post(`https://graph.facebook.com/v22.0/619076797948159/messages`,
            {
                messaging_product: 'whatsapp',
                to,
                type: "text",
                text: {body: message}
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_BUSINESS_API_KEY}`
                }
            })
    }
}