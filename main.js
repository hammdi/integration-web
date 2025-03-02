import medications from './data.js';

// État de l'application
const state = {
    currentView: 'grid', // 'grid' ou 'list'
    currentPage: 1,
    itemsPerPage: 4,
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    compareList: JSON.parse(localStorage.getItem('compareList')) || [],
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    filters: {
        search: '',
        priceRange: [0, 500],
        categories: [],
        laboratories: [],
        forms: [],
        administrations: [],
        origins: [],
        availabilities: []
    },
    sortBy: 'name', // 'name', 'price', 'stock'
    showFavoritesPage: false
};

// Éléments DOM
const productList = document.getElementById('product-list');
const productCountElement = document.getElementById('product-count'); // Get the element
const productCount = productCountElement ? productCountElement.querySelector('span') : null; // Check if it exists
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const sortSelect = document.getElementById('sort');
const searchInput = document.getElementById('search-input');
const priceRange = document.getElementById('price-range');
const priceMin = document.getElementById('price-min');
const priceMax = document.getElementById('price-max');
const favoritesBtn = document.getElementById('favorites-btn');
const compareBtn = document.getElementById('compare-btn');
const scanBtn = document.getElementById('scan-btn');
const voiceBtn = document.getElementById('voice-btn');

// Templates
const gridTemplate = document.getElementById('grid-template');
const listTemplate = document.getElementById('list-template');
const favoritesPageTemplate = document.getElementById('favorites-page');

// Pagination
const paginationTop = document.getElementById('pagination-top');
const paginationBottom = document.getElementById('pagination-bottom');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const prevPageBottomBtn = document.getElementById('prev-page-bottom');
const nextPageBottomBtn = document.getElementById('next-page-bottom');

// Filtres
const categoryFilters = document.querySelectorAll('.category-filter');
const labFilters = document.querySelectorAll('.lab-filter');
const formFilters = document.querySelectorAll('.form-filter');
const adminFilters = document.querySelectorAll('.admin-filter');
const originFilters = document.querySelectorAll('.origin-filter');
const availabilityFilters = document.querySelectorAll('.availability-filter');

// Initialisation
function init() {
    // Initialiser les écouteurs d'événements
    setupEventListeners();
    
    // Afficher les produits
    renderProducts();
    
    // Mettre à jour le compteur de produits (only if productCount exists)
    if (productCount) {
        updateProductCount();
    }
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Changement de vue (grille/liste)
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            state.currentView = 'grid';
            updateViewButtons();
            renderProducts();
        });
    }
    
    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => {
            state.currentView = 'list';
            updateViewButtons();
            renderProducts();
        });
    }
    
    // Tri
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            state.sortBy = sortSelect.value;
            renderProducts();
        });
    }
    
    // Recherche
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            state.filters.search = searchInput.value.toLowerCase();
            state.currentPage = 1;
            renderProducts();
            updatePagination();
        });
    }
    
    // Filtre de prix
    if (priceRange) {
        priceRange.addEventListener('input', () => {
            state.filters.priceRange[1] = parseInt(priceRange.value);
            priceMax.textContent = priceRange.value + " TND";
            renderProducts();
        });
    }
    
    // Filtres de catégorie
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            updateFilterArray(filter, state.filters.categories);
            state.currentPage = 1;
            renderProducts();
            updatePagination();
        });
    });
    
    // Filtres de laboratoire
    labFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            updateFilterArray(filter, state.filters.laboratories);
            state.currentPage = 1;
            renderProducts();
            updatePagination();
        });
    });
    
    // Filtres de forme
    formFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            updateFilterArray(filter, state.filters.forms);
            state.currentPage = 1;
            renderProducts();
            updatePagination();
        });
    });
    
    // Filtres d'administration
    adminFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            updateFilterArray(filter, state.filters.administrations);
            state.currentPage = 1;
            renderProducts();
            updatePagination();
        });
    });
    
    // Filtres d'origine
    originFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            updateFilterArray(filter, state.filters.origins);
            state.currentPage = 1;
            renderProducts();
            updatePagination();
        });
    });
    
    // Filtres de disponibilité
    availabilityFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            updateFilterArray(filter, state.filters.availabilities);
            state.currentPage = 1;
            renderProducts();
            updatePagination();
        });
    });
    
    // Pagination
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (state.currentPage > 1) {
                state.currentPage--;
                renderProducts();
                updatePagination();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const filteredProducts = getFilteredProducts();
            const totalPages = Math.ceil(filteredProducts.length / state.itemsPerPage);
            
            if (state.currentPage < totalPages) {
                state.currentPage++;
                renderProducts();
                updatePagination();
            }
        });
    }
    
    if (prevPageBottomBtn) {
        prevPageBottomBtn.addEventListener('click', () => {
            if (state.currentPage > 1) {
                state.currentPage--;
                renderProducts();
                updatePagination();
            }
        });
    }
    
    if (nextPageBottomBtn) {
        nextPageBottomBtn.addEventListener('click', () => {
            const filteredProducts = getFilteredProducts();
            const totalPages = Math.ceil(filteredProducts.length / state.itemsPerPage);
            
            if (state.currentPage < totalPages) {
                state.currentPage++;
                renderProducts();
                updatePagination();
             }
        });
    }
    
    // Boutons de page
    document.querySelectorAll('[data-page]').forEach(button => {
        button.addEventListener('click', () => {
            state.currentPage = parseInt(button.dataset.page);
            renderProducts();
            updatePagination();
        });
    });
    
    // Favoris
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', () => {
            state.showFavoritesPage = true;
            renderFavoritesPage();
        });
    }
    
    // Boutons de fonctionnalité
    if (scanBtn) {
        scanBtn.addEventListener('click', () => {
            showOrdonnanceModal();
        });
    }
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            showChatbotPopup();
        });
    }
    
    // Comparaison
    if (compareBtn) {
        compareBtn.addEventListener('click', () => {
            if (state.compareList.length === 0) {
                alert('Aucun produit à comparer. Veuillez ajouter des produits à la liste de comparaison.');
            } else {
                window.location.href = 'compare.html';
            }
        });
    }
}

