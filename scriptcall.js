document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');

    let chatInicializado = false;

    function toggleChatbot(open) {
        chatbotPanel.classList.toggle('open', open);
        chatbotButton.setAttribute('aria-expanded', open);
        chatbotPanel.setAttribute('aria-hidden', !open);
        if (open) {
            chatbotInput.focus();
        }
    }

    function addMessage(text, author) {
        const message = document.createElement('div');
        message.className = `chatbot-message ${author}`;
        message.textContent = text;
        chatbotMessages.appendChild(message);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function callDeepseekApi(question) {
        const payload = { message: question };
        const apiUrl = 'http://localhost:3000/chat';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Servidor retornou status ${response.status}`);
            }

            const data = await response.json();
            if (data.reply) {
                return data.reply;
            }

            console.error('Erro do backend:', data.error);
            return 'Desculpe, ocorreu um erro ao processar sua mensagem.';
        } catch (error) {
            console.error('Erro de conexão com o servidor:', error);
            return 'Desculpe, não foi possível conectar ao serviço de chat. Verifique se o servidor está rodando em http://localhost:3000';
        }
    }

    function iniciarChat() {
        if (chatInicializado) return;
        addMessage('Olá! Bem-vindo ao Chat Pet. Como posso ajudar você hoje com seu pet?', 'bot');
        chatInicializado = true;
    }

    function showChat() {
        chatContainer.classList.add('chat-visible');
        chatContainer.classList.remove('chat-hidden');
        toggleChatbot(true);
        iniciarChat();
    }

    chatbotButton.addEventListener('click', showChat);
    chatbotClose.addEventListener('click', () => toggleChatbot(false));

    chatbotForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const question = chatbotInput.value.trim();
        if (!question) return;

        addMessage(question, 'user');
        chatbotInput.value = '';
        addMessage('Pensando em uma resposta...', 'bot');

        try {
            const answer = await callDeepseekApi(question);
            const lastMessage = chatbotMessages.querySelector('.chatbot-message.bot:last-child');
            if (lastMessage) {
                lastMessage.textContent = answer;
            }
        } catch (error) {
            const lastMessage = chatbotMessages.querySelector('.chatbot-message.bot:last-child');
            if (lastMessage) {
                lastMessage.textContent = 'Desculpe, não foi possível conectar ao serviço do chatbot.';
            }
            console.error(error);
        }
    });
});
