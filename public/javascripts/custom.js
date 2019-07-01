window.addEventListener("load", () => {
    var burguer = document.querySelector('.burguer');
    var links = document.querySelector('.links');
    var navLink = document.querySelectorAll('.links li');
// ativar nav
    burguer.addEventListener('click',(event)=>{
        links.classList.toggle('active');
    });
// animar links
    navLink.forEach((link, index)=>{
link.style.animation = `navLinkFade 0.5s ease forwards ${index/7}s`;
    });
});