// Mise à jour des boutons de vue
function updateViewButtons() {
    if (state.currentView === 'grid') {
        gridViewBtn.classList.remove('text-gray-200');
        gridViewBtn.classList.add('text-black');
        listViewBtn.classList.remove('text-black');
        listViewBtn.classList.add('text-gray-200');
        
        // Mettre à jour la classe du conteneur de produits
        productList.classList.remove('flex', 'flex-col');
        productList.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6');
    } else {
        listViewBtn.classList.remove('text-gray-200');
        listViewBtn.classList.add('text-black');
        gridViewBtn.classList.remove('text-black');
        gridViewBtn.classList.add('text-gray-200');
        
        // Mettre à jour la classe du conteneur de produits
        productList.classList.remove('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6');
        productList.classList.add('flex', 'flex-col');
    }
}

// Mise à jour des tableaux de filtres
function updateFilterArray(checkbox, filterArray) {
    const value = checkbox.value;
    
    if (checkbox.checked) {
        if (!filterArray.includes(value)) {
            filterArray.push(value);
        }
    } else {
        const index = filterArray.indexOf(value);
        if (index !== -1) {
            filterArray.splice(index, 1);
        }
    }
}

// Obtenir les produits filtrés
function getFilteredProducts() {
    return medications.filter(product => {
        // Filtre de recherche
        if (state.filters.search && !product.name.toLowerCase().includes(state.filters.search) && 
            !product.description.toLowerCase().includes(state.filters.search)) {
            return false;
        }
        
        // Filtre de prix
        if (product.price < state.filters.priceRange[0] || product.price > state.filters.priceRange[1]) {
            return false;
        }
        
        // Filtre de catégorie
        if (state.filters.categories.length > 0 && !state.filters.categories.includes(product.category)) {
            return false;
        }
        
        // Filtre de laboratoire
        if (state.filters.laboratories.length > 0 && !state.filters.laboratories.includes(product.laboratory)) {
            return false;
        }
        
        // Filtre de forme
        if (state.filters.forms.length > 0 && !state.filters.forms.includes(product.form)) {
            return false;
        }
        
        // Filtre d'administration
        if (state.filters.administrations.length > 0 && !state.filters.administrations.includes(product.administration)) {
            return false;
        }
        
        // Filtre d'origine
        if (state.filters.origins.length > 0 && !state.filters.origins.includes(product.origin)) {
            return false;
        }
        
        // Filtre de disponibilité
        if (state.filters.availabilities.length > 0 && !state.filters.availabilities.includes(product.availability)) {
            return false;
        }
        
        return true;
    }).sort((a, b) => {
        // Tri
        switch (state.sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price':
                return a.price - b.price;
            case 'stock':
                return a.availability === 'En stock' ? -1 : 1;
            default:
                return 0;
        }
    });
}

