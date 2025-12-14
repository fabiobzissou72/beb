# ✅ Checklist de Testes - B&B Confecções PWA

Use este checklist para testar todas as funcionalidades do PWA.

---

## 🌐 Testes Desktop (Navegador)

### Hero Section
- [ ] Hero institucional aparece no topo
- [ ] Título: "Uniformes Personalizados com Qualidade e Tradição"
- [ ] Subtítulo: "Desde 2006..."
- [ ] Botão "Ver Produtos" funciona
- [ ] Botão "Solicitar Orçamento" abre modal de contato

### Menu Superior
- [ ] Logo B&B visível
- [ ] Links: Início, Empresa, Produtos, Contato
- [ ] Botão de tema (🌙) presente
- [ ] Hover nos links funciona
- [ ] Link ativo tem linha laranja embaixo

### Seção Empresa
- [ ] Título "Sobre a B&B Confecções"
- [ ] Texto institucional presente
- [ ] 3 cards de diferenciais:
  - [ ] 🏭 Produção Própria
  - [ ] ✨ Personalização
  - [ ] 🤝 Atendimento B2B
- [ ] Hover nos cards funciona (elevação)

### Categorias
- [ ] 4 categorias visíveis (grid 2 colunas)
- [ ] Ícones corretos:
  - [ ] 👕 Camisetas e Polos
  - [ ] 🧥 Jaquetas e Moletons
  - [ ] 👔 Uniformes Profissionais
  - [ ] 🎓 Uniformes Escolares
- [ ] Clique filtra produtos
- [ ] Hover muda borda para laranja

### Produtos
- [ ] Grid de 3-4 colunas (desktop)
- [ ] Tabs de filtro funcionam
- [ ] Tab "Todos" mostra tudo
- [ ] Cada categoria filtra corretamente
- [ ] Imagens carregam
- [ ] Botão "Solicitar Orçamento" em cada card
- [ ] Hover nos cards funciona (elevação + borda laranja)

### Contato
- [ ] 4 cards de contato:
  - [ ] 📱 WhatsApp
  - [ ] 📞 Telefone
  - [ ] ✉️ E-mail
  - [ ] 📍 Endereço
- [ ] Links clicáveis (WhatsApp, telefone, email)
- [ ] Botão "Solicitar Orçamento" abre modal

### Footer
- [ ] © 2006-2025 B&B Confecções
- [ ] Sem margin-bottom (desktop)

---

## 📱 Testes Mobile (DevTools)

### Header Mobile
- [ ] Logo compacta
- [ ] Tagline: "Uniformes personalizados desde 2006"
- [ ] Botão tema no canto direito
- [ ] Header fixo no topo

### Tab Bar Inferior
- [ ] 4 tabs visíveis:
  - [ ] 🏠 Produtos
  - [ ] 🧵 Categorias
  - [ ] 🏢 Empresa
  - [ ] 📞 Contato
- [ ] Tab ativa tem cor laranja
- [ ] Clique em cada tab navega corretamente
- [ ] Fixo no bottom (não some ao rolar)

### Layout Mobile
- [ ] Hero NÃO aparece
- [ ] Produtos aparecem primeiro
- [ ] Grid 1 coluna
- [ ] Cards ocupam largura total
- [ ] Categorias grid 1 coluna
- [ ] Footer tem margin-bottom (espaço para tab bar)

---

## 🎨 Testes de Tema

