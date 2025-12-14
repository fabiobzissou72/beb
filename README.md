# B&B Confecções - PWA

PWA moderno para catálogo de uniformes personalizados com modo dark/claro e comportamento adaptativo para mobile e desktop.

## 🚀 Características

- ✅ PWA instalável (funciona offline)
- ✅ Modo Dark e Light
- ✅ Responsivo (mobile-first)
- ✅ Comportamento diferente: Mobile/PWA vs Desktop
- ✅ Modal de orçamento rápido
- ✅ Integração com webhook (n8n)
- ✅ 50+ produtos categorizados
- ✅ Glass effect UI moderna
- ✅ Service Worker para cache

## 📁 Estrutura

```
BEB/
├── logo/
│   └── logotipo.png
├── produtos/
│   └── [50+ imagens de produtos]
├── public/
│   ├── icons/
│   │   └── [ícones PWA gerados]
│   └── manifest.json
├── src/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── products.json
├── service-worker.js
└── package.json
```

## 🛠️ Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Gerar ícones PWA

```bash
npm run generate-icons
```

Isso vai gerar automaticamente todos os tamanhos de ícones necessários (72, 96, 128, 144, 152, 192, 384, 512px) a partir do logotipo.

### 3. Iniciar servidor local

```bash
npm start
```

O site estará disponível em: `http://localhost:3000/src/index.html`

## 📱 Como Funciona

### Mobile / PWA (Standalone)
- Tab bar inferior fixo
- Foco em produtos primeiro
- Modal fullscreen
- Navegação estilo app

### Desktop / Web
- Menu superior
- Hero institucional
- Grid amplo de produtos
- Layout tradicional

## 🎨 Modo Dark/Claro

O tema é alternado pelo botão no header e a preferência é salva no `localStorage`.

**Variáveis CSS:**
- Light: fundo branco, texto escuro
- Dark: fundo escuro (#0d0d0d), texto claro

## 📦 Webhook

Todas as solicitações de orçamento são enviadas para:
```
https://webhook.fbzia.com.br/webhook/bebconfeccoes
```

**Formato do payload:**
```json
{
  "origem": "pwa",
  "produto": "Nome do Produto",
  "categoria": "Categoria",
  "quantidade": 100,
  "cliente": {
    "nome": "João Silva",
    "empresa": "Empresa X",
    "cnpj": "00.000.000/0000-00",
    "whatsapp": "(11) 99999-9999",
    "email": "joao@empresa.com"
  },
  "observacoes": "Detalhes...",
  "timestamp": "2025-12-14T..."
}
```

## 🎯 Categorias de Produtos

1. **Camisetas e Polos** (19 produtos)
   - Polos variadas
   - Baby looks
   - Camisetas
   - Camisetes sociais

2. **Jaquetas e Moletons** (8 produtos)
   - Moletons
   - Jaquetas
   - Suéteres
   - Cardigans

3. **Uniformes Profissionais** (15 produtos)
   - Jalecos
   - Aventais
   - Scrubs
   - Calças profissionais

4. **Uniformes Escolares** (7 produtos)
   - Conjuntos esportivos
   - Jaquetas escolares
   - Calças e bermudas
   - Moletons escolares

## 🔧 Configuração

### Atualizar número do WhatsApp

Edite `src/app.js`:
```javascript
const CONFIG = {
    webhookURL: 'https://webhook.fbzia.com.br/webhook/bebconfeccoes',
    whatsappNumber: '5511999999999', // Atualizar aqui
};
```

### Adicionar novos produtos

Edite `products.json` e adicione as imagens na pasta `produtos/`.

## 🌐 Deploy

### Opção 1: GitHub Pages
1. Faça push para GitHub
2. Ative GitHub Pages
3. Aponte para a pasta raiz

### Opção 2: Vercel
```bash
npm install -g vercel
vercel
```

### Opção 3: Netlify
Arraste a pasta para o Netlify Drop

## 📱 Instalação do PWA

### Android
1. Abra no Chrome
2. Menu → "Adicionar à tela inicial"
3. O app será instalado

### iOS
1. Abra no Safari
2. Botão compartilhar
3. "Adicionar à Tela de Início"

## ✅ Checklist de Aceite

- [x] Abriu no celular → produtos primeiro
- [x] Abriu no desktop → institucional primeiro
- [x] Clique no produto abre modal
- [x] Modal envia pro webhook
- [x] Funciona offline (cache básico)
- [x] Instalável como app
- [x] Visual moderno (2025)
- [x] Modo dark/claro
- [x] 50+ produtos categorizados

## 🎨 Cores

- **Primary:** `#ff7a00` (laranja)
- **Primary Dark:** `#e66d00`
- **Primary Light:** `#ff9533`
- **Background (Light):** `#ffffff`
- **Background (Dark):** `#0d0d0d`

## 📄 Licença

© 2006-2025 B&B Confecções. Todos os direitos reservados.
