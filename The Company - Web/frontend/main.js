function goBack() {
  window.history.back()

}
async function getProductsInStock() {
  let rawData = await fetch('/api/productsInStock');
  let productsInStock = await rawData.json();
  showProductsInStock(productsInStock);
}

async function getAllProducts() {
  let rawData = await fetch('/api/products');
  let products = await rawData.json();
  showProducts(products);
}
async function getAllStores() {
  let rawData = await fetch('/api/stores');
  let stores = await rawData.json();
  showStores(stores);
}
//Not in use ATM, will use this and add more to the webbapp later
async function getStock() {
  let rawData = await fetch('/api/storeStocks');
  let storeStocks = await rawData.json();
  showStock(storeStocks);
};

//Show Products in Stock and add HTML 
function showProductsInStock(productsInStock) {
  let html = `

    <h1>Lista över saldo </h1>
    
  `;
  for (let { id, storeName, productName, quantity } of productsInStock) {
    html += `

       <div class= "stock" id="${id}" >
      LagerID-#: ${id}<p>
      Lagerplats:<h2>${storeName}</h2></p>
      <hr>
      <p>Produktnamn: <span>${productName}</span></p>
      <p>Antal i saldo: <span>${quantity}</span></p>
      <p><button class ="change-stock-button" id="change-${id}">Uppdatera</button>
      <span> Formuläret hamnar längst upp på sidan.</span></p>
      </div>
  `;
  }
  //Add html to body att saldo.html
  if (location.pathname === '/saldo.html') {
    let stocksDiv = document.createElement('div');
    stocksDiv.className = 'stocks';
    stocksDiv.innerHTML = html;
    document.body.append(stocksDiv);

  }

}

//Show Products and add HTML
function showProducts(products) {
  let html = `
    <h1>Produktlista </h1> <p>
    Klicka på en produkts namn som du är sugen på att få mer detaljerad information om!</p>
  `;
  for (let { id, name, price, description } of products) {
    html += `
        <div class="product" id="id${id}">
        <h2>${name}</h2>

        <div class="smart" >
        <p>Artikelnummer: ${id}</p>
        <p>Beskrivning: ${description}</p>
        <p>Pris: ${price} kr
        </div
        <p><img src="/pictures/products/${id}.png"  style="max-height:50%; max-width:50%;">
        </p>
        <p><button class="change-product-button" id="change-${id}">Redigera</button>
        <span> Formuläret hamnar längst upp på sidan.</span></p>
        <p><button class="delete-button" id="delete-${id}">Radera &#128465; </button>
        <span>&#9888;  OBS! Raderas direkt!</span></p>
        </div>
    `;

  }
  //Add html to body at produkt.html
  if (location.pathname === '/produkt.html') {
    let productsDiv = document.createElement('div');
    productsDiv.className = 'products';
    productsDiv.innerHTML = html;
    document.body.append(productsDiv);
  }
}
// DELETE PRODUCT
document.body.addEventListener('click', async event => {
  let deleteButton = event.target.closest('.delete-button');
  if (!deleteButton) { return; }
  let idToDelete = deleteButton.id.slice(7);
  await fetch('/api/products/' + idToDelete, {
    method: 'DELETE'
  });

  getAllProducts();
});
//CHANGE PRODUCT
document.body.addEventListener('click', async event => {
  let changeButton = event.target.closest('.change-product-button');
  if (!changeButton) { return; }
  let idToChange = changeButton.id.slice(7);
  let rawResult = await fetch('/api/products/' + idToChange);
  let result = await rawResult.json();
  let changeForm = document.querySelector('.change-product-form');
  changeForm.setAttribute('action', '/api/products/' + result.id);
  for (let element of changeForm.elements) {
    if (!element.name) { continue; }
    element.value = result[element.name];
  } changeForm.style.display = "block";

});

// CHANGE STOCK
document.body.addEventListener('click', async event => {
  let changeButton = event.target.closest('.change-stock-button');
  if (!changeButton) { return; }
  let idToChange = changeButton.id.slice(7);
  let rawResult = await fetch('/api/storeStocks/' + idToChange);
  let result = await rawResult.json();
  let changeForm = document.querySelector('.change-stock-form');
  changeForm.setAttribute('action', '/api/storeStocks/' + result.id);
  for (let element of changeForm.elements) {
    if (!element.name) { continue; }
    element.value = result[element.name];
  } changeForm.style.display = "block";

});

