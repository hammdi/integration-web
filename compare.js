import { state, medications } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    renderCompareList();
    
    // Ajouter un écouteur d'événement pour le bouton de retour
    const backButton = document.querySelector('button.bg-accent');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'liste.html';
        });
    }
});

function renderCompareList() {
    const compareContainer = document.querySelector('.grid-cols-1.sm\\:grid-cols-2.gap-4');
    
    if (!compareContainer) {
        console.error('Container de comparaison non trouvé');
        return;
    }
    
    // Vider le conteneur
    compareContainer.innerHTML = '';
    
    // Récupérer les produits à comparer
    const compareList = state.compareList || JSON.parse(localStorage.getItem('compareList')) || [];
    
    if (compareList.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'col-span-2 text-center py-8';
        emptyMessage.textContent = 'Aucun produit à comparer. Veuillez ajouter des produits à la liste de comparaison.';
        compareContainer.appendChild(emptyMessage);
        return;
    }
    
    // Ajouter chaque produit à comparer
    compareList.forEach(productId => {
        const product = medications.find(p => p.id === productId);
        
        if (product) {
            const productCard = document.createElement('div');
            productCard.className = 'bg-white p-4 sm:p-6 rounded-xl shadow-custom relative';
            productCard.innerHTML = `
                <button class="absolute right-2 top-2 hover:bg-accent p-1 rounded transition-colors remove-product" data-id="${product.id}">✕</button>
                
                <div class="flex flex-col">
                    <img src="${product.image}" alt="${product.name}" class="w-32 sm:w-40 mx-auto mb-4">
                    <h3 class="font-bold text-sm text-left mb-2">
                        ${product.name} / ${product.form} / ${product.expiryDate}
                    </h3>
                    <p class="text-sm text-gray-600 text-left mb-4">
                        ${product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}
                    </p>
                    <p class="font-semibold ${product.availability === 'En stock' ? 'text-green-600' : 'text-orange-500'} mb-1 text-left">${product.availability}</p>
                    <p class="font-bold text-lg mb-2 text-left">${product.price} TND</p>
                    
                    <button class="absolute bottom-4 right-4 bg-accent p-2 rounded-md shadow-md hover:shadow-lg transition-shadow add-to-cart" data-id="${product.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            `;
            
            compareContainer.appendChild(productCard);
            
            // Ajouter un écouteur d'événement pour le bouton de suppression
            const removeButton = productCard.querySelector('.remove-product');
            removeButton.addEventListener('click', () => {
                removeFromCompare(product.id);
            });
            
            // Ajouter un écouteur d'événement pour le bouton d'ajout au panier
            const addToCartButton = productCard.querySelector('.add-to-cart');
            addToCartButton.addEventListener('click', () => {
                addToCart(product);
                alert(`${product.name} ajouté au panier`);
            });
        }
    });
}

function removeFromCompare(productId) {
    // Récupérer la liste de comparaison actuelle
    const compareList = state.compareList || JSON.parse(localStorage.getItem('compareList')) || [];
    
    // Supprimer le produit de la liste
    const index = compareList.indexOf(productId);
    if (index !== -1) {
        compareList.splice(index, 1);
    }
    
    // Mettre à jour le stockage local et l'état
    localStorage.setItem('compareList', JSON.stringify(compareList));
    state.compareList = compareList;
    
    // Rafraîchir l'affichage
    renderCompareList();
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