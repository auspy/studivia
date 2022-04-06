let selects = document.querySelectorAll("select")
let contBtn = document.getElementById('continue-btn-1')
contBtn.disabled = true

for (let i = 0; i < selects.length; i++) {
    selects[i].addEventListener('change',()=>{
        let values = []
        Array.from(selects).forEach(item => values.push(item.value))
        contBtn.disabled = values.includes('none selected')
    })
}

var draftBtn = document.getElementsByClassName('draft-btn')

for (let i = 0; i < draftBtn.length; i++) {
    draftBtn[i].addEventListener('click',(e)=>{
        let data = {"extra":"draft"}
        toFetch('/sell-docs-2/draft',data)
    })
}

