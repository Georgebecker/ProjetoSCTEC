document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-contato');
    const statusDiv = document.getElementById('mensagem-status');

    form.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();
        
        if (nome === '') {
            statusDiv.innerHTML = '❌ Por favor, preencha o campo Nome.';
            statusDiv.style.color = 'red';
            return;
        }
        
        if (email === '') {
            statusDiv.innerHTML = '❌ Por favor, preencha o campo E-mail.';
            statusDiv.style.color = 'red';
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            statusDiv.innerHTML = '❌ Insira um e-mail válido (ex: nome@dominio.com).';
            statusDiv.style.color = 'red';
            return;
        }
        
        if (mensagem === '') {
            statusDiv.innerHTML = '❌ Por favor, escreva sua mensagem.';
            statusDiv.style.color = 'red';
            return;
        }
        
        statusDiv.innerHTML = '✅ Mensagem enviada com sucesso! Em breve entraremos em contato.';
        statusDiv.style.color = 'green';
        document.getElementById('form-contato').reset();
    });
});