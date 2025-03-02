import { state, medications } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'ID du produit depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'liste.html';
        return;
    }
    
    // Trouver le produit correspondant
    const product = medications.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'liste.html';
        return;
    }
    
    // Remplir les détails du produit
    renderProductDetails(product);
    
    // Ajouter un écouteur d'événement pour le bouton de retour
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'liste.html';
        });
    }
    
    // Ajouter un écouteur d'événement pour le bouton d'ajout au panier
    const addToCartButton = document.getElementById('add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            addToCart(product);
            alert(`${product.name} ajouté au panier`);
        });
    }
    
    // Ajouter un écouteur d'événement pour le bouton d'ajout aux favoris
    const addToFavoritesButton = document.getElementById('add-to-favorites');
    if (addToFavoritesButton) {
        addToFavoritesButton.addEventListener('click', () => {
            toggleFavorite(product.id);
            updateFavoriteButton(product.id);
        });
    }
    
    // Mettre à jour l'état du bouton des favoris
    updateFavoriteButton(product.id);
});

function renderProductDetails(product) {
    // Mettre à jour le titre de la page
    document.title = `${product.name} - Détails du produit`;
    
    // Remplir les informations du produit
    const productImage = document.getElementById('product-image');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');
    const productAvailability = document.getElementById('product-availability');
    const productLaboratory = document.getElementById('product-laboratory');
    const productForm = document.getElementById('product-form');
    const productAdministration = document.getElementById('product-administration');
    const productOrigin = document.getElementById('product-origin');
    const productExpiry = document.getElementById('product-expiry');
    
    if (productImage) productImage.src = product.image;
    if (productName) productName.textContent = product.name;
    
    if (productPrice) {
        if (product.oldPrice) {
            productPrice.innerHTML = `${product.price} TND <del class="text-gray-500">${product.oldPrice} TND</del>`;
        } else {
            productPrice.textContent = `${product.price} TND`;
        }
    }
    
    if (productDescription) productDescription.textContent = product.description;
    
    if (productAvailability) {
        productAvailability.textContent = product.availability;
        if (product.availability === 'En stock') {
            productAvailability.classList.add('text-green-600');
        } else {
            productAvailability.classList.add('text-orange-500');
        }
    }
    
    if (productLaboratory) productLaboratory.textContent = product.laboratory;
    if (productForm) productForm.textContent = product.form;
    if (productAdministration) productAdministration.textContent = product.administration;
    if (productOrigin) productOrigin.textContent = product.origin;
    if (productExpiry) productExpiry.textContent = product.expiryDate;
}

function addToCart(product) {
    // Récupérer le panier actuel
    const cart = state.cart || JSON.parse(localStorage.getItem('cart')) || [];
    
    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }
    
    // Mettre à jour le stockage local et l'état
    localStorage.setItem('cart', JSON.stringify(cart));
    state.cart = cart;
}

function toggleFavorite(productId) {
    // Récupérer la liste des favoris actuelle
    const favorites = state.favorites || JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Vérifier si le produit est déjà dans les favoris
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        // Ajouter aux favoris
        favorites.push(productId);
        alert('Produit ajouté aux favoris');
    } else {
        // Retirer des favoris
        favorites.splice(index, 1);
        alert('Produit retiré des favoris');
    }
    
    // Mettre à jour le stockage local et l'état
    localStorage.setItem('favorites', JSON.stringify(favorites));
    state.favorites = favorites;
}

function updateFavoriteButton(productId) {
    // Récupérer la liste des favoris actuelle
    const favorites = state.favorites || JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Vérifier si le produit est dans les favoris
    const isFavorite = favorites.includes(productId);
    
    // Mettre à jour le bouton
    const addToFavoritesButton = document.getElementById('add-to-favorites');
    if (addToFavoritesButton) {
        if (isFavorite) {
            addToFavoritesButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                </svg>
                Retirer des favoris
            `;
        } else {
            addToFavoritesButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Ajouter aux favoris
            `;
        }
    }
}