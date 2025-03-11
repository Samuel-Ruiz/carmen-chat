import {OpenAI} from 'openai';

export function getOpenAI(apiKey) {
    return new OpenAI({
        apiKey,
    });
}

export async function chat(openai, question) {
    if (!question) {
        return null;
    }
    const text = question.text?.body;
    const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            {role: 'system', content: `You are talking to a guess`},
            {role: 'user', content: text ?? ''},
        ],
    });

    return response.choices[0].message.content;
}
