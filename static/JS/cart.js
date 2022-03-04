const cartItemPrice = document.getElementsByClassName('cart-item-price')
const cartCheckBoxes = document.getElementsByClassName('cartCheckBox')

window.onload = function allCheckboxTrue() {
    for (let i = 0; i < cartCheckBoxes.length; i++) {
        cartCheckBoxes[i].checked = true;
    }
    updateCartTotal()
    removeFromCartClicked()
    saveForLaterclicked()
    onCheckBoxClick()
    moveToCartClicked()
    cartDesign()
}


// // // EMPTY CART // // //

const cart_item = document.getElementsByClassName('cart-item')

function cartDesign() {
    var cart = document.getElementsByClassName('cart')[0]
    if (cartItemCounter() == 0) {
        // cart_item.parentElement.parentElement.style.display = 'none' // for class cart
        cart.getElementsByClassName('regu-28')[0].innerHTML = 'Your Studivia cart is empty'
        cart.getElementsByClassName('subtotal')[0].style.display = 'none'
        cart.getElementsByClassName('empty-cart')[0].style.display = 'block'
            // to disable checkout button 
         checkoutBtnState()
    } else {
        cart.getElementsByClassName('regu-28')[0].innerHTML = 'Shopping cart'
        cart.getElementsByClassName('subtotal')[0].style.display = 'flex'
        cart.getElementsByClassName('empty-cart')[0].style.display = 'none'
    }
}


// // // TOTAL ITEMS IN CART // // //
// we can run this funciton when:
// 1. add item to cart
// 2. remove element from cart

function cartItemCounter() {
    var count = 0
    for (let i = 0; i < cartItems.querySelectorAll(':scope > div').length; i++) {
        count += 1
    }
    return count
}


function updateItemTotal() {
    var count = 0
    for (let i = 0; i < cartCheckBoxes.length; i++) {
        if (cartCheckBoxes[i].checked == true) {
            count += 1
        }
    }
    var cart_item_num = document.getElementsByClassName('cart-item-num')
    for (let i = 0; i < cart_item_num.length; i++) {
        cart_item_num[i].innerHTML = count

    }
    return count
}

// // // SAVE FOR LATER BUTTON // // //

var saveForLaterBtns = document.getElementsByClassName("save-for-later")

function saveForLaterclicked() {
    for (let i = 0; i < saveForLaterBtns.length; i++) {
        saveForLaterBtns[i].addEventListener('click', function (event) {
            var buttonClicked = event.target
            let needed_parent = buttonClicked.parentElement.parentElement.parentElement
            let needed_child = needed_parent.getElementsByClassName('cart-item-info')[0].getElementsByClassName('f-r-c')[0].getElementsByClassName('doc-info-details')[0].getElementsByTagName('div')
            var img = needed_parent.getElementsByTagName('img')[0].src
            var doc_name = needed_parent.getElementsByClassName('cart-item-info')[0].getElementsByClassName('desc-link')[0].getElementsByTagName('p')[0].innerText
            var course = needed_child[0].innerText
            var doc_type = needed_child[3].innerText
            var subject = needed_child[2].innerText
            var topic = needed_child[4].innerText
            var pages = needed_child[5].innerText
            var college = needed_child[6].innerText
            var owner = needed_child[7].innerText
            var price = needed_parent.parentElement.getElementsByClassName('cart-item-price')[0].innerText
            saveForLater(img, doc_name, course, doc_type, subject, topic, pages, college, owner, price) // to add to saved documents
            needed_parent.parentElement.remove()
            cartDesign()
            updateItemTotal()
            updateCartTotal()
            removeFromCartClicked()
            onCheckBoxClick()
            moveToCartClicked()
            let neededInfo = {
                "docid": needed_parent.getElementsByClassName('desc-link')[0].getElementsByClassName('d-none')[0].innerText,
                "extra": 'save-for-later'
            }
            toFetch('saveDoc', neededInfo)

        })
    }
}

// // // TOTAL ITEMS FOR CHECKOUT // // //

