var hoverSavDoc = document.getElementsByClassName('hover-save-doc-img')
var hoverCartDoc = document.getElementsByClassName('hover-add-cart-img')

for (let i = 0; i < hoverCartDoc.length; i++) {
    hoverCartDoc[i].addEventListener('click',(e)=>{
        if(e.target.src == 
            'http://localhost:8000/images/icons/hover-add-to-cart.svg'){
                e.target.src = 'http://localhost:8000/images/icons/hover-add-to-cart-blue.svg'
            }else{
                e.target.src = 'http://localhost:8000/images/icons/hover-add-to-cart.svg'
            }
    })
}

for (let i = 0; i < hoverSavDoc.length; i++) {
    hoverSavDoc[i].addEventListener('click',(e)=>{
        if(e.target.src == 
            'http://localhost:8000/images/icons/hover-bookmark.svg'){
                e.target.src = 'http://localhost:8000/images/icons/bookmark-blue.svg'
            }else{
                e.target.src = 'http://localhost:8000/images/icons/hover-bookmark.svg'
            }
    })
}

// // // FETCH FUNCTION // // //

function toFetch(newUrl, docId) {
    fetch(newUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify(docId)
        })
        .then(response => response)
        .then(docId => {
            console.log('response data?', docId)
        })
        .catch(err => {
            console.log('error here is', err);
        })
}

const pdfSubCou = document.getElementsByClassName('sub-cou')

for (let i = 0; i < pdfSubCou.length; i++) {
    pdfSubCou[i].addEventListener('click',(e)=>{
        let data = {"subject" : e.target.innerHTML}
        toFetch('/topic',data)
    })
    
}