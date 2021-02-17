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
    let productListing = document.getElementById("products-listing");

    var currencyType = 'SGD';
    var currencySymbol = '$';
    // All Products API
    productListing.innerHTML = data
    .map(prodItem => {
        let itemCat = prodItem.category;
        console.log(itemCat)
        let totalPrice = prodItem.price; // defaults the current currency to SGD
        if (country == 'US'){
            currencyType = 'USD';
            totalPrice = prodItem.price * currencyRate.USD;  
        }  
        else if (country == 'JP'){
            currencyType = 'Yen';
            currencySymbol = '¥';
            totalPrice = prodItem.price * currencyRate.JPY;
        }
        else if (country == 'KR'){
            currencyType = 'Won';
            currencySymbol = '₩';
            totalPrice = prodItem.price * currencyRate.KRW;
        }
        else if (country == 'CN'){
            currencyType = 'RMB';
            currencySymbol = '元';
            totalPrice = prodItem.price * currencyRate.CNY;
        }
        return`
        <div class="card shadow col-lg-3 col-sm-6 col-xs-12">
            <img class="card-img-top img-fluid" src="${prodItem.image}">
            <div class="card-block">
                <h5 class="card-title">${prodItem.title}</h4>
                <p class="card-text product-desc">${prodItem.description}</p>
                <p class="card-text product-price"><big>${currencySymbol}${totalPrice.toFixed(2)} ${currencyType}</big></p>
                <a href="#" class="btn btn-primary add-item-cart">Add to Cart</a>
            </div>
        </div>
        `

    }).join("");
    
    /* Add item to cart*/
    let carts = document.querySelectorAll('.add-item-cart');
    /* Variables to check if object already in cart */
    var inCart = 'inCart';
    var inCartCount = 0;
    /* When the add to cart button is clicked, increase the local storage cart count by 1 */
    for (let i=0; i < carts.length; i++){
        carts[i].addEventListener('click', (event) =>{
            event.preventDefault();
            (data[i])[inCart] = inCartCount; // Adds the variables into the API JSON data
            cartNumbers(data[i]) // when button is clicked takes api data on the respective object/item that is being clicked.
            totalCost(data[i]);
        })
    }

}

function filterResult(data, itemCategory){

    let productListing = document.getElementById("products-listing");

    var currencyType = 'SGD';
    var currencySymbol = '$';

    // All Products API
    productListing.innerHTML = data
    .map(prodItem => {
        let itemCat = prodItem.category;
        let totalPrice = prodItem.price; // defaults the current currency to SGD
        if (itemCategory == itemCat || itemCategory == 'all'){
            return`
            <div class="card shadow col-lg-3 col-sm-6 col-xs-12">
                <img class="card-img-top img-fluid" src="${prodItem.image}">
                <div class="card-block">
                    <h5 class="card-title">${prodItem.title}</h4>
                    <p class="card-text product-desc">${prodItem.description}</p>
                    <p class="card-text product-price"><big>${currencySymbol}${totalPrice.toFixed(2)} ${currencyType}</big></p>
                    <a href="#" class="btn btn-primary add-item-cart">Add to Cart</a>
                </div>
            </div>
            ` 
        }
    }).join("");
    
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
    /* Filter button */
    $('#all, #men, #women, #jewel, #electronics').click(function () {
        if (this.id == 'all'){
            itemCat = 'all';
        }
        else if (this.id == 'men') {
            itemCat = 'men clothing';
        }
        else if (this.id == 'women'){
            itemCat = 'women clothing';
        }
        else if (this.id == 'jewel'){
            itemCat = 'jewelery';
        }
        else if (this.id == 'electronics'){
            itemCat = 'electronics';
        }
        filterResult(data, itemCat)
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


$(document).ready(function(){
    apiCurrency();
    apiStore();
    onLoadCartNumbers();
})