// Obtenir les produits paginés
function getPaginatedProducts() {
    const filteredProducts = getFilteredProducts();
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    
    return filteredProducts.slice(startIndex, endIndex);
}

// Mise à jour du compteur de produits
function updateProductCount() {
    if (productCount) {
        const filteredProducts = getFilteredProducts();
        productCount.textContent = filteredProducts.length;
    }
}

// Mise à jour de la pagination
function updatePagination() {
    const filteredProducts = getFilteredProducts();
    const totalPages = Math.ceil(filteredProducts.length / state.itemsPerPage);
    
    // Désactiver/activer les boutons précédent/suivant
    if (prevPageBtn) {
        prevPageBtn.disabled = state.currentPage === 1;
    }
    if (nextPageBtn) {
        nextPageBtn.disabled = state.currentPage === totalPages;
    }
    if (prevPageBottomBtn) {
        prevPageBottomBtn.disabled = state.currentPage === 1;
    }
    if (nextPageBottomBtn) {
        nextPageBottomBtn.disabled = state.currentPage === totalPages;
    }
    
    // Mettre à jour les styles des boutons de page
    document.querySelectorAll('[data-page]').forEach(button => {
        const page = parseInt(button.dataset.page);
        
        if (page === state.currentPage) {
            button.classList.remove('bg-gray-50', 'text-gray-700');
            button.classList.add('bg-gray-800', 'text-white');
        } else {
            button.classList.remove('bg-gray-800', 'text-white');
            button.classList.add('bg-gray-50', 'text-gray-700');
        }
    });
}

// Rendu des produits
function renderProducts() {
    if (state.showFavoritesPage) {
        renderFavoritesPage();
        return;
    }
    
    if (productList) {
        productList.innerHTML = '';
        const paginatedProducts = getPaginatedProducts();
        
        // Mettre à jour la vue (grille ou liste)
        updateViewButtons();
        
        paginatedProducts.forEach(product => {
            const template = state.currentView === 'grid' ? gridTemplate : listTemplate;
            const clone = template.content.cloneNode(true);
            
            // Image
            const img = clone.querySelector('img');
            img.src = product.image;
            img.alt = product.name;
            
            // Nom
            clone.querySelector('.product-name').textContent = product.name;
            
            // Prix
            const priceElement = clone.querySelector('.product-price');
            if (product.oldPrice) {
                priceElement.innerHTML = `${product.price} TND <del class="text-gray-500">${product.oldPrice} TND</del>`;
            } else {
                priceElement.textContent = `${product.price} TND`;
            }
            
            // Description
            clone.querySelector('.product-description').textContent = product.description.length > 100 
                ? product.description.substring(0, 100) + '...' 
                : product.description;
            
            // Disponibilité
            const availabilityElement = clone.querySelector('.product-availability');
            availabilityElement.textContent = product.availability;
            if (product.availability === 'En stock') {
                availabilityElement.classList.add('text-green-600', 'font-semibold');
            } else {
                availabilityElement.classList.add('text-orange-500', 'font-semibold');
            }
            
            // Date d'expiration
            clone.querySelector('.product-expiry').textContent = product.expiryDate;
            
            // Boutons d'action
            const addToCartBtn = clone.querySelector('.add-to-cart');
            addToCartBtn.addEventListener('click', () => {
                addToCart(product);
                showPurchasePopup(product);
            });
            
            const addToFavoritesBtn = clone.querySelector('.add-to-favorites');
            addToFavoritesBtn.addEventListener('click', () => {
                toggleFavorite(product.id);
            });
            
            const viewDetailsBtn = clone.querySelector('.view-details');
            viewDetailsBtn.addEventListener('click', () => {
                window.location.href = `product-details.html?id=${product.id}`;
            });
            
            const compareProductBtn = clone.querySelector('.compare-product');
            compareProductBtn.addEventListener('click', () => {
                toggleCompare(product.id);
            });
            
            // Ajouter au DOM
            productList.appendChild(clone);
        });
        
        // Mettre à jour le compteur de produits
        updateProductCount();
        
        // Mettre à jour la pagination
        updatePagination();
    }
}

