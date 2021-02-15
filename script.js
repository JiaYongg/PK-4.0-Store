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

/* Cart Hover */
(function(){
$("#cart").hover(function() {
      $(".cart-items").fadeToggle("fast");
    });
})();

/* Wheel of Fortune Hover */
(function(){
$("#wheelImg").hover(function() {
      $("#game-msg").fadeToggle("slow", 0.0);
    });
})();

/* Currency API */
function apiCurrency(){
    fetch('https://api.exchangeratesapi.io/latest?base=SGD')
    .then(res=>res.json())
    .then(data=> {
        currencyRate = data.rates;
        console.log(currencyRate);
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
                totalPrice = topItem.price * currencyRate.JPY;
            }
            else if (country == 'KR'){
                currencyType = 'Won';
                totalPrice = topItem.price * currencyRate.KRW;
            }
            else if (country == 'CN'){
                currencyType = 'RMB';
                totalPrice = topItem.price * currencyRate.CNY;
            }  
            return`
            <div class="card shadow">
                <img class="card-img-top img-fluid" src="${topItem.image}">
                <div class="card-block">
                        <h5 class="card-title">${topItem.title}</h4>
                        <p class="card-text product-desc">${topItem.description}</p>
                        <p class="card-text product-price"><big>$${totalPrice.toFixed(2)} ${currencyType}</big></p>
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
                totalPrice = newItem.price * currencyRate.JPY;
            }
            else if (country == 'KR'){
                currencyType = 'Won';
                totalPrice = newItem.price * currencyRate.KRW;
            }
            else if (country == 'CN'){
                currencyType = 'RMB';
                totalPrice = newItem.price * currencyRate.CNY;
            }  
            return`
            <div class="card shadow">
                <img class="card-img-top img-fluid" src="${newItem.image}">
                <div class="card-block">
                        <h5 class="card-title">${newItem.title}</h4>
                        <p class="card-text product-desc">${newItem.description}</p>
                        <p class="card-text product-price"><big>$${totalPrice.toFixed(2)} ${currencyType}</big></p>
                        <a href="#" class="btn btn-primary add-item-cart">Add to Cart</a>
                </div>
            </div>
            `  
            
        }        
    }).join("");

    /* Add item to cart*/
    let carts = document.querySelectorAll('.add-item-cart');

    /* When the add to cart button is clicked, increase the local storage cart count by 1 */
    for (let i=0; i < 5; i++){
        carts[i].addEventListener('click', () =>{
            cartNumbers(data[i]) // when button is clicked takes api data on the respective object/item that is being clicked.
        })
    }

    for (let i=5; i < carts.length; i++){
        carts[i].addEventListener('click', () =>{
            cartNumbers(data[i+10]) // when button is clicked takes api data on the respective object/item that is being clicked.
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

function cartNumbers(product){
    console.log(product);
    let prodNumber = localStorage.getItem('cartNumbers');

    prodNumber = parseInt(prodNumber); // Converts prodNumber to an integer from a string

    if (prodNumber){ // if already exist in the local storage
        localStorage.setItem('cartNumbers', prodNumber + 1);
        document.querySelector('#cart span').textContent = prodNumber + 1;
    }
    else{
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('#cart span').textContent = 1
    }
    
}
/* displays the number of items in the cart in the local storage upon loading */
function onLoadCartNumbers(){
    let prodNumber = localStorage.getItem('cartNumbers');

    if (prodNumber){
        document.querySelector('#cart span').textContent = prodNumber
    }
}


$(document).ready(function(){
    apiCurrency();
    apiStore();
    onLoadCartNumbers();
})