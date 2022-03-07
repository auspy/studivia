var errorBtn = document.getElementsByClassName('error-btn-img')[0]

errorBtn.addEventListener('click',()=>{
    document.getElementsByClassName('error')[0].classList.toggle('d-none')
})