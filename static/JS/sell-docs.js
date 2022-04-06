let inputs = document.querySelectorAll("input[required='required']")
// console.log("inputs",inputs);
var continueBtn = document.getElementById('continue-btn')
continueBtn.disabled = true

for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('input', (e) => {
        let values = []
        Array.from(inputs).forEach((v) => {
            values.push(v.value)
            // console.log("v",v.value);
        })
        // console.log(values)
        continueBtn.disabled = values.includes('') // includes returns boolean. so if values contains empty value button will reamin disabled
    })
}

// // // FILE SIZE // // //

let fileSize = document.querySelector('input[name="upDocs"]')

fileSize.addEventListener('change', () => {
    let size = fileSize.files[0].size / (1024 * 1024)
    let sizeNoDec = Math.round(size)
    console.log(sizeNoDec);
    document.getElementById('upfile-size').innerText = sizeNoDec + " MB"

    let sizeStatusImg = document.getElementById('current-size').getElementsByTagName('img')[0]
    if (sizeNoDec >= 50) {
        sizeStatusImg.src = 'http://localhost:8000/images/icons/cross.svg'
    } else{
        sizeStatusImg.src ='http://localhost:8000/images/icons/tick.svg'
    }
})