// ==================== Config ====================
const CONFIG = {
    webhookURL: 'https://webhook.fbzia.com.br/webhook/bebconfeccoes',
    whatsappNumber: '5511999999999', // Update with real number
};

// ==================== State ====================
let productsData = null;
let currentCategory = 'todos';
let selectedProduct = null;

// ==================== Theme Management ====================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
}

// ==================== PWA Detection ====================
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
}

function initPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.log('Service Worker registration failed', err));
    }

    // Detect PWA mode and adjust UI
    const isPWAMode = isPWA();
    console.log('PWA Mode:', isPWAMode);

    // Add class to body for CSS targeting
    if (isPWAMode) {
        document.body.classList.add('pwa-mode');
    }
}

// ==================== Products Loading ====================
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        productsData = await response.json();
        renderCategories();
        renderFilterTabs();
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// ==================== Render Categories ====================
function renderCategories() {
    const grid = document.getElementById('categoriasGrid');
    if (!grid || !productsData) return;

    const categoryIcons = {
        'camisetas-polos': '👕',
        'jaquetas-moletons': '🧥',
        'uniformes-profissionais': '👔',
        'uniformes-escolares': '🎓'
    };

    grid.innerHTML = productsData.categorias.map(cat => `
        <div class="categoria-card" onclick="filterByCategory('${cat.id}')">
            <div class="categoria-icon">${categoryIcons[cat.id] || '📦'}</div>
            <h3>${cat.nome}</h3>
            <p>${cat.descricao}</p>
        </div>
    `).join('');
}

// ==================== Render Filter Tabs ====================
function renderFilterTabs() {
    const container = document.getElementById('filterTabs');
    if (!container || !productsData) return;

    const tabs = [
        { id: 'todos', label: 'Todos' },
        ...productsData.categorias.map(cat => ({
            id: cat.id,
            label: cat.nome
        }))
    ];

    container.innerHTML = tabs.map(tab => `
        <button
            class="filter-tab ${tab.id === currentCategory ? 'active' : ''}"
            data-category="${tab.id}"
            onclick="filterByCategory('${tab.id}')"
        >
            ${tab.label}
        </button>
    `).join('');
}

// ==================== Render Products ====================
function renderProducts(categoryId = 'todos') {
    const grid = document.getElementById('produtosGrid');
    if (!grid || !productsData) return;

    let allProducts = [];

    if (categoryId === 'todos') {
        productsData.categorias.forEach(cat => {
            allProducts = allProducts.concat(cat.produtos);
        });
    } else {
        const category = productsData.categorias.find(cat => cat.id === categoryId);
        if (category) {
            allProducts = category.produtos;
        }
    }

    grid.innerHTML = allProducts.map(product => `
        <div class="product-card" onclick='openProductModal(${JSON.stringify(product).replace(/'/g, "&apos;")})'>
            <div class="product-image-container">
                <img src="${product.imagem}" alt="${product.nome}" class="product-image" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-category">${product.categoria}</p>
                <button class="product-cta">Solicitar Orçamento</button>
            </div>
        </div>
    `).join('');
}

// ==================== Filter Products ====================
function filterByCategory(categoryId) {
    currentCategory = categoryId;
    renderProducts(categoryId);

    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === categoryId);
    });

    // Scroll to products
    scrollToSection('produtos');
}

// ==================== Modal Management ====================
function openProductModal(product) {
    selectedProduct = product;
    const modal = document.getElementById('productModal');

    document.getElementById('modalProductImage').src = product.imagem;
    document.getElementById('modalProductImage').alt = product.nome;
    document.getElementById('modalProductName').textContent = product.nome;
    document.getElementById('modalProductCategory').textContent = product.categoria;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form
    document.getElementById('productForm').reset();
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('productForm').classList.remove('hidden');
}

function openContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form
    document.getElementById('contactForm').reset();
    document.getElementById('contactSuccessMessage').classList.add('hidden');
    document.getElementById('contactForm').classList.remove('hidden');
}

