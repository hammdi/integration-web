import { state, medications } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    
    // Ajouter un écouteur d'événement pour le bouton de confirmation
    const confirmButton = document.querySelector('button.bg-accent');
    if (confirmButton) {
        confirmButton.addEventListener('click', () => {
            alert('Commande confirmée ! Merci pour votre achat.');
            // Vider le panier
            state.cart = [];
            localStorage.setItem('cart', JSON.stringify([]));
            // Rediriger vers la page d'accueil
            window.location.href = 'paiement.html';
        });
    }
});

function renderCart() {
    const cartTableBody = document.querySelector('tbody');
    const totalElement = document.querySelector('.text-red-600');
    
    if (!cartTableBody || !totalElement) {
        console.error('Éléments du panier non trouvés');
        return;
    }
    
    // Vider le tableau
    cartTableBody.innerHTML = '';
    
    // Récupérer le panier
    const cart = state.cart || JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.className = 'border-t border-gray-200';
        emptyRow.innerHTML = `
            <td colspan="4" class="py-6 px-4 text-center">
                Votre panier est vide.
            </td>
        `;
        cartTableBody.appendChild(emptyRow);
        totalElement.innerHTML = `<span class="font-bold text-2xl sm:text-3xl">0,00</span> <span class="font-bold text-2xl sm:text-3xl">TND</span>`;
        return;
    }
    
    // Calculer le total
    let total = 0;
    
    // Ajouter chaque produit au tableau
    cart.forEach(item => {
        const product = medications.find(p => p.id === item.id);
        
        if (product) {
            const subtotal = product.price * item.quantity;
            total += subtotal;
            
            const row = document.createElement('tr');
            row.className = 'border-t border-gray-200';
            row.innerHTML = `
                <td class="py-6 px-4">
                    <div class="flex items-start gap-4 sm:gap-6">
                        <img src="${product.image}" 
                             alt="${product.name}" 
                             class="w-20 h-20 sm:w-32 sm:h-32 object-contain">
                        <div class="flex flex-col gap-2">
                            <h3 class="font-medium text-base sm:text-lg">${product.name} / ${product.form} / ${product.expiryDate}</h3>
                            <p class="text-xs sm:text-sm text-gray-600">
                                ${product.description.length > 150 ? product.description.substring(0, 150) + '...' : product.description}
                            </p>
                        </div>
                    </div>
                </td>
                <td class="py-6 px-4">
                    <div class="flex items-center justify-center gap-1">
                        <span class="font-bold text-base sm:text-lg">${product.price.toFixed(2)}</span>
                        <span class="font-bold text-base sm:text-lg">TND</span>
                    </div>
                </td>
                <td class="py-6 px-4">
                    <div class="flex justify-center">
                        <div class="inline-flex items-center justify-center border border-gray-300 rounded-md bg-gray-50">
                            <button class="px-2 sm:px-3 py-1 text-gray-500 hover:bg-gray-100 decrease-quantity" data-id="${product.id}">-</button>
                            <span class="px-2 sm:px-4 py-1 font-medium">${item.quantity}</span>
                            <button class="px-2 sm:px-3 py-1 text-gray-500 hover:bg-gray-100 increase-quantity" data-id="${product.id}">+</button>
                        </div>
                    </div>
                </td>
                <td class="py-6 px-4">
                    <div class="flex items-center justify-center gap-1">
                        <span class="font-bold text-base sm:text-lg">${subtotal.toFixed(2)}</span>
                        <span class="font-bold text-base sm:text-lg">TND</span>
                    </div>
                </td>
            `;
            
            cartTableBody.appendChild(row);
            
            // Ajouter des écouteurs d'événements pour les boutons de quantité
            const decreaseButton = row.querySelector('.decrease-quantity');
            const increaseButton = row.querySelector('.increase-quantity');
            
            decreaseButton.addEventListener('click', () => {
                updateQuantity(product.id, -1);
            });
            
            increaseButton.addEventListener('click', () => {
                updateQuantity(product.id, 1);
            });
        }
    });
    
    // Mettre à jour le total
    totalElement.innerHTML = `<span class="font-bold text-2xl sm:text-3xl">${total.toFixed(2)}</span> <span class="font-bold text-2xl sm:text-3xl">TND</span>`;
}

function updateQuantity(productId, change) {
    // Récupérer le panier
    const cart = state.cart || JSON.parse(localStorage.getItem('cart')) || [];
    
    // Trouver le produit dans le panier
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        // Mettre à jour la quantité
        item.quantity += change ;
        
        // Vérifier que la quantité est au moins 1
        if (item.quantity < 1) {
            // Supprimer l'article du panier
            const index = cart.indexOf(item);
            cart.splice(index, 1);
        }
        
        // Mettre à jour le stockage local et l'état
        localStorage.setItem('cart', JSON.stringify(cart));
        state.cart = cart;
        
        // Rafraîchir l'affichage
        renderCart();
    }
}