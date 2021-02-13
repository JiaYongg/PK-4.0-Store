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
    fetch('http://data.fixer.io/api/latest?access_key=820235a5ad8f45303e907bde9c2c9de5')
    .then(res=>res.json())
    .then(data=>loadData(data))
    .catch(err => console.log(err.message));
}


/* Item API */
function apiStore(){
    fetch('https://fakestoreapi.com/products')
    .then(res=>res.json())
    .then(data=>loadData(data))
    .catch(err => console.log(err.message));
}

function loadData(data){
    let topProducts = document.getElementById("top-products");
    let newArrivals = document.getElementById("new-arrivals");

    var country;
    $('#sgd, #usd, #euro, #pounds, #rmb').click(function () {
        if (this.id == 'sgd') {
            country = 'SG';
        }
        else if (this.id == 'usd') {
            country = 'US';
        }
        else if (this.id == 'euro'){
            country = 'EU';
        }
        else if (this.id == 'pounds'){
            country = 'UK';
        }
        else if (this.id == 'rmb'){
            country = 'CN';
        }
        else{
            country = 'SG';
        }
    });


    //Top Products API
    topProducts.innerHTML = data
    .map(topItem => {
        var totalPrice = topItem.price;
        if (country == 'SG'){
            totalPrice = topItem.price * data.rates.SGD
        }
        if (topItem.id <= 5){        
            return`
            <div class="card shadow">
                <img class="card-img-top img-fluid" src="${topItem.image}">
                <div class="card-block">
                        <h5 class="card-title">${topItem.title}</h4>
                        <p class="card-text product-desc">${topItem.description}</p>
                        <p class="card-text product-price"><big>$${totalPrice.toFixed(2)}</big></p>
                        <a href="#" class="btn btn-primary add-item-cart">Add to Cart</a>
                </div>
            </div>
            `     
        }        
    }).join("");

    //New Arrivals API 
    newArrivals.innerHTML = data
    .map(newItem => {
        if (newItem.id >= 16)
        return`
        <div class="card shadow">
            <img class="card-img-top img-fluid" src="${newItem.image}">
            <div class="card-block">
                    <h5 class="card-title">${newItem.title}</h4>
                    <p class="card-text product-desc">${newItem.description}</p>
                    <p class="card-text product-price"><big>$${newItem.price.toFixed(2)}</big></p>
                    <a href="#" class="btn btn-primary add-item-cart">Add to Cart</a>
            </div>
        </div>
        `             
    }).join("");
}

// $(document).ready(function(){
    window.addEventListener("load", apiStore);
    window.addEventListener("load", apiCurrency);
// })