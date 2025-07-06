const products = [
            { id: 1, name: "Sourdough Bread", category: "bread", price: 5.99, calories: 300, image: "🥖", description: "Classic sourdough with crispy crust and soft interior" },
            { id: 2, name: "Chocolate Croissant", category: "pastry", price: 3.50, calories: 350, image: "🥐", description: "Flaky croissant with rich chocolate filling" },
            { id: 3, name: "Red Velvet Cake", category: "cake", price: 14.99, calories: 700, image: "🍰", description: "Moist red velvet with cream cheese frosting" },
            { id: 4, name: "Blueberry Muffin", category: "pastry", price: 2.99, calories: 400, image: "🧁", description: "Fresh blueberries in a tender muffin" },
            { id: 5, name: "Chocolate Chip Cookie", category: "cookie", price: 1.50, calories: 250, image: "🍪", description: "Classic cookie with melty chocolate chips" },
            { id: 6, name: "Baguette", category: "bread", price: 3.99, calories: 280, image: "🥖", description: "Traditional French baguette, perfect for sandwiches" },
            { id: 7, name: "Apple Pie", category: "pie", price: 8.99, calories: 500, image: "🥧", description: "Flaky crust with cinnamon-spiced apples" },
            { id: 8, name: "Cinnamon Roll", category: "pastry", price: 3.25, calories: 450, image: "🍥", description: "Soft roll with cinnamon sugar and icing" },
            { id: 9, name: "Whole Wheat Bread", category: "bread", price: 4.50, calories: 220, image: "🍞", description: "Healthy whole wheat loaf" },
            { id: 10, name: "Cheesecake", category: "cake", price: 12.99, calories: 600, image: "🍰", description: "Creamy New York style cheesecake" },
            { id: 11, name: "Pumpkin Pie", category: "pie", price: 9.50, calories: 480, image: "🥧", description: "Seasonal favorite with whipped cream" },
            { id: 12, name: "Macarons", category: "cookie", price: 2.25, calories: 150, image: "🍪", description: "French almond meringue cookies" },
            { id: 13, name: "Banana Bread", category: "bread", price: 4.99, calories: 320, image: "🍞", description: "Moist and flavorful with ripe bananas" },
            { id: 14, name: "Tiramisu", category: "cake", price: 11.99, calories: 550, image: "🍰", description: "Italian coffee-flavored dessert" },
            { id: 15, name: "Pecan Pie", category: "pie", price: 10.50, calories: 650, image: "🥧", description: "Rich pecan filling in flaky crust" }
        ];

        // Cart state
        let cart = [];
        
        // DOM elements
        const productsContainer = document.getElementById('products-container');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        const cartBtn = document.getElementById('cart-btn');
        const closeCartBtn = document.getElementById('close-cart');
        const checkoutBtn = document.getElementById('checkout-btn');
        const checkoutModal = document.getElementById('checkout-modal');
        const closeCheckoutBtn = document.getElementById('close-checkout');
        const completeOrderBtn = document.getElementById('complete-order');
        const orderConfirmation = document.getElementById('order-confirmation');
        const closeConfirmationBtn = document.getElementById('close-confirmation');
        const cartSummary = document.getElementById('cart-summary');
        const noProducts = document.getElementById('no-products');
        
        // Filter elements
        const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"][value]');
        const priceRange = document.getElementById('price-range');
        const priceValue = document.getElementById('price-value');
        const caloriesRange = document.getElementById('calories-range');
        const caloriesValue = document.getElementById('calories-value');
        const resetFiltersBtn = document.getElementById('reset-filters');
        const sortBy = document.getElementById('sort-by');
        
        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        // Initialize the app
        function init() {
            renderProducts(products);
            setupEventListeners();
            updatePriceDisplay();
            updateCaloriesDisplay();
        }
        
        // Set up event listeners
        function setupEventListeners() {
            // Cart interactions
            cartBtn.addEventListener('click', toggleCart);
            closeCartBtn.addEventListener('click', toggleCart);
            cartOverlay.addEventListener('click', toggleCart);
            checkoutBtn.addEventListener('click', openCheckout);
            closeCheckoutBtn.addEventListener('click', closeCheckout);
            completeOrderBtn.addEventListener('click', completeOrder);
            closeConfirmationBtn.addEventListener('click', closeConfirmation);
            
            // Filter interactions
            categoryCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', filterProducts);
            });
            
            priceRange.addEventListener('input', () => {
                updatePriceDisplay();
                filterProducts();
            });
            
            caloriesRange.addEventListener('input', () => {
                updateCaloriesDisplay();
                filterProducts();
            });
            
            resetFiltersBtn.addEventListener('click', resetFilters);
            sortBy.addEventListener('change', filterProducts);
            
            // Mobile menu
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }
        
        // Toggle mobile menu
        function toggleMobileMenu() {
            mobileMenu.classList.toggle('hidden');
        }
        
        // Update price range display
        function updatePriceDisplay() {
            const value = priceRange.value;
            priceValue.textContent = value === priceRange.max ? `Up to $${value}` : `Up to $${value}`;
        }
        
        // Update calories range display
        function updateCaloriesDisplay() {
            const value = caloriesRange.value;
            caloriesValue.textContent = value === caloriesRange.max ? `Up to ${value} kcal` : `Up to ${value} kcal`;
        }
        
        // Reset all filters
        function resetFilters() {
            // Reset category checkboxes
            categoryCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            
            // Reset price range
            priceRange.value = priceRange.max;
            updatePriceDisplay();
            
            // Reset calories range
            caloriesRange.value = caloriesRange.max;
            updateCaloriesDisplay();
            
            // Reset sort
            sortBy.value = 'default';
            
            // Re-filter products
            filterProducts();
        }
        
        // Filter products based on selected filters
        function filterProducts() {
            const selectedCategories = Array.from(categoryCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);
            
            const maxPrice = parseFloat(priceRange.value);
            const maxCalories = parseInt(caloriesRange.value);
            const sortValue = sortBy.value;
            
            let filteredProducts = products.filter(product => {
                return selectedCategories.includes(product.category) && 
                       product.price <= maxPrice && 
                       product.calories <= maxCalories;
            });
            
            // Sort products
            if (sortValue !== 'default') {
                const [key, order] = sortValue.split('-');
                filteredProducts.sort((a, b) => {
                    if (order === 'asc') {
                        return a[key] - b[key];
                    } else {
                        return b[key] - a[key];
                    }
                });
            }
            
            renderProducts(filteredProducts);
            
            // Show/hide no products message
            if (filteredProducts.length === 0) {
                noProducts.classList.remove('hidden');
            } else {
                noProducts.classList.add('hidden');
            }
        }
        
        // Render products to the page
        function renderProducts(productsToRender) {
            productsContainer.innerHTML = '';
            
            productsToRender.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden transition duration-300';
                productCard.innerHTML = `
                    <div class="p-4">
                        <div class="text-6xl text-center mb-4">${product.image}</div>
                        <h3 class="text-lg font-semibold text-amber-900 mb-1">${product.name}</h3>
                        <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                        <div class="flex justify-between items-center mb-3">
                            <span class="font-bold text-amber-700">$${product.price.toFixed(2)}</span>
                            <span class="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">${product.calories} kcal</span>
                        </div>
                        <button class="add-to-cart w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 transition" data-id="${product.id}">
                            Add to Cart
                        </button>
                    </div>
                `;
                
                productsContainer.appendChild(productCard);
            });
            
            // Add event listeners to the new add to cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.getAttribute('data-id'));
                    addToCart(productId);
                });
            });
        }
        
        // Add product to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Show cart briefly
            if (cartSidebar.classList.contains('translate-x-full')) {
                toggleCart();
                setTimeout(() => {
                    if (!cartSidebar.classList.contains('translate-x-full')) {
                        toggleCart();
                    }
                }, 2000);
            }
        }
        
        // Update cart display
        function updateCart() {
            // Update cart count
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Update cart items
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-shopping-cart text-4xl mb-2"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
                cartSummary.classList.add('hidden');
            } else {
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item bg-white rounded-lg p-3 flex items-center border border-gray-100';
                    cartItem.innerHTML = `
                        <div class="text-4xl mr-4">${item.image}</div>
                        <div class="flex-1">
                            <h4 class="font-medium">${item.name}</h4>
                            <div class="flex justify-between text-sm text-gray-600">
                                <span>$${item.price.toFixed(2)} each</span>
                                <span>${item.calories} kcal</span>
                            </div>
                        </div>
                        <div class="flex items-center ml-4">
                            <button class="decrease-quantity text-gray-500 hover:text-amber-600 px-2" data-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-2 w-6 text-center">${item.quantity}</span>
                            <button class="increase-quantity text-gray-500 hover:text-amber-600 px-2" data-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item ml-4 text-red-500 hover:text-red-700" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    cartItemsContainer.appendChild(cartItem);
                });
                
                // Update totals
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const total = subtotal + 2.99; // Add delivery fee
                
                cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
                cartTotal.textContent = `$${total.toFixed(2)}`;
                
                cartSummary.classList.remove('hidden');
                
                // Add event listeners to quantity buttons
                document.querySelectorAll('.increase-quantity').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
                        updateQuantity(productId, 1);
                    });
                });
                
                document.querySelectorAll('.decrease-quantity').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
                        updateQuantity(productId, -1);
                    });
                });
                
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
                        removeFromCart(productId);
                    });
                });
            }
        }
        
        // Update product quantity in cart
        function updateQuantity(productId, change) {
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                cart[itemIndex].quantity += change;
                
                // Remove if quantity is 0 or less
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                }
                
                updateCart();
            }
        }
        
        // Remove product from cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }
        
        // Toggle cart visibility
        function toggleCart() {
            cartSidebar.classList.toggle('translate-x-full');
            cartOverlay.classList.toggle('hidden');
            document.body.classList.toggle('overflow-hidden');
        }
        
        // Open checkout modal
        function openCheckout() {
            if (cart.length === 0) return;
            
            checkoutModal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        }
        
        // Close checkout modal
        function closeCheckout() {
            checkoutModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
        
        // Complete order
        function completeOrder() {
            closeCheckout();
            checkoutModal.classList.add('hidden');
            
            // Show confirmation
            setTimeout(() => {
                orderConfirmation.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
                
                // Clear cart
                cart = [];
                updateCart();
            }, 300);
        }
        
        // Close confirmation
        function closeConfirmation() {
            orderConfirmation.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
        
        // Initialize the app
        init();