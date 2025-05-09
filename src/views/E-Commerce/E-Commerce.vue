<template>
  <div class="ecommerce-products">
    <h1 class="section-title">Colección Exclusiva</h1>
    <div class="products-grid">
      <div class="product-card" v-for="product in products" :key="product.id">
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">Beige</p>
          <div class="product-pricing">
            <p class="subtotal">Subtotal: {{ formatCurrency(product.price) }}</p>
            <p class="shipping">Envío: $18.00</p>
            <p class="total">Total: {{ formatCurrency(product.price + 18) }}</p>
          </div>
          <button class="pay-now" @click="addToCart(product)">Pagar ahora</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  components: {
  },
  data() {
    return {
      products: [
        {
          id: 1,
          name: 'Cartera Moderna',
          price: 140.0,
          image: '/img/logo.svg'
        },
        {
          id: 2,
          name: 'Vestido Elegante',
          price: 89.99,
          image: '/img/logo.svg'
        },
        {
          id: 3,
          name: 'Pantalón Casual',
          price: 59.99,
          image: '/img/logo.svg'
        },
        {
          id: 4,
          name: 'Chaqueta Moderna',
          price: 129.99,
          image: '/img/logo.svg'
        }
      ]
    }
  },
  methods: {
    addToCart(product) {
      alert(`"${product.name}" ha sido añadido al carrito.`)
    },
    formatCurrency(value) {
      return `$${value.toFixed(2)}`
    }
  }
}
</script>

<style scoped>
.ecommerce-products {
  padding: 3em 1em;
  background: #f7f8fa;
}

.section-title {
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 2em;
  color: #333;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2em;
}

.product-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5em;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1em;
}

.product-info {
  font-family: 'Arial', sans-serif;
}

.product-name {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5em;
}

.product-description {
  font-size: 0.9em;
  color: #888;
  margin-bottom: 1em;
}

.product-pricing {
  text-align: left;
  margin-bottom: 1em;
}

.subtotal,
.shipping,
.total {
  font-size: 0.9em;
  margin: 0.2em 0;
}

.total {
  font-weight: bold;
  color: #333;
}

.pay-now {
  background: #1abc9c;
  color: white;
  border: none;
  padding: 0.6em 1.2em;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.3s ease;
}

.pay-now:hover {
  background: #16a085;
  transform: scale(1.05);
}
</style>
