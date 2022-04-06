let checkBtn = document.querySelectorAll('input')
let veriBtn = document.getElementById('send-veri') 
veriBtn.disabled = true

for (let i = 0; i < checkBtn.length; i++) {
    checkBtn[i].addEventListener('change',()=>{
        let values = []
        Array.from(checkBtn).forEach(item  => values.push(item.checked))
        veriBtn.disabled = values.includes(false)
    })
    
}