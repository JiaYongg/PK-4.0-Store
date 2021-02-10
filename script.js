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


/* API */
/* YET TO IMPLEMENT */
function apiStore(){
    fetch('https://fakestoreapi.com/products')
    .then(res=>res.json())
    .then(data=>loadData(data))
    .catch(err => console.log(err.message));
}

function loadData(data){
    let topProducts = document.getElementById("top-products");
    let newArrivals = document.getElementById("new-arrivals");
    console.log(data);

    //Top Products API
    topProducts.innerHTML = data
    .map(topItem => {
        if (topItem.id <= 5)
        return`
        <div class="card shadow">
            <img class="card-img-top img-fluid" src="${topItem.image}">
            <div class="card-block">
                    <h5 class="card-title">${topItem.title}</h4>
                    <p class="card-text product-desc">${topItem.description}</p>
                    <p class="card-text product-price"><big>$${topItem.price.toFixed(2)}</big></p>
                    <a href="#" class="btn btn-primary add-item-cart">Add to Cart</a>
            </div>
        </div>
        `             
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

$(document).ready(function(){
    window.addEventListener("load", apiStore);
})