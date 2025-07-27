document.addEventListener('DOMContentLoaded', () => {
    // Esconde a tela de carregamento após a página carregar
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500); // Tempo para a transição terminar
    }

    // Adiciona efeito LED ao rolar a página para o header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Ativa o LED no link de Início por padrão ao carregar
    // E adiciona listener para atualizar o link ativo ao rolar
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section'); // Seleciona todas as suas seções

    const activateNavLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight; // Ajusta pela altura do header
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(current)) {
                link.classList.add('active');
            }
        });
    };

    // Ativa o link de Início por padrão
    const homeLink = document.querySelector('.nav-link[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }

    // Adiciona listener para a rolagem ativar o link correto
    window.addEventListener('scroll', activateNavLink);
    // Ativa ao carregar (para garantir que a seção inicial seja marcada)
    activateNavLink();

    // Inicializa a exibição do carrinho (vazio ao carregar a página)
    updateCartDisplay();
});


// Funções de Navegação e Interatividade
function toggleSearch() {
    const searchOverlay = document.getElementById('search-overlay');
    searchOverlay.classList.toggle('active');
    if (searchOverlay.classList.contains('active')) {
        document.querySelector('.search-input').focus();
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.add('active');
    document.body.classList.add('no-scroll'); // Previne rolagem do corpo
}

function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    // Adicionar/remover classe para ícone do menu caso necessário
}

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    // A classe 'active' para os links da navbar agora é gerenciada por 'activateNavLink' no evento scroll.
    // Isso garante que mesmo se o usuário rolar, o link correto será ativado.
}

// Funções do Carrinho de Compras
let cart = [];

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    let total = 0;

    cartItemsContainer.innerHTML = ''; // Limpa o carrinho atual

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio.</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <span>${item.name}</span>
                <span>R$ ${item.price.toFixed(2)}</span>
                <button class="remove-item-btn" onclick="removeFromCart(${index})"><i class="fas fa-times"></i></button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
            total += item.price;
        });
    }

    cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
    updateCartCount();
}

