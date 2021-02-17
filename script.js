/* Tooltip Enable */
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

/* Global var */
var currencyRate;

/* PreLoader */
function myFunction(){
    setTimeout(showPage, 3000)
}

function showPage(){
    document.getElementById("preloader").style.display = "none";
    document.getElementById("overall_content").style.display = "block";
}

/* Currency API */
function apiCurrency(){
    fetch('https://api.exchangeratesapi.io/latest?base=SGD')
    .then(res=>res.json())
    .then(data=> {
        currencyRate = data.rates;
    })
    .catch(err => console.log(err.message));
}

/* Item API */
function apiStore(){
    fetch('https://fakestoreapi.com/products')
    .then(res=>res.json())
    .then(data=> loadData(data))
    .catch(err => console.log(err.message));
}

function updatePrice(data, country){
    let topProducts = document.getElementById("top-products");
    let newArrivals = document.getElementById("new-arrivals");

    var currencyType = 'SGD';
    var currencySymbol = '$';
    //Top Products API
    topProducts.innerHTML = data
    .map(topItem => {
        let totalPrice = topItem.price; // defaults the current currency to SGD
        /* Selects first 5 item from the API and checks if the user has clicked on the flag, if not, the default currency would be SGD,
        else it will be the country that the user clicked on respectively */
        if (topItem.id <= 5){  
            if (country == 'US'){
                currencyType = 'USD';
                totalPrice = topItem.price * currencyRate.USD;  
            }  
            else if (country == 'JP'){
                currencyType = 'Yen';
                currencySymbol = '¥';
                totalPrice = topItem.price * currencyRate.JPY;
            }
            else if (country == 'KR'){
                currencyType = 'Won';
                currencySymbol = '₩';
                totalPrice = topItem.price * currencyRate.KRW;
            }
            else if (country == 'CN'){
                currencyType = 'RMB';
                currencySymbol = '元';
                totalPrice = topItem.price * currencyRate.CNY;
            }  
            return`
            <div class="card shadow">
                <img class="card-img-top img-fluid" src="${topItem.image}">
                <div class="card-block">
                        <h5 class="card-title">${topItem.title}</h4>
                        <p class="card-text product-desc">${topItem.description}</p>
                        <p class="card-text product-price"><big>${currencySymbol}${totalPrice.toFixed(2)} ${currencyType}</big></p>
                        <a href="#" class="btn btn-primary add-item-cart">Add to Cart</a>
                </div>
            </div>
            `  
            
        }        
    }).join("");

    //New Arrivals API 
    newArrivals.innerHTML = data
    .map(newItem => {
        let totalPrice = newItem.price; // defaults the current currency to SGD
        /* Selects last 5 item from the API and checks if the user has clicked on the flag, if not, the default currency would be SGD,
        else it will be the country that the user clicked on respectively */
        if (newItem.id >= 16){  
            if (country == 'US'){
                currencyType = 'USD';
                totalPrice = newItem.price * currencyRate.USD;  
            }  
            else if (country == 'JP'){
                currencyType = 'Yen';
                currencySymbol = '¥';
                totalPrice = newItem.price * currencyRate.JPY;
            }
            else if (country == 'KR'){
                currencyType = 'Won';
                currencySymbol = '₩';
                totalPrice = newItem.price * currencyRate.KRW;
            }
            else if (country == 'CN'){
                currencyType = 'RMB';
                currencySymbol = '元';
                totalPrice = newItem.price * currencyRate.CNY;
            }  
            return`
            <div class="card shadow">
                <img class="card-img-top img-fluid" src="${newItem.image}">
                <div class="card-block">
                        <h5 class="card-title">${newItem.title}</h4>
                        <p class="card-text product-desc">${newItem.description}</p>
                        <p class="card-text product-price"><big>${currencySymbol}${totalPrice.toFixed(2)} ${currencyType}</big></p>
                        <a href="#" class="btn btn-primary add-item-cart">Add to Cart</a>
                </div>
            </div>
            ` 
             
            
        }        
    }).join("");

    /* Add item to cart*/
    let carts = document.querySelectorAll('.add-item-cart');
    /* Variables to check if object already in cart */
    var inCart = 'inCart';
    var inCartCount = 0;
    let lottie = document.getElementById("cartLottie");
    /* When the add to cart button is clicked, increase the local storage cart count by 1 */
    for (let i=0; i < 5; i++){
        carts[i].addEventListener('click', (event) =>{
            event.preventDefault();
            lottie.play();
            (data[i])[inCart] = inCartCount; // Adds the variables into the API JSON data
            cartNumbers(data[i]) // when button is clicked takes api data on the respective object/item that is being clicked.
            totalCost(data[i]);
        })
    }

    for (let i=5; i < carts.length; i++){
        carts[i].addEventListener('click', (event) =>{
            event.preventDefault();
            (data[i+10])[inCart] = inCartCount; // Adds the variables into the API JSON data
            cartNumbers(data[i+10]) // when button is clicked takes api data on the respective object/item that is being clicked.
            totalCost(data[i+10]);
        })
    }
}


function loadData(data){
    /* When the html tag with the ID of sgd, usd, jpy, krw or rmb is clicked, set country variable to their respective id
    and call updatePrice function which takes in the API data and the country given */
    var country = 'SG';
    $('#sgd, #usd, #jpy, #krw, #rmb').click(function () {
        if (this.id == 'sgd') {
            country = 'SG';
        }
        else if (this.id == 'usd') {
            country = 'US';
        }
        else if (this.id == 'jpy'){
            country = 'JP';
        }
        else if (this.id == 'krw'){
            country = 'KR';
        }
        else if (this.id == 'rmb'){
            country = 'CN';
        }
        
        updatePrice(data, country);
    });

    updatePrice(data, country);
}