// Rendu de la page des favoris
function renderFavoritesPage() {
    if (productList) {
        productList.innerHTML = '';
        
        const clone = favoritesPageTemplate.content.cloneNode(true);
        const favoritesList = clone.querySelector('#favorites-list');
        const backButton = clone.querySelector('#back-to-products');
        
        backButton.addEventListener('click', () => {
            state.showFavoritesPage = false;
            renderProducts();
        });
        
        if (state.favorites.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Vous n\'avez pas encore de médicaments favoris.';
            emptyMessage.classList.add('text-gray-500', 'text-center', 'col-span-2', 'py-8');
            favoritesList.appendChild(emptyMessage);
        } else {
            state.favorites.forEach(favoriteId => {
                const product = medications.find(p => p.id === favoriteId);
                
                if (product) {
                    const template = gridTemplate;
                    const productClone = template.content.cloneNode(true);
                    
                    // Image
                    const img = productClone.querySelector('img');
                    img.src = product.image;
                    img.alt = product.name;
                    
                    // Nom
                    productClone.querySelector('.product-name').textContent = product.name;
                    
                    // Prix
                    const priceElement = productClone.querySelector('.product-price');
                    if (product.oldPrice) {
                        priceElement.innerHTML = `${product.price} TND <del class="text-gray-500">${product.oldPrice} TND</del>`;
                    } else {
                        priceElement.textContent = `${product.price} TND`;
                    }
                    
                    // Description
                    productClone.querySelector('.product-description').textContent = product.description.length > 100 
                        ? product.description.substring(0, 100) + '...' 
                        : product.description;
                    
                    // Disponibilité
                    const availabilityElement = productClone.querySelector('.product-availability');
                    availabilityElement.textContent = product.availability;
                    if (product.availability === 'En stock') {
                        availabilityElement.classList.add('text-green-600', 'font-semibold');
                    } else {
                        availabilityElement.classList.add('text-orange-500', 'font-semibold');
                    }
                    
                    // Date d'expiration
                    productClone.querySelector('.product-expiry').textContent = product.expiryDate;
                    
                    // Boutons d'action
                    const addToCartBtn = productClone.querySelector('.add-to-cart');
                    addToCartBtn.addEventListener('click', () => {
                        addToCart(product);
                        showPurchasePopup(product);
                    });
                    
                    const addToFavoritesBtn = productClone.querySelector('.add-to-favorites');
                    addToFavoritesBtn.textContent = 'Retirer des favoris';
                    addToFavoritesBtn.addEventListener('click', () => {
                        toggleFavorite(product.id);
                        renderFavoritesPage();
                    });
                    
                    const viewDetailsBtn = productClone.querySelector('.view-details');
                    viewDetailsBtn.addEventListener('click', () => {
                        window.location.href = `product-details.html?id=${product.id}`;
                    });
                    
                    const compareProductBtn = productClone.querySelector('.compare-product');
                    compareProductBtn.addEventListener('click', () => {
                        toggleCompare(product.id);
                    });
                    
                    // Ajouter au DOM
                    favoritesList.appendChild(productClone);
                }
            });
        }
        
        productList.appendChild(clone);
    }
}

// Ajouter/retirer des favoris
function toggleFavorite(productId) {
    const index = state.favorites.indexOf(productId);
    
    if (index === -1) {
        state.favorites.push(productId);
        alert('Produit ajouté aux favoris');
    } else {
        state.favorites.splice(index, 1);
        alert('Produit retiré des favoris');
    }
    
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
}

// Ajouter/retirer de la liste de comparaison
function toggleCompare(productId) {
    const index = state.compareList.indexOf(productId);
    
    if (index === -1) {
        if (state.compareList.length >= 4) {
            alert('Vous ne pouvez pas comparer plus de 4 produits à la fois');
            return;
        }
        
        state.compareList.push(productId);
        alert('Produit ajouté à la liste de comparaison');
    } else {
        state.compareList.splice(index, 1);
        alert('Produit retiré de la liste de comparaison');
    }
    
    localStorage.setItem('compareList', JSON.stringify(state.compareList));
}

// Ajouter au panier
function addToCart(product) {
    const existingItem = state.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            id: product.id,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(state.cart));
}