function addToCart(productName, productPrice, productId) {
    cart.push({ id: productId, name: productName, price: productPrice });
    updateCartDisplay();
    alert(`${productName} adicionado ao carrinho!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function buyNow(productName, productPrice) {
    alert(`Comprar Agora: ${productName} por R$ ${productPrice.toFixed(2)}`);
    // Aqui você integraria com um gateway de pagamento real
}

// Funções do Quick View
function quickView(productId) {
    const modal = document.getElementById('quick-view-modal');
    const modalDetails = document.getElementById('quick-view-details');

    // Simular carregamento de detalhes do produto
    let productDetails = {};
    if (productId === 'ecobag-classica') {
        productDetails = {
            name: 'Ecobag Clássica',
            description: 'Uma ecobag resistente e elegante, perfeita para suas compras e uso diário. Feita com fio 100% algodão, possui um acabamento impecável, sendo sustentável, resistente e lavável. Design prático e consciente.',
            price: 'R$ 45,00',
            installments: '3x de R$ 15,00',
            image: '<i class="fas fa-shopping-bag"></i>', // Placeholder para imagem real
            category: 'Ecobags',
            features: ['Sustentável', 'Resistente', 'Lavável']
        };
    } else if (productId === 'ecobag-deluxe') {
        productDetails = {
            name: 'Ecobag Deluxe',
            description: 'Nossa ecobag mais sofisticada, com detalhes especiais e alças reforçadas para maior durabilidade. Possui acabamento cuidadoso e um design elegante que se destaca. Ideal para quem busca exclusividade e praticidade.',
            price: 'R$ 75,00',
            installments: '5x de R$ 15,00',
            image: '<i class="fas fa-leaf"></i>',
            category: 'Ecobags',
            features: ['Exclusiva', 'Reforçada', 'Elegante']
        };
    } else if (productId === 'mini-classica') {
        productDetails = {
            name: 'Mini Bag Crochê Clássica',
            description: 'Bolsinha pequena e elegante, ideal para festas e eventos especiais. Seu design sofisticado e detalhes únicos a tornam uma peça versátil e compacta, perfeita para carregar o essencial com muito estilo.',
            price: 'R$ 35,00',
            installments: '2x de R$ 17,50',
            image: '<i class="fas fa-gem"></i>',
            category: 'Mini Bags',
            features: ['Elegante', 'Compacta', 'Versátil']
        };
    } else if (productId === 'mini-luxo') {
        productDetails = {
            name: 'Mini Bag Crochê Luxo',
            description: 'Nossa mini bag mais exclusiva, com acabamento refinado, forro interno e detalhes únicos que a destacam. Uma peça de luxo, edição limitada, feita para ocasiões especiais, adicionando um toque de sofisticação ao seu look.',
            price: 'R$ 85,00',
            installments: '5x de R$ 17,00',
            image: '<i class="fas fa-crown"></i>',
            category: 'Mini Bags',
            features: ['Luxo', 'Exclusiva', 'Detalhes Únicos']
        };
    } else {
        modalDetails.innerHTML = '<p>Produto não encontrado.</p>';
        modal.classList.add('active');
        return;
    }

    modalDetails.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-image">
                ${productDetails.image}
            </div>
            <div class="product-modal-info">
                <span class="product-modal-category">${productDetails.category}</span>
                <h3>${productDetails.name}</h3>
                <p>${productDetails.description}</p>
                <div class="product-modal-features">
                    ${productDetails.features.map(f => `<span>${f}</span>`).join('')}
                </div>
                <div class="product-modal-price">
                    <span class="price-current">${productDetails.price}</span>
                    <span class="price-installment">${productDetails.installments}</span>
                </div>
                <button class="add-to-cart-btn led-btn-warm" onclick="addToCart('${productDetails.name}', parseFloat('${productDetails.price.replace('R$', '').replace(',', '.').trim()}'), '${productId}')">
                    Adicionar ao Carrinho <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `;
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
}


// Funções de Filtragem de Produtos
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => button.classList.remove('active'));
    document.querySelector(`.filter-btn[data-filter="${category}"]`).classList.add('active');

    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block'; // Ou 'flex', 'grid' dependendo do seu CSS
        } else {
            card.style.display = 'none';
        }
    });
}

function loadMoreProducts() {
    // Implementar lógica para carregar mais produtos (ex: de uma API ou array)
    alert('Função para carregar mais produtos em desenvolvimento!');
}

function toggleWishlist(button) {
    button.querySelector('i').classList.toggle('far');
    button.querySelector('i').classList.toggle('fas');
    button.querySelector('i').classList.toggle('fa-heart');
    button.classList.toggle('wishlisted');
}

function openCustomization() {
    alert('Funcionalidade de Personalização em breve!');
    // Redirecionar para uma página de personalização ou abrir outro modal complexo
}


// --- Função para Newsletter ---
function subscribeNewsletter() {
    // Corrigido para o ID 'newsletterEmail' do HTML
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();

    if (email && validateEmail(email)) {
        // Simulação de envio do e-mail para um serviço externo
        // EM UM SITE REAL NO GITHUB PAGES, VOCÊ PRECISA DE UM SERVIÇO DE BACKEND.
        // Exemplos: Formspree, Netlify Forms, ou uma API própria.

        // Por enquanto, faremos uma simulação simples de sucesso/falha.
        // Em um cenário real, você faria uma requisição Fetch/Ajax para um endpoint.

        console.log(`E-mail para newsletter: ${email}`);
        alert('Obrigado por se inscrever! Você receberá nossas novidades em breve.');
        emailInput.value = ''; // Limpa o campo após a inscrição
    } else {
        alert('Por favor, insira um e-mail válido.');
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}