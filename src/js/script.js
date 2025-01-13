const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abre e fecha o modal
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// Adiciona produtos ao carrinho

menu.addEventListener("click", (event) => {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    let name = parentButton.getAttribute("data-name");
    let price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);
  }
});

// função para adicionar produtos ao carrinho

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCartModal();
}

// Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );
    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-medium mt-2">Preço: R$ ${item.price.toFixed(
                  2
                )}</p>
            </div>

        
            <button class="remove-from-cart-btn" data-name="${
              item.name
            }">Remover</button>

        </div>
   
        `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.innerHTML = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.innerHTML = cart.length;
}

// função para remover produtos do carrinho

cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeFromCart(name);
  }
});

function removeFromCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

// função para pegar o endereço do usuário

addressInput.addEventListener("input", (event) => {
  let inputValue = event.target.value;

  // se o usuário digitar algo, o aviso de endereço some
  if (inputValue !== "") {
    addressWarn.style.display = "none";
    addressInput.classList.remove("border-red-500");
    return;
  }
});

// função para finalizar a compra

checkoutBtn.addEventListener("click", () => {
  const isOpen = checkOpeningHours();
  if (!isOpen) {
    Toastify({
      text: "A hamburgueria está fechada, volte mais tarde!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
      onClick: function(){} // Callback after click
    }).showToast();
    return;
  }

  if (cart.length === 0) {
    Toastify({
      text: "Adicione produtos ao carrinho para finalizar a compra",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
      onClick: function(){} // Callback after click
    }).showToast();
    return;
  }

  if (addressInput.value === "") {
    addressWarn.style.display = "block";
    addressInput.classList.add("border-red-500");
    return;
  }

  // Enviar o pedido para o whatsapp
  const cartItems = cart
    .map((item) => {
      return `${item.name} - Quantidade: ${
        item.quantity
      } Preço: R$ ${item.price.toFixed(2)} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "8199999999";

  window.open(
    `https://wa.me/${phone}?text=${message} - Endereço de entrega: ${addressInput.value}`, "_blank"
);
  cart = [];
  updateCartModal();

});

// validação se a hamburgueria está aberta ou fechada

function checkOpeningHours() {
  const now = new Date();
  const hours = now.getHours();
  const isOpen = hours >= 18 && hours < 23; // 8h às 23h
  return isOpen;
}

const spanItem = document.getElementById("date-spam");
const isOpen = checkOpeningHours();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
