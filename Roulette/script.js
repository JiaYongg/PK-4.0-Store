function myFunction(){

    var x = 1024;
    var y = 9999;

    var deg = Math.floor(Math.random() * (x-y));

    document.getElementById('sub-wheel').style.transform = "rotate("+deg+"deg)";

    var element = document.getElementById('wheel');
    element.classList.remove('animate');
    setTimeout(function(){
        element.classList.add('animate');
    }, 5000);
}


