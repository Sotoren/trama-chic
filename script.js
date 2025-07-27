document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 800); // Esconde a tela de carregamento após 0.8 segundos
    });

    // 2. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            // Fechar menu mobile se estiver aberto
            const navLinks = document.querySelector('.nav-links');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Função para scroll suave por section id (usada pelos botões CTA)
    window.scrollToSection = function(sectionId) {
        document.getElementById(sectionId).scrollIntoView({
            behavior: 'smooth'
        });
    }

    // 3. Header Actions (Search, Cart, Mobile Menu)
    const searchOverlay = document.getElementById('search-overlay');
    window.toggleSearch = function() {
        searchOverlay.classList.toggle('active');
        if (searchOverlay.classList.contains('active')) {
            document.querySelector('.search-input').focus();
        }
    }

    const cartSidebar = document.getElementById('cart-sidebar');
    window.openCart = function() {
        cartSidebar.classList.add('open');
    }
    window.closeCart = function() {
        cartSidebar.classList.remove('open');
    }
    // Fechar carrinho ao clicar fora dele
    document.addEventListener('click', (event) => {
        if (!cartSidebar.contains(event.target) && !document.querySelector('.cart-btn').contains(event.target) && cartSidebar.classList.contains('open')) {
            closeCart();
        }
    });


    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    window.toggleMobileMenu = function() {
        navLinks.classList.toggle('active');
    }

    // 4. Product Filtering
    window.filterProducts = function(category) {
        const productCards = document.querySelectorAll('.product-card');
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Remover 'active' de todos os botões e adicionar ao clicado
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.filter-btn[data-filter="${category}"]`).classList.add('active');

        productCards.forEach(card => {
            const cardCategories = card.dataset.category.split(' '); // Pode ter múltiplas categorias
            if (category === 'all' || cardCategories.includes(category)) {
                card.style.display = 'flex'; // Exibe o cartão
            } else {
                card.style.display = 'none'; // Esconde o cartão
            }
        });
    };

    // Aplicar filtro "Todos" ao carregar a página
    filterProducts('all');

    // 5. Product Actions (Add to Cart, Buy Now, Quick View, Wishlist)
    let cart = []; // Array para armazenar os itens do carrinho

    window.addToCart = function(productName, price, productId) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, name: productName, price: price, quantity: 1 });
        }
        updateCartDisplay();
        showNotification(`${productName} adicionado ao carrinho!`);
        
        // Efeito Ripple no botão
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - (button.getBoundingClientRect().left + radius)}px`;
        circle.style.top = `${event.clientY - (button.getBoundingClientRect().top + radius)}px`;
        circle.classList.add('btn-ripple');
        button.appendChild(circle);

        circle.addEventListener('animationend', () => {
            circle.remove();
        });
    };

    window.buyNow = function(productName, price) {
        // Implementar lógica de "Comprar Agora" (ex: redirecionar para checkout com o item)
        console.log(`Comprar agora: ${productName} - R$ ${price.toFixed(2)}`);
        showNotification(`Comprando agora: ${productName}`);
        // Em um site real, você redirecionaria para a página de checkout
    };

    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCountBadge = document.querySelector('.cart-count');
    const emptyCartMessage = document.querySelector('.empty-cart-message');

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Limpa os itens existentes
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="cart-item-image">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div class="cart-item-details">
                        <h5>${item.name}</h5>
                        <p>Qtd: ${item.quantity}</p>
                    </div>
                    <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-from-cart-btn" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }
        
        cartTotalSpan.textContent = `R$ ${total.toFixed(2)}`;
        cartCountBadge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
        showNotification('Item removido do carrinho.');
    };

    window.toggleWishlist = function(buttonElement) {
        buttonElement.classList.toggle('active');
        const icon = buttonElement.querySelector('i');
        if (buttonElement.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = 'var(--primary-color)';
            showNotification('Adicionado à lista de desejos!');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = ''; // Volta à cor padrão do CSS
            showNotification('Removido da lista de desejos.');
        }
    };

    // Quick View Modal
    const quickViewModal = document.getElementById('quick-view-modal');
    const quickViewDetails = document.getElementById('quick-view-details');
    
    window.quickView = function(productId) {
        // Simular carregamento de dados do produto
        let productData = {
            'ecobag-classica': {
                name: 'Ecobag Clássica',
                description: 'Esta é uma descrição detalhada da Ecobag Clássica. Feita com materiais sustentáveis, design elegante e super resistente para o dia a dia. Perfeita para quem busca estilo e consciência ambiental.',
                price: 'R$ 45,00',
                features: ['Sustentável', 'Resistente', 'Lavável', 'Design Clássico'],
                imageIcon: '<i class="fas fa-shopping-bag"></i>'
            },
            'ecobag-deluxe': {
                name: 'Ecobag Deluxe',
                description: 'A Ecobag Deluxe eleva o nível da sustentabilidade com um toque de exclusividade. Alças reforçadas, acabamento artesanal impecável e um compartimento interno secreto. Ideal para quem não abre mão de qualidade e elegância.',
                price: 'R$ 75,00',
                features: ['Exclusiva', 'Reforçada', 'Elegante', 'Acabamento Artesanal'],
                imageIcon: '<i class="fas fa-leaf"></i>'
            },
            'mini-classica': {
                name: 'Mini Bag Crochê Clássica',
                description: 'Uma mini bag encantadora para ocasiões especiais. Seu design compacto e elegante é perfeito para carregar o essencial com muito charme. Cada ponto é feito com delicadeza e precisão.',
                price: 'R$ 35,00',
                features: ['Elegante', 'Compacta', 'Versátil', 'Feita à Mão'],
                imageIcon: '<i class="fas fa-gem"></i>'
            },
            'mini-luxo': {
                name: 'Mini Bag Crochê Luxo',
                description: 'Nossa mini bag mais exclusiva com acabamento refinado, detalhes especiais e forro interno. Esta peça é uma verdadeira joia artesanal. Ideal para eventos e momentos inesquecíveis.',
                price: 'R$ 85,00',
                features: ['Luxo', 'Exclusiva', 'Detalhes Únicos', 'Design Sofisticado'],
                imageIcon: '<i class="fas fa-crown"></i>'
            }
        };

        const product = productData[productId];

        if (product) {
            quickViewDetails.innerHTML = `
                <div class="quick-view-header">
                    <div class="quick-view-image-placeholder">${product.imageIcon}</div>
                    <h4 class="text-glow">${product.name}</h4>
                </div>
                <p>${product.description}</p>
                <div class="product-features quick-view-features">
                    ${product.features.map(f => `<span class="feature">${f}</span>`).join('')}
                </div>
                <div class="product-price quick-view-price">
                    <span class="price-current">${product.price}</span>
                    <span class="price-installment">em até ${product.price.includes('45,00') ? '3x' : product.price.includes('75,00') ? '5x' : product.price.includes('35,00') ? '2x' : '5x'} R$ ${(parseFloat(product.price.replace('R$', '').replace(',', '.')) / (product.price.includes('45,00') ? 3 : product.price.includes('75,00') ? 5 : product.price.includes('35,00') ? 2 : 5)).toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="add-to-cart-btn led-btn-warm" onclick="addToCart('${product.name}', ${parseFloat(product.price.replace('R$', '').replace(',', '.'))}, '${productId}'); closeQuickView();">
                    <span>Adicionar ao Carrinho</span>
                    <i class="fas fa-shopping-cart"></i>
                    <div class="btn-ripple"></div>
                </button>
            `;
            quickViewModal.classList.add('open');
        } else {
            quickViewDetails.innerHTML = `<h4>Produto não encontrado.</h4>`;
            quickViewModal.classList.add('open');
        }
    };

    window.closeQuickView = function() {
        quickViewModal.classList.remove('open');
    };

    // Fechar modal ao clicar fora do conteúdo
    quickViewModal.addEventListener('click', (event) => {
        if (event.target === quickViewModal) {
            closeQuickView();
        }
    });

    // 6. Load More Products (Exemplo simples: em um site real, você carregaria de um servidor)
    window.loadMoreProducts = function() {
        // Aqui você adicionaria lógica para carregar mais produtos dinamicamente.
        // Por exemplo, fazer uma requisição AJAX para um backend.
        // Para este exemplo, apenas uma notificação:
        showNotification('Buscando mais produtos... (Funcionalidade de exemplo)');
        // Você poderia adicionar mais HTML de produtos aqui programaticamente
    };

    // Função de Notificação (Toast)
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('app-notification');
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(notification);

        // Força o reflow para a transição funcionar
        void notification.offsetWidth; 
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
        }, 3000); // Remove a notificação após 3 segundos
    }
});