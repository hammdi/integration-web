
import medications from './data.js';

// État de l'application
const state = {
    currentView: 'grid', // 'grid' ou 'list'
    currentPage: 1,
    itemsPerPage: 4,
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    compareList: JSON.parse(localStorage.getItem('compareList')) || [],
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
const productCount = document.getElementById('product-count').querySelector('span');
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
    
    // Mettre à jour le compteur de produits
    updateProductCount();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Changement de vue (grille/liste)
    gridViewBtn.addEventListener('click', () => {
        state.currentView = 'grid';
        updateViewButtons();
        renderProducts();
    });
    
    listViewBtn.addEventListener('click', () => {
        state.currentView = 'list';
        updateViewButtons();
        renderProducts();
    });
    
    // Tri
    sortSelect.addEventListener('change', () => {
        state.sortBy = sortSelect.value;
        renderProducts();
    });
    
    // Recherche
    searchInput.addEventListener('input', () => {
        state.filters.search = searchInput.value.toLowerCase();
        state.currentPage = 1;
        renderProducts();
        updatePagination();
    });
    
    // Filtre de prix
    priceRange.addEventListener('input', () => {
        state.filters.priceRange[1] = parseInt(priceRange.value);
        priceMax.textContent = priceRange.value + " TND";
        renderProducts();
    });
    
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
    prevPageBtn.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderProducts();
            updatePagination();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const filteredProducts = getFilteredProducts();
        const totalPages = Math.ceil(filteredProducts.length / state.itemsPerPage);
        
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderProducts();
            updatePagination();
        }
    });
    
    prevPageBottomBtn.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderProducts();
            updatePagination();
        }
    });
    
    nextPageBottomBtn.addEventListener('click', () => {
        const filteredProducts = getFilteredProducts();
        const totalPages = Math.ceil(filteredProducts.length / state.itemsPerPage);
        
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderProducts();
            updatePagination();
        }
    });
    
    // Boutons de page
    document.querySelectorAll('[data-page]').forEach(button => {
        button.addEventListener('click', () => {
            state.currentPage = parseInt(button.dataset.page);
            renderProducts();
            updatePagination();
        });
    });
    
    // Favoris
    favoritesBtn.addEventListener('click', () => {
        state.showFavoritesPage = true;
        renderFavoritesPage();
    });
    
    // Boutons de fonctionnalité
    scanBtn.addEventListener('click', () => {
        alert('Fonctionnalité de scan d\'ordonnance en développement');
    });
    
    voiceBtn.addEventListener('click', () => {
        alert('Mode aide vocal avec AI en développement');
    });
    
    compareBtn.addEventListener('click', () => {
        if (state.compareList.length === 0) {
            alert('Aucun produit à comparer. Veuillez ajouter des produits à la liste de comparaison.');
        } else {
            alert(`Comparaison de ${state.compareList.length} produits en développement`);
        }
    });
}

// Mise à jour des boutons de vue
function updateViewButtons() {
    if (state.currentView === 'grid') {
        gridViewBtn.classList.remove('bg-gray-200', 'text-gray-700');
        gridViewBtn.classList.add('bg-primary', 'text-white');
        listViewBtn.classList.remove('bg-primary', 'text-white');
        listViewBtn.classList.add('bg-gray-200', 'text-gray-700');
        
        // Mettre à jour la classe du conteneur de produits
        productList.classList.remove('flex', 'flex-col');
        productList.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6');
    } else {
        listViewBtn.classList.remove('bg-gray-200', 'text-gray-700');
        listViewBtn.classList.add('bg-primary', 'text-white');
        gridViewBtn.classList.remove('bg-primary', 'text-white');
        gridViewBtn.classList.add('bg-gray-200', 'text-gray-700');
        
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
    const filteredProducts = getFilteredProducts();
    productCount.textContent = filteredProducts.length;
}

// Mise à jour de la pagination
function updatePagination() {
    const filteredProducts = getFilteredProducts();
    const totalPages = Math.ceil(filteredProducts.length / state.itemsPerPage);
    
    // Désactiver/activer les boutons précédent/suivant
    prevPageBtn.disabled = state.currentPage === 1;
    nextPageBtn.disabled = state.currentPage === totalPages;
    prevPageBottomBtn.disabled = state.currentPage === 1;
    nextPageBottomBtn.disabled = state.currentPage === totalPages;
    
    // Mettre à jour les styles des boutons de page
    document.querySelectorAll('[data-page]').forEach(button => {
        const page = parseInt(button.dataset.page);
        
        if (page === state.currentPage) {
            button.classList.remove('bg-gray-200', 'text-gray-700');
            button.classList.add('bg-primary', 'text-white');
        } else {
            button.classList.remove('bg-primary', 'text-white');
            button.classList.add('bg-gray-200', 'text-gray-700');
        }
    });
}

// Rendu des produits
function renderProducts() {
    if (state.showFavoritesPage) {
        renderFavoritesPage();
        return;
    }
    
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
            alert(`${product.name} ajouté au panier`);
        });
        
        const addToFavoritesBtn = clone.querySelector('.add-to-favorites');
        addToFavoritesBtn.addEventListener('click', () => {
            toggleFavorite(product.id);
        });
        
        const viewDetailsBtn = clone.querySelector('.view-details');
        viewDetailsBtn.addEventListener('click', () => {
            alert(`Détails de ${product.name}`);
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

// Rendu de la page des favoris
function renderFavoritesPage() {
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
                    alert(`${product.name} ajouté au panier`);
                });
                
                const addToFavoritesBtn = productClone.querySelector('.add-to-favorites');
                addToFavoritesBtn.textContent = 'Retirer des favoris';
                addToFavoritesBtn.addEventListener('click', () => {
                    toggleFavorite(product.id);
                    renderFavoritesPage();
                });
                
                const viewDetailsBtn = productClone.querySelector('.view-details');
                viewDetailsBtn.addEventListener('click', () => {
                    alert(`Détails de ${product.name}`);
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

// Initialiser l'application
document.addEventListener('DOMContentLoaded', init);