function saveForLater(img, doc_name, course, doc_type, subject, topic, pages, college, owner, price) {
    var savedItem = document.createElement('div')
    savedItem.classList.add('n-pdf-bg', 'pdf-with-user', 'saved-cart-pdf')
    savedItem.innerHTML = `
        <div class="pdf-img">
            <img src=${img} alt=""></div>
        <div class="tag-box">
            <tags style="color: #6463C1 ;">${course}</tags>
            <tags style="color: #FF6889;">${doc_type}</tags>
            <tags style="color: #FF9C28;">${subject}</tags>
            <tags style="color: #60CD83;">${topic}</tags>
        </div>
        <p>${doc_name}</p>
        <div class="smallest-text college">${college} <span>|</span>
            <span class="user">${owner}</span>
        </div>
        <div class="small-semi">${price}</div>
        <!-- <div class="rating">
            <div class="stars">
                <img src="images/icons/star.svg" alt="">
                <img src="images/icons/star.svg" alt="">
                <img src="images/icons/star.svg" alt="">
                <img src="images/icons/star.svg" alt="">
                <img src="images/icons/star.svg" alt="">
            </div>
            <a class="smallest-text" href="#">9,125</a>
        </div> -->
        <div class="smallest-h">${pages} page</div>
        <div class="f-c-c">
            <button class="move-to-cart-button regu-12">Move To Cart</button>
            <a href="study_material.html" class="link">See more like this</a>
            <button class="link delete">Delete</button>
        </div>  
    `
    document.getElementsByClassName('saved-cart-pdf-box')[0].prepend(savedItem)
}


// // // TO UPDATE CART TOTAL // // //

function updateCartTotal() {
    // count a cart-item-price only if checkbox is true
    // reset order-total when new item added or an item is removed
    var orderTotal = 0;
    for (let i = 0; i < cartItemPrice.length; i++) {
        //to check checkbox state
        var cartCheckBoxChecked = cartCheckBoxes[i].checked

        if (cartCheckBoxChecked === true) {
            //to add all values
            var orderTotal = parseFloat(cartItemPrice[i].innerHTML.replace("₹", " ")) + orderTotal;
        }
    }
    var orderTotalElemts = document.getElementsByClassName("order-total")
    for (let i = 0; i < orderTotalElemts.length; i++) {
        orderTotalElemts[i].innerHTML = "₹ " + orderTotal
    }
}



// // // REMOVE FROM CART // // //
// triggered when
// 1. remove item from cart

const deleteCartItemBtns = document.getElementsByClassName("delete-cart")

function removeFromCartClicked() {
    for (let i = 0; i < deleteCartItemBtns.length; i++) {
        var deleteBtn = deleteCartItemBtns[i];
        deleteBtn.addEventListener('click', function (event) {
            let buttonClicked = event.target
            buttonClicked.parentElement.parentElement.parentElement.parentElement.remove()
            updateCartTotal()
            updateItemTotal()
            cartDesign()
            let docId = {
                "docid": event.target.parentElement.parentElement.parentElement.getElementsByClassName('desc-link')[0].getElementsByClassName('d-none')[0].innerText
            }
            toFetch('/addCart', docId)
        })
    }
}

// // // TO UPDATE THINGS ON CHECK BOX CLICK // // //
// to change order total on change in checkbox state

// function so that it works when we click on docs added by move-to-cart button
function onCheckBoxClick() {
    for (let i = 0; i < cartCheckBoxes.length; i++) {
        cartCheckBoxes[i].addEventListener('click', function (event) {
            updateCartTotal()
            updateItemTotal() // to update item count
            checkoutBtnState()
        })
    }
}

// // // REMOVE FROM CART SAVED DOCS // // //

const deleteItemBtns = document.getElementsByClassName("delete")

for (let i = 0; i < deleteItemBtns.length; i++) {
    var deleteBtn = deleteItemBtns[i];
    deleteBtn.addEventListener('click', function (event) {
        let buttonClicked = event.target
        buttonClicked.parentElement.parentElement.remove()
        let docId = {
            "docid": event.target.parentElement.parentElement.getElementsByClassName('desc-link')[0].getElementsByClassName('d-none')[0].innerText
        }
        toFetch('/saveDoc', docId)
    })
}

// // // MOVE TO CART // // //

var movecartBtns = document.getElementsByClassName("move-to-cart-button")

