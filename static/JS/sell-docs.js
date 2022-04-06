

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

let inputs = document.querySelectorAll("input[required='required']")
// console.log("inputs",inputs);
var continueBtn = document.getElementById('continue-btn')
continueBtn.disabled = true

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('input',(e)=>{
        let values = []
        Array.from(inputs).forEach((v)=>{
            values.push(v.value)
            // console.log("v",v.value);
        })
        // console.log(values)
        continueBtn.disabled = values.includes('')// includes returns boolean. so if values contains empty value button will reamin disabled
    })
}