### Modo Light (Padrão)
- [ ] Fundo branco
- [ ] Texto escuro
- [ ] Cards fundo claro (#f8f9fa)
- [ ] Ícone do botão: 🌙

### Modo Dark
- [ ] Fundo escuro (#0d0d0d)
- [ ] Texto claro
- [ ] Cards fundo escuro (#1a1a1a)
- [ ] Ícone do botão: ☀️
- [ ] Transição suave entre modos

### Persistência
- [ ] Alterna tema
- [ ] Recarrega página
- [ ] Tema permanece (localStorage)

---

## 📦 Testes de Modal de Produto

### Abertura
- [ ] Clique em produto abre modal
- [ ] Overlay escuro aparece
- [ ] Modal centralizado
- [ ] Botão X no canto superior direito
- [ ] Imagem do produto aparece
- [ ] Nome e categoria corretos

### Formulário
- [ ] Todos os campos visíveis:
  - [ ] Nome *
  - [ ] Empresa *
  - [ ] CNPJ
  - [ ] WhatsApp *
  - [ ] E-mail *
  - [ ] Quantidade *
  - [ ] Observações
- [ ] Máscaras funcionam:
  - [ ] CNPJ: 00.000.000/0000-00
  - [ ] WhatsApp: (00) 00000-0000
- [ ] Campos obrigatórios marcados com *

### Envio
- [ ] Preenche formulário
- [ ] Clica "Enviar Pedido"
- [ ] Botão mostra "Enviando..."
- [ ] Requisição enviada para webhook
- [ ] Mensagem de sucesso aparece
- [ ] Modal fecha automaticamente (3 segundos)

### Botão WhatsApp
- [ ] Clique abre WhatsApp Web
- [ ] Mensagem pré-preenchida
- [ ] Contém nome do produto

### Fechamento
- [ ] Clique no X fecha modal
- [ ] Clique no overlay fecha modal
- [ ] ESC fecha modal
- [ ] Formulário reseta ao fechar

---

## 💬 Testes de Modal de Contato

### Abertura
- [ ] Botões "Solicitar Orçamento" abrem modal
- [ ] Hero CTA
- [ ] Seção Contato CTA
- [ ] Modal aparece corretamente

### Formulário
- [ ] Campos presentes:
  - [ ] Nome *
  - [ ] Empresa *
  - [ ] WhatsApp *
  - [ ] E-mail *
  - [ ] Mensagem
- [ ] Validação funciona

### Envio
- [ ] Envia corretamente
- [ ] Webhook recebe dados
- [ ] Tipo: "contato-geral"
- [ ] Mensagem de sucesso
- [ ] Auto-close

---

## 🌐 Testes PWA

### Instalação Desktop (Chrome)
- [ ] Ícone de instalação na barra
- [ ] Clique instala app
- [ ] App abre em janela standalone
- [ ] Sem barra de navegação do browser

### Instalação Mobile (Android/Chrome)
- [ ] Menu → "Adicionar à tela inicial"
- [ ] Ícone aparece na home screen
- [ ] Abre fullscreen
- [ ] Tab bar funciona

### Instalação iOS (Safari)
- [ ] Compartilhar → "Adicionar à Tela de Início"
- [ ] Ícone na home screen
- [ ] Abre como app

### Service Worker
- [ ] DevTools → Application → Service Workers
- [ ] Service Worker ativo
- [ ] Cache Storage presente
- [ ] Arquivos em cache

### Offline
- [ ] Acessa site online
- [ ] DevTools → Network → Offline
- [ ] Recarrega página
- [ ] Site ainda funciona (cache)
- [ ] Produtos aparecem

---

## 🔗 Testes de Navegação

### Scroll Suave
- [ ] Clique em link de menu
- [ ] Scroll suave até seção
- [ ] Tab bar atualiza (mobile)
- [ ] Menu atualiza (desktop)

### Active State
- [ ] Rola página manualmente
- [ ] Tab/menu atualiza conforme scroll
- [ ] Estado ativo correto

---

## 📊 Testes de Webhook

### Dados Enviados
- [ ] Abre DevTools → Network
- [ ] Envia formulário de produto
- [ ] Verifica requisição POST
- [ ] Payload JSON correto:
  ```json
  {
    "origem": "pwa" ou "web",
    "produto": "...",
    "categoria": "...",
    "quantidade": 100,
    "cliente": { ... },
    "observacoes": "...",
    "timestamp": "..."
  }
  ```

### Headers
- [ ] Content-Type: application/json
- [ ] Método: POST
- [ ] URL: https://webhook.fbzia.com.br/webhook/bebconfeccoes

---

## 🎯 Testes de Responsividade

### Breakpoints
- [ ] Mobile (< 768px): 1 coluna, tab bar
- [ ] Tablet (768px - 1024px): 2-3 colunas, menu top
- [ ] Desktop (> 1024px): 4 colunas, hero visível

### Dispositivos
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] iPad (768px)
- [ ] Desktop 1920px

---

## ⚡ Testes de Performance

### Carregamento
- [ ] Página carrega em < 3 segundos
- [ ] Imagens com lazy loading
- [ ] Service Worker ativo
- [ ] Cache funciona

### Lighthouse (DevTools)
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] PWA = 100

---

## 🐛 Testes de Erros

### Webhook Offline
- [ ] Webhook indisponível
- [ ] Alert de erro aparece
- [ ] Mensagem clara
- [ ] Formulário não reseta

### Imagem Ausente
- [ ] Remove imagem de produto
- [ ] Placeholder ou fallback
- [ ] Não quebra layout

### JavaScript Desabilitado
- [ ] HTML básico visível
- [ ] Conteúdo acessível
- [ ] Formulários funcionam

---

## ✅ Checklist Final

- [ ] Todos os testes passaram
- [ ] Sem erros no console
- [ ] Sem warnings no console
- [ ] Número WhatsApp atualizado
- [ ] Webhook funcionando
- [ ] PWA instalável
- [ ] Funciona offline
- [ ] Modo dark/claro OK
- [ ] Responsivo OK
- [ ] Pronto para deploy

---

## 📝 Notas

- Use DevTools para debug
- Console.log ativo para monitoramento
- Network tab mostra requisições
- Application tab mostra PWA status

---

**Status:** [ ] Todos os testes concluídos
**Data:** ___/___/2025
**Testado por:** ______________
