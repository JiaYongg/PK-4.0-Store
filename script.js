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
fetch('https://fakestoreapi.com/products?limit=5')
    .then(res=>res.json())
    .then(json=>console.log(json))