function moveToCartClicked() {
    for (let i = 0; i < movecartBtns.length; i++) {
        movecartBtns[i].addEventListener('click', function (event) {
            var buttonClicked = event.target
            // to get info from target pdf
            var img = buttonClicked.parentElement.parentElement.getElementsByClassName("pdf-img")[0].getElementsByTagName('img')[0].src
            var doc_name = buttonClicked.parentElement.parentElement.getElementsByTagName("p")[0].innerHTML
            var course = buttonClicked.parentElement.parentElement.getElementsByClassName("tag-box")[0].getElementsByTagName('tags')[0].innerHTML
            var doc_type = buttonClicked.parentElement.parentElement.getElementsByClassName("tag-box")[0].getElementsByTagName('tags')[1].innerHTML
            var subject = buttonClicked.parentElement.parentElement.getElementsByClassName("tag-box")[0].getElementsByTagName('tags')[2].innerHTML
            var topic = buttonClicked.parentElement.parentElement.getElementsByClassName("tag-box")[0].getElementsByTagName('tags')[3].innerHTML
            var pages = buttonClicked.parentElement.parentElement.getElementsByClassName("smallest-h")[0].innerHTML
            var for_college = buttonClicked.parentElement.parentElement.getElementsByClassName("college")[0] // to reduce sapce consumed
            var college = for_college.innerText.substring(0, for_college.innerText.indexOf("|") - 1)
            var owner = for_college.getElementsByClassName('user')[0].innerHTML
            var price = buttonClicked.parentElement.parentElement.getElementsByClassName("small-semi")[0].innerHTML
            // to remove target pdf from saved docs
            buttonClicked.parentElement.parentElement.remove()

            // all these functions are triggered when we click move-to-cart button
            moveToCart(img, doc_name, course, doc_type, subject, topic, pages, college, owner, price)
            cartDesign() // to reset layout for added item
            updateItemTotal()
            updateCartTotal()
            removeFromCartClicked() // to reset the number of delete buttons as new item is added
            onCheckBoxClick()
            saveForLaterclicked()
            let docId = {
                "docid": buttonClicked.parentElement.parentElement.getElementsByClassName('desc-link')[0].getElementsByClassName('d-none')[0].innerText,
                "extra": 'move-to-cart'
            }
            toFetch('/addCart', docId)
        })

    }
}



const cartItems = document.getElementsByClassName('cart-items')[0]

function moveToCart(img, doc_name, course, doc_type, subject, topic, pages, college, owner, price) {
    var cartItem = document.createElement('div')
    cartItem.classList.add('cart-item', 'f-r-c-sb')
    cartItem.innerHTML = `
        <div class="f-r-fs">
            <input type="checkbox" id="cartCheckBox3" name="cartItem" value="yes" class="cartCheckBox">
            <img src=${img} alt="">
            <div class="cart-item-info f-c-fs m-l-10">
                <p>${doc_name}</p>
                <div class="f-r-c">
                    <div class="doc-info doc-info-headings">
                        <div class="semi-10">Course</div>
                        <div class="semi-10">Year</div>
                        <div class="semi-10">Subject</div>
                        <div class="semi-10">Doc type</div>
                        <div class="semi-10">Topic</div>
                        <div class="semi-10">Pages</div>
                        <div class="semi-10">college</div>
                        <div class="semi-10">Owner</div>
                    </div>
                    <div class="doc-info doc-info-details c-para-text">
                        <div class="regu-12">${course}</div>
                        <div class="regu-12">2021-2022</div>
                        <div class="regu-12">${subject}</div>
                        <div class="regu-12">${doc_type}</div>
                        <div class="regu-12">${topic}</div>
                        <div class="regu-12">${pages}</div>
                        <div class="regu-12">${college}</div>
                        <div class="regu-12">${owner}</div>
                    </div>
                </div>
                <div class="ctas m-t-10">
                    <button class="link save-for-later">Save for later</button>
                    <p>|</p>
                    <a href="study_material.html" class="link">See more like this</a>
                    <p>|</p>
                    <button class="link delete-cart">Delete</button>
                </div>
            </div>
        </div>
        <h4 class="cart-item-price">${price}</h4>`
    cartItem.querySelector('input[type="checkbox"]').checked = true // to checkbox alreay checked when item is moved to cart
    cartItems.append(cartItem)

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

// // // CHECKOUT // // // 

function readyForCheckout() {
    var idsForCheckout = {
        "docids" : []
    }
    for (let i = 0; i < cart_item.length; i++) {
        if (cartCheckBoxes[i].checked == true) {
            idsForCheckout.docids[i] = cart_item[i].getElementsByClassName('desc-link')[0].getElementsByClassName('d-none')[0].innerText
        }
    }
    console.log(idsForCheckout);
    toFetch('/toCheckout', idsForCheckout)
}

function checkoutBtnState() {
    if (updateItemTotal() === 0) {
        document.getElementById('cart-proceed-cta').disabled = true
    } else {
        document.getElementById('cart-proceed-cta').disabled = false
    }
}
