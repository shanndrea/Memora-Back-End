let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');

menu.onclick = () =>{

  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');

}

window.onscroll = () =>{

  menu.classList.remove('fa-times');
  navbar.classList.remove('active');

  if(window.scrollY > 60){
    document.querySelector('#scroll-top').classList.add('active');
  }else{
    document.querySelector('#scroll-top').classList.remove('active');
  }

}

const urlParams = new URLSearchParams(window.location.search);
    const successMessage = urlParams.get('successMessage');
    const errorMessage = urlParams.get('errorMessage');

    // Tampilkan popup jika ada pesan sukses atau pesan kesalahan
    if (successMessage) {
        alert(successMessage);
    }
    if (errorMessage) {
        alert(errorMessage);
    }
