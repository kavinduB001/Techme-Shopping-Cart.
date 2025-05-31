document.addEventListener('DOMContentLoaded', function() {
  
  const cartIcon = document.getElementById('cart-icon');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const closeCart = document.querySelector('.close-cart');
  const overlay = document.querySelector('.overlay');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  
  loadProducts();
  updateCart();
  
  
  cartIcon.addEventListener('click', toggleCart);
  closeCart.addEventListener('click', toggleCart);
  overlay.addEventListener('click', toggleCart);
  checkoutBtn.addEventListener('click', checkout);
  
 
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.category;
      
      
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      
      const products = document.querySelectorAll('.product');
      products.forEach(product => {
        const productCategory = product.dataset.category;
        if (category === 'all' || productCategory === category) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    });
  });
  
  
  function toggleCart() {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : 'auto';
  }
  
  
  async function loadProducts() {
    try {
      const response = await fetch('api/get_products.php');
      const products = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error("Error loading products:", error);
      
      const sampleProducts = [
        {
          id: 1, 
          name: "iPhone 15 Pro", 
          price: 999, 
          image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279096", 
          category: "Mobile"
        },
        {
          id: 2, 
          name: "Samsung Galaxy S23", 
          price: 799, 
          image: "https://th.bing.com/th/id/OIP.u-GalyQw5vxygaapZ8XEHQHaEM?cb=iwp2&rs=1&pid=ImgDetMain", 
          category: "Mobile"
        },
        {
          id: 3, 
          name: "AirPods Pro", 
          price: 249, 
          image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660803972361", 
          category: "Accessories"
        },
        {
          id: 4, 
          name: "Apple Watch Series 9", 
          price: 399, 
          image: "https://th.bing.com/th/id/OIP.Bq7_IeEDjbOaLc7OSTnY5gHaEK?cb=iwp2&rs=1&pid=ImgDetMain", 
          category: "Accessories"
        },
        {
          id: 5, 
          name: "MacBook Pro 14\"", 
          price: 1599, 
          image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673202", 
          category: "Computers"
        },
        {
          id: 6, 
          name: "Dell XPS 15", 
          price: 1499, 
          image: "https://th.bing.com/th/id/OIP.W8UMLRZmJh5-qd9Y5OyM9QHaEL?cb=iwp2&rs=1&pid=ImgDetMain", 
          category: "Computers"
        }
      ];
      displayProducts(sampleProducts);
    }
  }
  
  
  function displayProducts(products) {
    const container = document.getElementById("products");
    container.innerHTML = products.map(product => `
      <div class="product" data-category="${product.category}">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="add-to-cart" 
            data-id="${product.id}"
            data-name="${product.name.replace(/"/g, '&quot;')}"
            data-price="${product.price}"
            data-image="${product.image}">
            Add to Cart
          </button>
        </div>
      </div>
    `).join('');
    
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        const image = this.getAttribute('data-image');
        addToCart(id, name, price, image);
      });
    });
  }
  
  
  function addToCart(id, name, price, image) {
    
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1
      });
    }
    
    updateCart();
    showAddedToCart(name);
  }
  
  
  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
  }
  
  
  function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change);
      updateCart();
    }
  }
  
  
  function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    const cartCountElement = document.getElementById("cart-count");
    
    let itemsHtml = '';
    let total = 0;
    let itemCount = 0;
    
    cart.forEach(item => {
      itemsHtml += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
          <div class="quantity-controls">
            <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
          </div>
          <button class="remove-item" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      total += item.price * item.quantity;
      itemCount += item.quantity;
    });
    
    cartItemsContainer.innerHTML = itemsHtml || "<p style='text-align: center;'>Your cart is empty</p>";
    cartTotalElement.textContent = total.toFixed(2);
    cartCountElement.textContent = itemCount;
    
    
    document.querySelectorAll('.quantity-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        const change = parseInt(this.getAttribute('data-change'));
        updateQuantity(id, change);
      });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        removeFromCart(id);
      });
    });
    
    
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  
  function showAddedToCart(productName) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `
      <span>${productName} added to cart!</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2000);
  }
  
  
  async function checkout() {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    try {
      const response = await fetch('api/checkout.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart,
          total: document.getElementById("cart-total").textContent
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Order placed successfully!\nOrder ID: ${result.order_id}\nTotal: $${document.getElementById("cart-total").textContent}`);
        cart = [];
        updateCart();
        toggleCart();
      } else {
        alert("Checkout failed: " + result.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    }
  }
});