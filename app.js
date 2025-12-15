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
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
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

    const isPWAMode = isPWA();
    if (isPWAMode) {
        document.body.classList.add('pwa-mode');
    }
    console.log('PWA Mode:', isPWAMode);
}

// ==================== Products Loading ====================
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        productsData = await response.json();
        renderFilterButtons();
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        showProductsError();
    }
}

function showProductsError() {
    const grid = document.querySelector('.products-grid');
    if (grid) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-2);">Erro ao carregar produtos. Por favor, recarregue a página.</p>';
    }
}

// ==================== Render Filter Buttons ====================
function renderFilterButtons() {
    const container = document.querySelector('.filter-buttons');
    if (!container || !productsData) return;

    const filters = [
        { id: 'todos', label: 'Todos os Produtos' },
        ...productsData.categorias.map(cat => ({
            id: cat.id,
            label: cat.nome
        }))
    ];

    container.innerHTML = filters.map(filter => `
        <button
            class="filter-btn ${filter.id === currentCategory ? 'active' : ''}"
            data-category="${filter.id}"
            onclick="filterByCategory('${filter.id}')"
        >
            ${filter.label}
        </button>
    `).join('');
}

// ==================== Render Products ====================
function renderProducts(categoryId = 'todos') {
    const grid = document.querySelector('.products-grid');
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

    if (allProducts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-2);">Nenhum produto encontrado nesta categoria.</p>';
        return;
    }

    grid.innerHTML = allProducts.map(product => `
        <div class="product-card" onclick='openProductModal(${JSON.stringify(product).replace(/'/g, "&apos;")})'>
            <div class="product-image">
                <img src="${product.imagem}" alt="${product.nome}" loading="lazy">
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.nome}</h3>
                <span class="product-category">${product.categoria}</span>
            </div>
        </div>
    `).join('');
}

// ==================== Filter Products ====================
function filterByCategory(categoryId) {
    currentCategory = categoryId;
    renderProducts(categoryId);

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === categoryId);
    });
}

// ==================== Modal Management ====================
function openProductModal(product) {
    selectedProduct = product;
    const modal = document.getElementById('productModal');
    if (!modal) return;

    const modalImage = modal.querySelector('.modal-product-image');
    const modalTitle = modal.querySelector('.modal-product-title');
    const modalCategory = modal.querySelector('.modal-product-category');

    if (modalImage) {
        modalImage.src = product.imagem;
        modalImage.alt = product.nome;
    }
    if (modalTitle) modalTitle.textContent = product.nome;
    if (modalCategory) modalCategory.textContent = product.categoria;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form
    const form = modal.querySelector('form');
    const successMsg = modal.querySelector('.success-message');
    const formContainer = modal.querySelector('.modal-form');

    if (form) form.reset();
    if (successMsg) successMsg.style.display = 'none';
    if (formContainer) formContainer.style.display = 'block';
}

function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form
    const form = modal.querySelector('form');
    const successMsg = modal.querySelector('.success-message');
    const formContainer = modal.querySelector('.modal-form');

    if (form) form.reset();
    if (successMsg) successMsg.style.display = 'none';
    if (formContainer) formContainer.style.display = 'block';
}

// Close modals when clicking backdrop
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
        closeProductModal();
        closeContactModal();
    }
});

// ==================== Form Submission ====================
async function handleProductFormSubmit(e) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    const formData = {
        origem: isPWA() ? 'pwa' : 'web',
        tipo: 'orcamento-produto',
        produto: selectedProduct.nome,
        categoria: selectedProduct.categoria,
        quantidade: parseInt(e.target.quantidade.value) || 1,
        cliente: {
            nome: e.target.nome.value,
            empresa: e.target.empresa?.value || '',
            cnpj: e.target.cnpj?.value || '',
            whatsapp: e.target.whatsapp.value,
            email: e.target.email?.value || ''
        },
        observacoes: e.target.observacoes?.value || '',
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
            const formContainer = e.target.closest('.modal-form');
            const successMsg = document.querySelector('#productModal .success-message');

            if (formContainer) formContainer.style.display = 'none';
            if (successMsg) successMsg.style.display = 'block';

            // Auto close after 3 seconds
            setTimeout(() => {
                closeProductModal();
            }, 3000);
        } else {
            throw new Error('Failed to submit');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Erro ao enviar pedido. Por favor, tente novamente ou entre em contato pelo WhatsApp.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleContactFormSubmit(e) {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    const formData = {
        origem: isPWA() ? 'pwa' : 'web',
        tipo: 'contato-geral',
        cliente: {
            nome: e.target.nome.value,
            empresa: e.target.empresa?.value || '',
            whatsapp: e.target.whatsapp.value,
            email: e.target.email?.value || ''
        },
        mensagem: e.target.mensagem.value,
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
            const formContainer = e.target.closest('.modal-form');
            const successMsg = document.querySelector('#contactModal .success-message');

            if (formContainer) formContainer.style.display = 'none';
            if (successMsg) successMsg.style.display = 'block';

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
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ==================== WhatsApp ====================
function openWhatsApp() {
    if (!selectedProduct) {
        openWhatsAppDirect();
        return;
    }

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
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Close mobile menu if open
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}

function updateActiveNav() {
    const sections = ['home', 'sobre', 'solucoes', 'produtos', 'contato'];
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const desktopNavLinks = document.querySelectorAll('.nav-menu a');

    let currentSection = 'home';
    let minDistance = Infinity;

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top);

            if (distance < minDistance && rect.top <= 200) {
                minDistance = distance;
                currentSection = sectionId;
            }
        }
    });

    // Update mobile nav
    mobileNavItems.forEach(item => {
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/scrollToSection\('([^']+)'\)/);
            const itemSection = match ? match[1] : null;
            item.classList.toggle('active', itemSection === currentSection);
        }
    });

    // Update desktop nav
    desktopNavLinks.forEach(link => {
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
    document.addEventListener('input', (e) => {
        if (e.target.name === 'cnpj') {
            e.target.value = maskCNPJ(e.target.value);
        }
        if (e.target.name === 'whatsapp') {
            e.target.value = maskPhone(e.target.value);
        }
    });
}

// ==================== Smooth Scroll ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const sectionId = href.replace('#', '');
                scrollToSection(sectionId);
            }
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

    // Setup smooth scroll
    initSmoothScroll();

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Product form
    const productForm = document.querySelector('#productModal form');
    if (productForm) {
        productForm.addEventListener('submit', handleProductFormSubmit);
    }

    // Contact form
    const contactForm = document.querySelector('#contactModal form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // Scroll listener for active nav
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 100);
    }, { passive: true });

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            closeContactModal();
        }
    });

    // Initial nav state
    updateActiveNav();

    console.log('B&B Confecções - Enterprise PWA initialized');
});

// ==================== Install Prompt ====================
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA install prompt available');
});

window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
});
