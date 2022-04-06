if(document.getElementsByClassName("g-c-c")[0].childNodes.length != 11){
    // FOLLOW BUTTON
    var followBtn = document.getElementsByClassName('follow-btn')[0]
    followBtn.addEventListener("click",()=>{
        followBtn.classList.toggle('not-selected')
        let data = {"data": "data"}
        console.log("follow clicked");
        toFetch('/follow',data)
    })
} else{
    var followingBtn = document.getElementById('following-btn')
    // FOLLOWER AND FOLLOWING
    followingBtn.addEventListener('click', () => {
        document.getElementsByClassName('follow-box')[0].classList.toggle('d-none')
    })
    var followerBtn = document.getElementById('follower-btn')
    // FOLLOWER AND FOLLOWING
    followerBtn.addEventListener('click', () => {
        document.getElementsByClassName('follow-box')[1].classList.toggle('d-none')
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

// more button hover styles
let moreBtns = document.getElementsByClassName('more-btn')

for (let i = 0; i < moreBtns.length; i++) {
    moreBtns[i].addEventListener('mouseover',(e)=>{
        e.target.src = 'http://localhost:8000/images/icons/more-btn-hover.svg'

    })
    moreBtns[i].addEventListener('mouseout',(e)=>{
        e.target.src = 'http://localhost:8000/images/icons/more-btn.svg'

    })  
    moreBtns[i].addEventListener('click',(e)=>{
        e.target.parentElement.parentElement.getElementsByClassName('more-options')[0].classList.toggle('d-none')
    })  
}

let deletePosts = document.getElementsByClassName('delete-post')

for (let i = 0; i < deletePosts.length; i++) {
    deletePosts[i].addEventListener('click',(e)=>{
        e.target.parentElement.parentElement.remove()
        console.log(e.target.parentElement.parentElement.getElementsByClassName('d-none')[0]);
        let data = {"data" : e.target.parentElement.parentElement.getElementsByClassName('d-none')[0].innerText}
        toFetch('/profile/post/delete',data)
    })
}