//FORMS - handle and get data
document.body.addEventListener('submit', async event => {
  event.preventDefault();
  let form = event.target;
  let route = form.getAttribute('action');
  let method = form.getAttribute('method');
  // Collect the data from the form
  // (does not work with check and radio boxes yet)
  let requestBody = {};
  for (let { name, value } of form.elements) {
    if (!name) { continue; }
    requestBody[name] = value;
  }
  let rawResult = await fetch(route, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  let result = await rawResult.json();
  console.log(result);
  // Empty the fields
  for (let element of form.elements) {
    if (!element.name) { continue; }
    element.value = '';
  }

});

// SHOW PRODUCTFORM....
document.body.addEventListener('click', event => {
  let addProductButton = event.target.closest('.add-product-button');
  if (!addProductButton) { return; }
  document.querySelector('.add-product-form').style.display = 'block';
  addProductButton.style.display = 'none';
});

// ADD STORES FORM....
document.body.addEventListener('click', event => {
  let addStoreButton = event.target.closest('.add-store-button');
  if (!addStoreButton) { return; }
  document.querySelector('.add-store-form').style.display = 'block';
  addStoreButton.style.display = 'none';
});

// CHANGE PRODUCT FORM...
document.body.addEventListener('click', event => {
  let changeProductButton = event.target.closest('.change-product-button');
  if (!changeProductButton) { return; }
  document.querySelector('.change-product-form').style.display = 'block';
  changeProductButton.style.display = 'none';

});

// CHANGE STORE FORM...
document.body.addEventListener('click', event => {
  let changeStoreButton = event.target.closest('.change-store-button');
  if (!changeStoreButton) { return; }
  document.querySelector('.change-store-form').style.display = 'block';
  changeStoreButton.style.display = 'none';

});

// CHANGE SALDO...
document.body.addEventListener('click', event => {
  let changeStockButton = event.target.closest('.change-stock-button');
  if (!changeStockButton) { return; }
  document.querySelector('.change-stock-form').style.display = 'block';
  changeStockButton.style.display = 'none';
});



// A POP-UP CONFIRMATION FOR SUBMITTED FORM
let form = document.getElementsByTagName("form")[0];
form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Formulär skickat!");
});

//Show info on product after click on the productName
function showProductInfo() {
  document.querySelector('body').addEventListener('click', function (event) {
    let productClick = event.target.closest('.product');
    if (!productClick) { return; }
    let smartDiv = productClick.querySelector('.smart');
    smartDiv.style.display = smartDiv.style.display === 'block' ? 'none' : 'block';
  });

}
//Show stores and add HTML
function showStores(stores) {
  let html = `
    <h1>Lista över butiker</h1>
    <p>Här går det även att ändra information för butiker.</p>
    <p>Ifall det tråkigt nog gått dåligt för en butik går det även att radera den här!</p>
  `;
  for (let { id, name, city, phone, address } of stores) {
    html += `
      <div class="store" id="id${id}">
      <h2>${name}</h2>
      <p>Butiksnummer: ${id}</p>
      <p>Adress: ${address}</p>
      <p>Stad: ${city}</p>
      <p>Telefon: ${phone}</p><hr>
      <p><button class="change-store-button" id="change-${id}">Redigera</button>
      <span> Formuläret hamnar längst upp på sidan.</span></p>
      <p><button class="delete-store-button" id="delete-${id}">Radera &#128465; </button>
      <span>&#9888;  OBS! Raderas permanent!</span></p>
      </div>
    `;
  }
  //Add html to the body at om.html
  if (location.pathname === '/om.html') {
    let storesDiv = document.createElement('div');
    storesDiv.className = 'stores';
    storesDiv.innerHTML = html;
    document.body.append(storesDiv);
    showStores();
  }
}
// DELETE STORE BUTTON
document.body.addEventListener('click', async event => {
  let deleteButton = event.target.closest('.delete-store-button');
  if (!deleteButton) { return; }
  let idToDelete = deleteButton.id.slice(7);
  await fetch('/api/stores/' + idToDelete, {
    method: 'DELETE'
  });
  getAllStores();
});
//CHANGE STORE Button and form - handle and get data
document.body.addEventListener('click', async event => {
  let changeButton = event.target.closest('.change-store-button');
  if (!changeButton) { return; }
  let idToChange = changeButton.id.slice(7);
  let rawResult = await fetch('/api/stores/' + idToChange);
  let result = await rawResult.json();
  let changeForm = document.querySelector('.change-store-form');
  changeForm.setAttribute('action', '/api/stores/' + result.id);
  for (let element of changeForm.elements) {
    if (!element.name) { continue; }
    element.value = result[element.name];
  } changeForm.style.display = "block";

});

showProductInfo();
getAllProducts();
getAllStores();
getProductsInStock();


