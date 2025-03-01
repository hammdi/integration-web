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
            alert('Fonctionnalité de scan d\'ordonnance en développement');
        });
    }
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            alert('Mode aide vocal avec AI en développement');
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