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

var likeBtns = document.getElementsByClassName('heart-btn')

for (let i = 0; i < likeBtns.length; i++) {
    likeBtns[i].addEventListener('click', (e) => {
        if (e.target.src == 'http://localhost:3000/images/icons/heart.svg') {
            e.target.src = 'http://localhost:3000/images/icons/heart-blue.svg'
        } else {
            e.target.src = 'http://localhost:3000/images/icons/heart.svg'
        }
        let data = {
            "postId": e.target.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('post-id')[0].innerText
        }
        toFetch('/post/like', data)
    })
}

var commentBtnsImg = document.getElementsByClassName('comment-btn')
// var commentBtns = document.getElementsByClassName('comment-real-btn')


// // disable comment button
// for (let i = 0; i < commentBtns.length; i++) {
//     commentBtns[i].disabled = true
// }

for (let i = 0; i < commentBtnsImg.length; i++) {
    commentBtnsImg[i].addEventListener('click', (e) => {
        let commentInput = {
            "comment": e.target.parentElement.parentElement.getElementsByTagName('textarea')[0].value,
            "postid": e.target.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('post-id')[0].innerText
        }
        console.log("comment", commentInput);
        toFetch('/post/comment', commentInput)

        // setInputToEmpty
        e.target.parentElement.parentElement.getElementsByTagName('textarea')[0].value = ""

    })

}

// DISABLE OR ENABLE POST BUTTON
const posttext = document.querySelector("textarea[name='postText']")
const postimg = document.getElementById('file-input')
const postBtn = document.getElementById('post-btn')
postBtn.disabled = true

posttext.addEventListener('input',()=>{
    postBtn.disabled = posttext.value == ''
})

postimg.addEventListener('change',()=>{
    postBtn.disabled = postimg.value = ''
})


// // DISBALE OR ENABLE COMMENT BUTTONS
// const commenttext = document.querySelectorAll('input[name="comment"]')

// for (let i = 0; i < commenttext.length; i++) {
//     commenttext[i].addEventListener('input',()=>{
//         commentBtns[i].disabled =  commenttext[i].value == ''
//     })
// }