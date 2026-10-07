const state = {
  products: [],
  wishlist: [],
  search: ""
};

const prodList = document.getElementById("prod-list");
const wishList = document.getElementById("wish-list");
const msg = document.getElementById("msg");
const searchBox = document.getElementById("search-box");
const searchBtn = document.getElementById("search-btn");
const wishNum = document.getElementById("wish-num");

const API="https://dummyjson.com/products";
function saveWish() {
  localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
}

function loadWish() {
  const saved = localStorage.getItem("wishlist");
  if (saved) {
    state.wishlist = JSON.parse(saved);
  }
}


async function getProducts() {
  msg.textContent = "Loading products...";

  try {
    const res = await fetch(API);

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    const data = await res.json();
    state.products = data.products;
    msg.textContent = "";
  } catch (err) {
    msg.textContent = "Error could not load products. Please try again.";
    console.log(err);
  }
}


function showProducts() {
  const filtered = state.products.filter(function (item) {
    return item.title.toLowerCase().includes(state.search.toLowerCase());
  });

  if (state.products.length > 0 && filtered.length === 0) {
    msg.textContent = "No products match your search.";
  } else if (state.products.length > 0) {
    msg.textContent = "";
  }
  prodList.innerHTML = filtered.map(function (item) {
    return `
      <div class="card">
        <img src="${item.thumbnail}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>${item.category}</p>
        <p><span class="price">ETB ${item.price}</span> Rate ${item.rating}</p>
        <button onclick="addWish(${item.id})">Add to Wishlist</button>
      </div>
    `;
  }).join("");
}

function showWishlist() {
  wishNum.textContent = state.wishlist.length;

  if (state.wishlist.length === 0) {
    wishList.innerHTML = "<p>wishlist is empty.</p>";
    return;
  }

  wishList.innerHTML = state.wishlist.map(function (item) {
    return `
     <button class="clearWishBtn" onclick="clearWish()">Clear Wishlist  </button>
      <div class="card">
        <img src="${item.thumbnail}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>${item.category}</p>
        <p><span class="price">ETB ${item.price}</span> Rate ${item.rating}</p>
        <button class="remove-btn" onclick="removeWish(${item.id})">Remove</button>
      </div>
    `;
  }).join("");
}


function addWish(id) {
  const alreadyIn = state.wishlist.find(function (item) {
    return item.id === id;
  });
  if (alreadyIn) {
    return;
  }

  const product = state.products.find(function (item) {
    return item.id === id;
  });

  state.wishlist.push(product);
  saveWish();
  showWishlist();
}




function doSearch() {
  state.search = searchBox.value;
  showProducts();
}

searchBox.addEventListener("input", doSearch);
searchBtn.addEventListener("click", doSearch);


async function init() {
  loadWish();
  showWishlist();
  await getProducts();
  showProducts();
}

init();


function removeWish(id) {
  state.wishlist = state.wishlist.filter(function (item) {
    return item.id !== id;
  });
  saveWish();
  showWishlist();
}

function clearWish() {
  state.wishlist = [];
  saveWish();
  showWishlist();
}