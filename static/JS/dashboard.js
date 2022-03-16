var myProBtns = document.getElementById("my-pro-btn")
// for (let i = 0; i < myProBtns.length; i++) {
myProBtns.addEventListener('click', (e) => {
    let data = {
        "user": e.target.innerText
    }
    // console.log('button clicked');
    toFetch('/profile/user', data)
})
// }

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