// Fonction pour afficher le popup de chatbot
function showChatbotPopup() {
    // Créer le popup
    const popup = document.createElement('div');

    popup.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50';
    popup.innerHTML = `
        <div class="bg-white rounded-3xl shadow-lg w-full max-w-[500px] overflow-hidden p-6">
            <!-- Conversation -->
            <div id="conversation-container" class="mb-8">
                <div class="flex items-start gap-3 mb-6">
                    <div class="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div class="bg-gray-200 rounded-2xl rounded-tl-none py-2 px-4 max-w-[80%]">
                        <p class="text-sm text-gray-700">bonsoir, comment puis je vous aider?</p>
                    </div>
                    <span class="text-xs text-gray-400 mt-2">20:38</span>
                </div>
            </div>

            <!-- Visualisation d'onde sonore -->
            <div id="wave-container" class="flex items-end justify-center gap-2 h-32 mb-8">
                <div class="bg-gray-200 w-4 h-16 rounded-sm"></div>
                <div class="bg-gray-200 w-4 h-24 rounded-sm"></div>
                <div class="bg-gray-200 w-4 h-32 rounded-sm"></div>
                <div class="bg-gray-200 w-4 h-24 rounded-sm"></div>
                <div class="bg-gray-200 w-4 h-16 rounded-sm"></div>
            </div>

            <!-- Zone de saisie -->
            <div class="flex items-center gap-2 mb-4">
                <div class="flex-1 relative">
                    <input id="chatbot-input" class="w-full py-3 px-4 pr-10 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300" 
                        type="text" placeholder="écrire un message ici ou utiliser le vocal pour interagir avec l'AI">
                    <button id="voice-btn" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </button>
                </div>
                <button id="send-message-btn" class="bg-gray-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                    Submit
                </button>
            </div>

            <!-- Bouton retour -->
            <div class="flex justify-center">
                <button id="close-chatbot-btn" class="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg w-full max-w-md hover:bg-gray-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour en arrière
                </button>
            </div>
        </div>
    `;

    // Ajouter le popup au body
    document.body.appendChild(popup);

    // Ajouter les écouteurs d'événements
    const sendMessageBtn = popup.querySelector('#send-message-btn');
    const closeChatbotBtn = popup.querySelector('#close-chatbot-btn');
    const chatbotInput = popup.querySelector('#chatbot-input');
    const voiceBtn = popup.querySelector('#voice-btn');
    const conversationContainer = popup.querySelector('#conversation-container');
    const waveContainer = popup.querySelector('#wave-container');

    // Fonction pour ajouter un message à la conversation
    function addMessage(message, isUser = false) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'flex items-start gap-3 mb-6';
        
        if (isUser) {
            // Message de l'utilisateur (aligné à droite)
            messageElement.innerHTML = `
                <span class="text-xs text-gray-400 mt-2 ml-auto">${timeString}</span>
                <div class="bg-blue-500 text-white rounded-2xl rounded-tr-none py-2 px-4 max-w-[80%] ml-auto">
                    <p class="text-sm">${message}</p>
                </div>
            `;
        } else {
            // Message du bot (aligné à gauche)
            messageElement.innerHTML = `
                <div class="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </div>
                <div class="bg-gray-200 rounded-2xl rounded-tl-none py-2 px-4 max-w-[80%]">
                    <p class="text-sm text-gray-700">${message}</p>
                </div>
                <span class="text-xs text-gray-400 mt-2">${timeString}</span>
            `;
        }
        
        conversationContainer.appendChild(messageElement);
        
        // Faire défiler vers le bas pour voir le nouveau message
        messageElement.scrollIntoView({ behavior: 'smooth' });
    }

    // Fonction pour simuler l'animation des ondes sonores
    function animateWaves(isActive = false) {
        if (isActive) {
            // Créer une animation d'ondes sonores actives
            waveContainer.innerHTML = '';
            const heights = [16, 24, 32, 40, 24, 16];
            
            // Créer l'animation
            const animateWave = () => {
                waveContainer.innerHTML = '';
                for (let i = 0; i < 5; i++) {
                    const height = Math.floor(Math.random() * 40) + 10; // Hauteur aléatoire entre 10 et 50px
                    const bar = document.createElement('div');
                    bar.className = `bg-blue-400 w-4 h-${height} rounded-sm transition-all duration-200`;
                    bar.style.height = `${height}px`;
                    waveContainer.appendChild(bar);
                }
            };
            
            // Démarrer l'animation
            const waveInterval = setInterval(animateWave, 200);
            return waveInterval;
        } else {
            // Remettre les ondes sonores statiques
            waveContainer.innerHTML = `
                <div class="bg-gray-200 w-4 h-16 rounded-sm"></div>
                <div class="bg-gray-200 w-4 h-24 rounded-sm"></div>
                <div class="bg-gray-200 w-4 h-32 rounded-sm"></div>
                <div class="bg-gray-200 w-4 h-24 rounded-sm"></div>
                <div class="bg-gray-200 w-4 h-16 rounded-sm"></div>
            `;
            return null;
        }
    }

    // Gérer l'envoi du message
    sendMessageBtn.addEventListener('click', () => {
        const message = chatbotInput.value.trim();
        if (message) {
            // Ajouter le message de l'utilisateur à la conversation
            addMessage(message, true);
            
            // Vider la zone de texte
            chatbotInput.value = '';
            
            // Simuler une réponse du bot après un court délai
            setTimeout(() => {
                addMessage("Merci pour votre message. Comment puis-je vous aider davantage?");
            }, 1000);
        } else {
            alert('Veuillez écrire un message avant d\'envoyer.');
        }
    });

    // Permettre l'envoi du message avec la touche Entrée
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessageBtn.click();
        }
    });

    // Gérer l'entrée vocale avec l'API Web Speech
    let recognition = null;
    let waveAnimation = null;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // Créer l'objet de reconnaissance vocale
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'fr-FR';
        recognition.continuous = false;
        recognition.interimResults = false;

        // Configurer les événements de reconnaissance
        recognition.onstart = function() {
            // Démarrer l'animation des ondes
            waveAnimation = animateWaves(true);
            chatbotInput.placeholder = "Parlez maintenant...";
            voiceBtn.classList.add('text-blue-500');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            chatbotInput.value = transcript;
        };

        recognition.onend = function() {
            // Arrêter l'animation des ondes
            if (waveAnimation) {
                clearInterval(waveAnimation);
                waveAnimation = null;
            }
            animateWaves(false);
            chatbotInput.placeholder = "écrire un message ici ou utiliser le vocal pour interagir avec l'AI";
            voiceBtn.classList.remove('text-blue-500');
        };

        recognition.onerror = function(event) {
            console.error('Erreur de reconnaissance vocale:', event.error);
            // Arrêter l'animation des ondes
            if (waveAnimation) {
                clearInterval(waveAnimation);
                waveAnimation = null;
            }
            animateWaves(false);
            chatbotInput.placeholder = "Erreur de reconnaissance vocale. Réessayez.";
            voiceBtn.classList.remove('text-blue-500');
        };

        // Gérer le clic sur le bouton du microphone
        voiceBtn.addEventListener('click', () => {
            if (waveAnimation) {
                // Si la reconnaissance est déjà en cours, l'arrêter
                recognition.stop();
            } else {
                // Sinon, démarrer la reconnaissance
                recognition.start();
            }
        });
    } else {
        // Le navigateur ne prend pas en charge la reconnaissance vocale
        voiceBtn.addEventListener('click', () => {
            alert('Votre navigateur ne prend pas en charge la reconnaissance vocale.');
        });
    }

    // Fermer le popup
    closeChatbotBtn.addEventListener('click', () => {
        // Arrêter la reconnaissance vocale si elle est en cours
        if (recognition && waveAnimation) {
            recognition.stop();
        }
        document.body.removeChild(popup);
    });
}

