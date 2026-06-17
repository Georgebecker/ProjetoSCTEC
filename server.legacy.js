/**
 * Servidor seguro para proteger a chave da API Deepseek
 * A chave fica no arquivo .env e nunca é exposta ao navegador
 * 
 * Dependências necessárias:
 * npm install express dotenv cors
 * 
 * Uso:
 * node server.js
 * Acesse em: http://localhost:3000
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('./'));

// Validar chave de API
if (!process.env.DEEPSEEK_API_KEY) {
    console.error('❌ ERRO: DEEPSEEK_API_KEY não configurada no arquivo .env');
    console.error('Crie um arquivo .env com:');
    console.error('DEEPSEEK_API_KEY=sua_chave_aqui');
    process.exit(1);
}

console.log('✅ Chave de API do Deepseek carregada com sucesso');
console.log('Chave configurada no servidor:', !!process.env.DEEPSEEK_API_KEY);

// Endpoint seguro para chamadas ao Deepseek
app.post('/api/deepseek', async (req, res) => {
    try {
        const { prompt, context } = req.body;

        // Validação básica
        if (!prompt || prompt.trim() === '') {
            return res.status(400).json({ error: 'Prompt vazio' });
        }

        console.log(`📨 Recebeu pergunta: "${prompt.substring(0, 50)}..."`);

        // Montar payload para o Deepseek
        const payload = {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: context || 'Você é um assistente especializado em cuidado de pets. Responda de forma clara e útil sobre banho, tosa, consultas, hospedagem e saúde de animais.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        };

        // Chamar API do Deepseek com chave protegida
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Deepseek API retornou status ${response.status}`);
        }

        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua pergunta.';

        console.log(`✅ Resposta gerada com sucesso`);

        // Retornar resposta ao frontend
        res.json({ answer });

    } catch (error) {
        console.error('❌ Erro ao chamar Deepseek:', error.message);
        res.status(500).json({ 
            error: 'Erro ao processar sua pergunta. Tente novamente mais tarde.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Rota de chat usada pelo frontend
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Mensagem vazia' });
        }

        console.log(`📨 Chat recebeu: "${message.substring(0, 50)}..."`);

        const payload = {
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: 'Você é um assistente especializado em cuidado de pets. Responda de forma clara e útil sobre banho, tosa, consultas, hospedagem e saúde de animais.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        };

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Deepseek API retornou status ${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

        console.log('✅ Resposta do chat enviada para o frontend');
        res.json({ reply });
    } catch (error) {
        console.error('❌ Erro no endpoint /chat:', error.message);
        res.status(500).json({ 
            error: 'Erro ao processar a mensagem do chat. Tente novamente mais tarde.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`✅ Endpoint seguro disponível em http://localhost:${PORT}/api/deepseek`);
    console.log(`📝 Certifique-se de que .env contém DEEPSEEK_API_KEY`);
});
