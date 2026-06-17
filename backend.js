const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());          // permite chamadas do frontend
app.use(express.json());  // processa JSON enviado pelo frontend

// Verifica se a chave da API existe
if (!process.env.DEEPSEEK_API_KEY) {
    console.error('ERRO: DEEPSEEK_API_KEY não configurada no arquivo .env');
    process.exit(1);
}

// Configura o cliente da DeepSeek
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
});

const fs = require('fs');
const path = require('path');
const arquivoLeads = path.join(__dirname, 'leads.json');
const arquivoLeadsCsv = path.join(__dirname, 'leads.csv');

function salvarLeadCSV(lead) {
    const linha = `${lead.dataRegistro},${lead.nome},${lead.email},${lead.whatsapp},${lead.descricao},${lead.nomePet},${lead.raca},${lead.tipoServico},${lead.valorServico}\n`;
    if (!fs.existsSync(arquivoLeadsCsv)) {
        fs.writeFileSync(arquivoLeadsCsv, 'data_registro,nome,email,whatsapp,descricao,nome_pet,raca,tipo_servico,valor_servico\n', 'utf8');
    }
    fs.appendFileSync(arquivoLeadsCsv, linha, 'utf8');
}

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor do chatbot está funcionando!');
});

// Rota para salvar lead
app.post('/salvar-lead', (req, res) => {
    const novoLead = req.body;
    console.log('Recebido lead:', JSON.stringify(novoLead, null, 2));
    
    if (!novoLead || !novoLead.nome || !novoLead.email || !novoLead.whatsapp || !novoLead.descricao || !novoLead.nomePet || !novoLead.raca || !novoLead.tipoServico || !novoLead.valorServico) {
        console.error('Validação falhou. Campos:', { nome: !!novoLead?.nome, email: !!novoLead?.email, whatsapp: !!novoLead?.whatsapp, descricao: !!novoLead?.descricao, nomePet: !!novoLead?.nomePet, raca: !!novoLead?.raca, tipoServico: !!novoLead?.tipoServico, valorServico: !!novoLead?.valorServico });
        return res.status(400).json({ error: 'Dados de lead incompletos' });
    }

    try {
        let leads = [];
        if (fs.existsSync(arquivoLeads)) {
            const dados = fs.readFileSync(arquivoLeads, 'utf8');
            leads = dados ? JSON.parse(dados) : [];
        }

        leads.push(novoLead);
        fs.writeFileSync(arquivoLeads, JSON.stringify(leads, null, 2), 'utf8');
        salvarLeadCSV(novoLead);

        console.log('Lead salvo com sucesso:', novoLead);
        res.status(200).json({ mensagem: 'Lead salvo com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar lead:', error);
        res.status(500).json({ error: 'Erro ao salvar lead' });
    }
});

// Rota para o chat (o frontend vai chamar esta rota)
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Mensagem não fornecida' });
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'Você é um assistente de um petshop chamado Amigo Fiel. Seja simpático e útil.' },
                { role: 'user', content: message }
            ],
            model: 'deepseek-chat',
            stream: false,
        });

        const reply = completion.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error('Erro na API DeepSeek:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao processar sua mensagem' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});