// Fonction pour afficher le modal d'ordonnance
function showOrdonnanceModal() {
    // Créer le modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';
    modal.innerHTML = `
        <div class="modal bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
            <h2 class="text-xl font-bold mb-4">Importer un fichier PDF ou image de l'ordonnance</h2>
            <p class="mb-4">Message d'acceptation des politiques de confidentialité :</p>
            <p class="text-sm text-gray-700 mb-4">En continuant à utiliser notre application, vous acceptez nos Politiques de Confidentialité. Nous nous engageons à protéger vos données personnelles et à les utiliser conformément à nos conditions. Vous pouvez consulter les détails de nos politiques <a href="#" class="text-blue-500 underline">[ici]</a>. Si vous êtes d'accord, cliquez sur "Accepter" pour continuer.</p>
            <div class="checkbox-container flex items-center mb-4">
                <input type="checkbox" id="accept-checkbox" class="mr-2">
                <label for="accept-checkbox" class="text-sm">Cliquez sur accepter avant importer</label>
            </div>
            <div class="flex justify-between">
                <button id="import-btn" class="btn btn-primary bg-gray-300 text-gray-700 px-4 py-2 rounded-md" disabled>📂 Importer</button>
                <button id="close-modal" class="btn btn-secondary bg-gray-200 text-gray-700 px-4 py-2 rounded-md">❌ Retour en arrière</button>
            </div>
        </div>
    `;

    // Ajouter le modal au body
    document.body.appendChild(modal);

    // Ajouter les écouteurs d'événements
    const acceptCheckbox = modal.querySelector('#accept-checkbox');
    const importBtn = modal.querySelector('#import-btn');
    const closeModal = modal.querySelector('#close-modal');

    // Activer/désactiver le bouton d'importation en fonction de la case à cocher
    acceptCheckbox.addEventListener('change', function() {
        importBtn.disabled = !this.checked;
        if (this.checked) {
            importBtn.classList.remove('bg-gray-300', 'text-gray-700');
            importBtn.classList.add('bg-accent', 'text-black');
        } else {
            importBtn.classList.remove('bg-accent', 'text-black');
            importBtn.classList.add('bg-gray-300', 'text-gray-700');
        }
    });

    // Gérer le clic sur le bouton d'importation
    importBtn.addEventListener('click', function() {
        window.location.href = 'ordonnance.html';
    });

    // Gérer le clic sur le bouton de fermeture
    closeModal.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
}