/* Local storage of the cart number/existing item in the cart */
function cartNumbers(product){
    console.log(product);
    let prodNumber = localStorage.getItem('cartNumbers');

    prodNumber = parseInt(prodNumber); // Converts prodNumber to an integer from a string

    if (prodNumber){ // if already exist in the local storage
        localStorage.setItem('cartNumbers', prodNumber + 1);
        document.querySelector('#cart-items-int').textContent = prodNumber + 1;
    }
    else{
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('#cart-items-int').textContent = 1
    }
    setItems(product);
    
}

/* displays the number of items in the cart in the local storage upon loading */
function onLoadCartNumbers(){
    let prodNumber = localStorage.getItem('cartNumbers');

    if (prodNumber){
        document.querySelector('#cart-items-int').textContent = prodNumber
    }
}

function setItems(product){
    let cartItems = localStorage.getItem('productsInCart'); // Creates a new key in the local storage
    cartItems = JSON.parse(cartItems); // Converts JSON object into normal object

    if (cartItems != null){ // Checks if item already exist in the cart
        if (cartItems[product.id] == undefined){ // Checks if item is a different item when its clicked after the 2nd time
            //Adds cart item to productsInCart
            cartItems = {
                /*Using the Rest operator to store the other items other than the first item 
                that is being clicked into an array in productsInCart */
                ...cartItems,
                [product.id] : product
            }
        }
        cartItems[product.id].inCart += 1; // Increases the count by 1 if item already exist in the cart
    }
    else{
        product.inCart = 1; // If item does not exist in cart, set the count to 1 and create a variable to store product object
        cartItems = {
            [product.id] : product
        }
    }
    /* Sets the key "productsInCart" to store values of cartItems assigned above and converts from a normal object to a JSON object */
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

function totalCost(product){
    let cartCost = localStorage.getItem('totalCost');

    if (cartCost != null){
        cartCost = parseInt(cartCost); // Converts from string to integer as local storage always returns a string
        localStorage.setItem('totalCost', cartCost + product.price);
    }
    else{
        localStorage.setItem('totalCost', product.price)
    }
}

function displayCart(){
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productContainer = document.getElementById('cart-added-items');
    let cartCost = localStorage.getItem('totalCost');
    if (productContainer){ // Checks if there is any item in cart from local storage and if the product container exists
        productContainer.innerHTML = '';
        if (cartItems != undefined){
            /* Looping through every values of the key productsInCart */
            Object.values(cartItems).map(item => {
                productContainer.innerHTML += `
                <thead>
                <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total</th>
                    <th scope="col">Remove</th>
                </tr>
                </thead>
                <tbody id="cart-added-items">
                <tr>
                    <td scope="row"><img src="${item.image}" width="100"><br>${item.title}</td>
                    <td>${item.price}</td>
                    <td><ion-icon name="chevron-back-circle-outline"></ion-icon>${item.inCart}<ion-icon name="chevron-forward-circle-outline"></ion-icon></td>
                    <td>${item.price * item.inCart}</td>
                    <td><button id='remove-item'>X</button></td>
                </tr>
                </tbody>
            `;
            });    
            productContainer.innerHTML += `
            <div class="container">
                <div class="basketContainer col-12 d-flex flex-wrap justify-content-end">
                    <h4 class="basketTotalName">
                        Basket Total
                        $${cartCost}
                    </h4>
                </div>
            </div>

            `
        }
        else{
            productContainer.innerHTML += `
            <div class="col-12 text-center d-flex align-items-center justify-content-center flex-wrap">
                <div class="col-12">
                    <img src="images/empty-cart.jpg" id="empty-cart-img" alt="Empty Cart" class="img-fluid">
                </div>
                <h2>There are no items in your cart presently.</h2>
            </div>
        `;
        }  
    }
}


/* Form Submit RestDB */
const APIKEY = "602c95cb5ad3610fb5bb6134";
$("#contact-submit").on("click", function(e){
    e.preventDefault();

    let name = $("#contact-name").val();
    let contactNum = $("#contact-num").val();
    let email = $("#contact-email").val();
    let message = $("#contact-msg").val();

    let data = {
        "name" : name,
        "contactNum" : contactNum,
        "email" : email,
        "message" : message
    };

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://idassignment3-cc34.restdb.io/rest/contact",
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(data),
        "beforeSend": function(){
          $("#contact-submit").prop( "disabled", true);
          $("#contact-form").trigger("reset");
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
        alert("Message send sucessfully.");
        $("#contact-submit").prop( "disabled", false);
    });
})



$(document).ready(function(){
    apiCurrency();
    apiStore();
    onLoadCartNumbers();
    displayCart();
})


var jewel = document.getElementById('jewelries-cat');

jewel.addEventListener('click', function(){
    localStorage.setItem('trigger', 'jewels')
    window.location.href = 'products.html'
})

var men = document.getElementById('mens-clothing');

men.addEventListener('click', function(){
    localStorage.setItem('trigger', 'men')
    window.location.href = 'products.html'
})

var women = document.getElementById('womens-clothing');

women.addEventListener('click', function(){
    localStorage.setItem('trigger', 'women')
    window.location.href = 'products.html'
})