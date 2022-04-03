var draftBtn = document.getElementsByClassName('draft-btn')

for (let i = 0; i < draftBtn.length; i++) {
    draftBtn[i].addEventListener('click',(e)=>{
        let data = {"extra":"draft"}
        toFetch('/sell-docs-2/draft',data)
    })
}

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
