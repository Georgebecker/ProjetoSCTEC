# 🐾 PetShop Amigo Fiel - Chatbot Seguro

## Configuração do Backend Seguro

Este projeto utiliza um servidor Node.js para proteger a chave de API do Deepseek.

### ⚠️ Segurança Importante

**NUNCA exponha a chave de API do Deepseek no código do navegador (frontend).**

O fluxo correto é:
```
Frontend (HTML/JS) → Request HTTP → Server Node.js → Deepseek API
                                    ↑ Chave protegida aqui
```

---

## 🚀 Como Configurar

### 1. Instalar Dependências

```bash
npm install
```

Isso instalará:
- `express` - framework web
- `dotenv` - para variáveis de ambiente
- `cors` - para aceitar requisições do frontend
- `node-fetch` - para fazer requisições HTTP

### 2. Configurar Chave de API

1. Copie `.env.example` e renomeie para `.env`:
```bash
cp .env.example .env
```

2. Edite `.env` e insira sua chave do Deepseek:
```
DEEPSEEK_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxx
```

**Obtenha sua chave em:** https://www.deepseek.com/api

### 3. Iniciar o Servidor

```bash
npm start
```

Você verá:
```
🚀 Servidor rodando em http://localhost:3000
✅ Endpoint seguro disponível em http://localhost:3000/chat
```

### 4. Testar o Endpoint

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Como dar banho em um cachorro?"
  }'
```

---

## 🔒 Como o Chatbot Funciona

1. **Frontend** (`scriptcall.js`): Usuário digita mensagem no chat
2. **Request**: Frontend envia mensagem via AJAX para `http://localhost:3000/chat`
3. **Backend** (`backend.js`): Recebe a mensagem, valida, e faz chamada ao Deepseek **com a chave protegida**
4. **Response**: Deepseek responde, backend retorna ao frontend
5. **Chat**: Mensagem aparece na janela do chatbot

---

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `backend.js` | Servidor Express com endpoint seguro |
| `.env.example` | Template de variáveis de ambiente |
| `.env` | **Arquivo real com sua chave (NÃO commite!)** |
| `.gitignore` | Protege `.env` de ser commitido |
| `package.json` | Dependências do projeto |
| `scriptcall.js` | JavaScript do frontend que chama o backend |

---

## ✅ Checklist de Segurança

- [ ] `.env` criado e contém `DEEPSEEK_API_KEY`
- [ ] `.env` está listado em `.gitignore`
- [ ] `backend.js` rodando em http://localhost:3000
- [ ] Frontend consegue chamar `http://localhost:3000/chat`
- [ ] Chatbot responde com sucesso

---

## 🐛 Troubleshooting

**Erro: "DEEPSEEK_API_KEY não configurada"**
→ Crie `.env` e adicione sua chave

**Erro: "Cannot find module 'express'"**
→ Execute `npm install`

**Erro: "Port 3000 já está em uso"**
→ Mude em `.env`: `PORT=3001`

**CORS error no navegador**
→ `backend.js` já tem `cors` configurado, deve funcionar

---

## 🔗 Próximos Passos (Deploy)

Para publicar em produção:
1. Use um serviço como Heroku, Vercel, ou AWS
2. Configure variáveis de ambiente no painel do serviço
3. **Nunca commite o arquivo `.env` real**
4. Atualize `scriptcall.js` para usar a URL da produção

---

## 📞 Suporte

Dúvidas sobre:
- **Deepseek**: https://www.deepseek.com/api
- **Express**: https://expressjs.com/
- **Node.js**: https://nodejs.org/

---

**Desenvolvido por:** George Herman Becker - SCTEC  
**Data:** 15/06/2026