// Afficher le popup d'achat
function showPurchasePopup(product) {
    // Calculer le nombre total d'articles dans le panier
    const totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);
    
    // Calculer le sous-total du panier
    const subtotal = state.cart.reduce((total, item) => {
        const product = medications.find(p => p.id === item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
    
    // Frais de livraison fixes
    const shippingCost = 7.00;
    
    // Total
    const total = subtotal + shippingCost;
    
    // Créer le popup
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50';
    popup.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-[600px] overflow-hidden">
            <div class="p-6">
                <div class="flex gap-8 items-start bg-gray-50/50 rounded-xl p-4 mb-6">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="w-24 sm:w-32 object-contain">
                    <div class="flex-1 space-y-2">
                        <h2 class="font-medium text-gray-900">${product.name}</h2>
                        <p class="text-sm text-gray-500">${product.form} / ${product.expiryDate}</p>
                        <p class="font-semibold text-lg text-red-600 whitespace-nowrap">
                            ${product.price} TND
                        </p>
                    </div>
                </div>

                <!-- Updated Cart Section -->
                <div class="bg-gray-50 px-6 py-4 border-b flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 class="font-semibold text-lg text-gray-800">Votre Panier : il y a ${totalItems} article${totalItems > 1 ? 's' : ''} dans votre panier</h3>
                </div>

                <div class="space-y-3 border-t border-dashed pt-6 mb-6">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500">Sous-total</span>
                        <span class="font-medium">${subtotal.toFixed(2)} TND</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-500">Frais de livraison</span>
                        <span class="font-medium">${shippingCost.toFixed(2)} TND</span>
                    </div>
                    <div class="flex justify-between text-base pt-2 border-t">
                        <span class="font-medium">Total</span>
                        <span class="font-semibold text-lg">${total.toFixed(2)} TND</span>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button id="checkout-btn" class="flex-1 bg-accent hover:bg-primary hover:text-white text-gray-600 font-medium py-3 rounded-xl transition-colors">
                        Passer la commande
                    </button>
                    <button id="continue-shopping-btn" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-3 rounded-xl transition-colors">
                        Continuer mes achats
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter le popup au body
    document.body.appendChild(popup);
    
    // Ajouter les écouteurs d'événements
    const checkoutBtn = popup.querySelector('#checkout-btn');
    const continueShoppingBtn = popup.querySelector('#continue-shopping-btn');
    
    checkoutBtn.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
    
    continueShoppingBtn.addEventListener('click', () => {
        document.body.removeChild(popup);
    });
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', init);

// Exporter les fonctions et l'état pour les autres pages
export { state, medications };