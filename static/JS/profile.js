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