// ==================== Form Submission ====================
async function handleProductFormSubmit(e) {
    e.preventDefault();

    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Show loading
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    submitBtn.disabled = true;

    const formData = {
        origem: isPWA() ? 'pwa' : 'web',
        produto: selectedProduct.nome,
        categoria: selectedProduct.categoria,
        quantidade: parseInt(document.getElementById('formQuantidade').value),
        cliente: {
            nome: document.getElementById('formNome').value,
            empresa: document.getElementById('formEmpresa').value,
            cnpj: document.getElementById('formCNPJ').value,
            whatsapp: document.getElementById('formWhatsApp').value,
            email: document.getElementById('formEmail').value
        },
        observacoes: document.getElementById('formDescricao').value,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(CONFIG.webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Show success message
            document.getElementById('productForm').classList.add('hidden');
            document.getElementById('successMessage').classList.remove('hidden');

            // Auto close after 3 seconds
            setTimeout(() => {
                closeModal();
            }, 3000);
        } else {
            throw new Error('Failed to submit');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Erro ao enviar pedido. Por favor, tente novamente ou entre em contato pelo WhatsApp.');
    } finally {
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

async function handleContactFormSubmit(e) {
    e.preventDefault();

    const btnText = document.getElementById('contactBtnText');
    const btnLoading = document.getElementById('contactBtnLoading');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Show loading
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    submitBtn.disabled = true;

    const formData = {
        origem: isPWA() ? 'pwa' : 'web',
        tipo: 'contato-geral',
        cliente: {
            nome: document.getElementById('contactNome').value,
            empresa: document.getElementById('contactEmpresa').value,
            whatsapp: document.getElementById('contactWhatsApp').value,
            email: document.getElementById('contactEmail').value
        },
        mensagem: document.getElementById('contactMensagem').value,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(CONFIG.webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Show success message
            document.getElementById('contactForm').classList.add('hidden');
            document.getElementById('contactSuccessMessage').classList.remove('hidden');

            // Auto close after 3 seconds
            setTimeout(() => {
                closeContactModal();
            }, 3000);
        } else {
            throw new Error('Failed to submit');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.');
    } finally {
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

// ==================== WhatsApp ====================
function openWhatsApp() {
    if (!selectedProduct) return;

    const message = encodeURIComponent(
        `Olá! Gostaria de solicitar um orçamento para:\n\n` +
        `Produto: ${selectedProduct.nome}\n` +
        `Categoria: ${selectedProduct.categoria}\n\n` +
        `Aguardo retorno!`
    );

    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${message}`, '_blank');
}

function openWhatsAppDirect() {
    const message = encodeURIComponent(
        `Olá! Gostaria de solicitar um orçamento de uniformes.\n\n` +
        `Aguardo retorno!`
    );

    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${message}`, '_blank');
}

// ==================== Navigation ====================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateActiveTab() {
    const sections = ['produtos', 'categorias', 'empresa', 'contato'];
    const tabItems = document.querySelectorAll('.tab-item');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = 'produtos';

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                currentSection = sectionId;
            }
        }
    });

    // Update tab bar
    tabItems.forEach(item => {
        item.classList.toggle('active', item.dataset.tab === currentSection);
    });

    // Update nav links
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const sectionId = href.replace('#', '');
            link.classList.toggle('active', sectionId === currentSection);
        }
    });
}

// ==================== Input Masks ====================
function maskCNPJ(value) {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
}

function maskPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
}

function setupInputMasks() {
    // CNPJ masks
    const cnpjInputs = document.querySelectorAll('#formCNPJ');
    cnpjInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = maskCNPJ(e.target.value);
        });
    });

    // Phone masks
    const phoneInputs = document.querySelectorAll('#formWhatsApp, #contactWhatsApp');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    });
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();

    // Initialize PWA
    initPWA();

    // Load products
    loadProducts();

    // Setup input masks
    setupInputMasks();

    // Event Listeners
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    document.getElementById('themeToggleMobile')?.addEventListener('click', toggleTheme);
    document.getElementById('productForm')?.addEventListener('submit', handleProductFormSubmit);
    document.getElementById('contactForm')?.addEventListener('submit', handleContactFormSubmit);

    // Tab bar navigation
    document.querySelectorAll('.tab-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            scrollToSection(tab);
        });
    });

    // Desktop nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) {
                const sectionId = href.replace('#', '');
                scrollToSection(sectionId);
            }
        });
    });

    // Scroll listener for active tab
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveTab, 100);
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeContactModal();
        }
    });

    console.log('B&B Confecções PWA initialized');
});

// ==================== Install Prompt ====================
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Could show a custom install button here
    console.log('PWA install prompt available');
});

window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
});
