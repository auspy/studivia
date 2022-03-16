// ?? ?? ?? means doubt
// !! !! !! Problem

/**
 * @license
 * Lodash (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash include="throttle"`
 */

;
(function () {
    function t() {}

    function e(t) {
        return null == t ? t === l ? d : y : I && I in Object(t) ? n(t) : r(t)
    }

    function n(t) {
        var e = $.call(t, I),
            n = t[I];
        try {
            t[I] = l;
            var r = true
        } catch (t) {}
        var o = _.call(t);
        return r && (e ? t[I] = n : delete t[I]), o
    }

    function r(t) {
        return _.call(t)
    }

    function o(t, e, n) {
        function r(e) {
            var n = d,
                r = g;
            return d = g = l, x = e, v = t.apply(r, n)
        }

        function o(t) {
            return x = t, O = setTimeout(c, e), T ? r(t) : v
        }

        function i(t) {
            var n = t - h,
                r = t - x,
                o = e - n;
            return w ? k(o, j - r) : o
        }

        function f(t) {
            var n = t - h,
                r = t - x;
            return h === l || n >= e || n < 0 || w && r >= j
        }

        function c() {
            var t = D();
            return f(t) ? p(t) : (O = setTimeout(c, i(t)), l)
        }

        function p(t) {
            return O = l, S && d ? r(t) : (d = g = l, v)
        }

        function s() {
            O !== l && clearTimeout(O), x = 0, d = h = g = O = l
        }

        function y() {
            return O === l ? v : p(D())
        }

        function m() {
            var t = D(),
                n = f(t);
            if (d = arguments, g = this, h = t, n) {
                if (O === l) return o(h);
                if (w) return O = setTimeout(c, e), r(h)
            }
            return O === l && (O = setTimeout(c, e)), v
        }
        var d, g, j, v, O, h, x = 0,
            T = false,
            w = false,
            S = true;
        if (typeof t != "function") throw new TypeError(b);
        return e = a(e) || 0, u(n) && (T = !!n.leading, w = "maxWait" in n, j = w ? M(a(n.maxWait) || 0, e) : j, S = "trailing" in n ? !!n.trailing : S),
            m.cancel = s, m.flush = y, m
    }

    function i(t, e, n) {
        var r = true,
            i = true;
        if (typeof t != "function") throw new TypeError(b);
        return u(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), o(t, e, {
            leading: r,
            maxWait: e,
            trailing: i
        })
    }

    function u(t) {
        var e = typeof t;
        return null != t && ("object" == e || "function" == e)
    }

    function f(t) {
        return null != t && typeof t == "object"
    }

    function c(t) {
        return typeof t == "symbol" || f(t) && e(t) == m
    }

    function a(t) {
        if (typeof t == "number") return t;
        if (c(t)) return s;
        if (u(t)) {
            var e = typeof t.valueOf == "function" ? t.valueOf() : t;
            t = u(e) ? e + "" : e
        }
        if (typeof t != "string") return 0 === t ? t : +t;
        t = t.replace(g, "");
        var n = v.test(t);
        return n || O.test(t) ? h(t.slice(2), n ? 2 : 8) : j.test(t) ? s : +t
    }
    var l, p = "4.17.5",
        b = "Expected a function",
        s = NaN,
        y = "[object Null]",
        m = "[object Symbol]",
        d = "[object Undefined]",
        g = /^\s+|\s+$/g,
        j = /^[-+]0x[0-9a-f]+$/i,
        v = /^0b[01]+$/i,
        O = /^0o[0-7]+$/i,
        h = parseInt,
        x = typeof global == "object" && global && global.Object === Object && global,
        T = typeof self == "object" && self && self.Object === Object && self,
        w = x || T || Function("return this")(),
        S = typeof exports == "object" && exports && !exports.nodeType && exports,
        N = S && typeof module == "object" && module && !module.nodeType && module,
        E = Object.prototype,
        $ = E.hasOwnProperty,
        _ = E.toString,
        W = w.Symbol,
        I = W ? W.toStringTag : l,
        M = Math.max,
        k = Math.min,
        D = function () {
            return w.Date.now()
        };
    t.debounce = o, t.throttle = i, t.isObject = u, t.isObjectLike = f, t.isSymbol = c, t.now = D, t.toNumber = a, t.VERSION = p, typeof define == "function" && typeof define.amd == "object" && define.amd ? (w._ = t, define(function () {
        return t
    })) : N ? ((N.exports = t)._ = t, S._ = t) : w._ = t
}).call(this);

// // // GLOBAL VARIABLES // // //

var header = document.getElementById("header")
var subHeader = document.getElementById("sub-header")
var testi_var = 0
const hoverSaveDocBtns = document.getElementsByClassName('hover-save-doc-img'),
    hoverAddCartBtns = document.getElementsByClassName('hover-add-cart-img')

// // // ON PAGE LOAD // // //
// to make checkbox on cart page already checked

window.onload = function () {
    zoom()
    quesBox()
    scrollLeft()
    scrollRight()
    addToSavCar(hoverSaveDocBtns, '/saveDoc') // SAVE USING HOVER BUTTON - STUDY MATERIAL
    addToSavCar(hoverAddCartBtns, '/addCart') // ADD TO CART 
    testi_var = 0
    step = 1
}

// // // STICKY HEADER // // //
//throttle is added to reduce number of events launched on each scroll beacuse of sticky header

var stcikyHeader = _.throttle(() => {

    if (window.pageYOffset > 575) {
        header.classList.add("sticky")
        subHeader.classList.add("content")
    } else {
        header.classList.remove("sticky")
        subHeader.classList.remove("content")
    }
}, );

window.addEventListener('scroll', stcikyHeader)

// // // READ MORE // // //
// click - 6 more boxes appear - can go till 36 boxes

function readMore(className, display) {
    const testi = document.getElementsByClassName(className)
    if (testi_var == testi.length) {
        document.getElementsByClassName("readmore-btn").innerHTML = "Read Less"
        testi_var = testi_var + 1

    } else if (testi_var > testi.length) {
        for (let j = 0; j < testi.length; j++) {
            testi[j].style.display = "none";
        }
        testi_var = 0

    } else {
        document.getElementsByClassName("readmore-btn").innerHTML = "Read More"
        testi[testi_var].style.display = display
        testi_var = testi_var + 1
    }
}

// // // BACK TO TOP // // //

function backTop() {
    // window.location.href = "#header";
    $('html,body').animate({
        scrollTop: $('#sub-header').offset().top
    }, 700); //both are same
}

// // // SCROLL ARROWS // // //

// Right

const scrollRightArrowBtns = document.getElementsByClassName('right-arrow-img')

function scrollRight() {
    for (let i = 0; i < scrollRightArrowBtns.length; i++) {
        scrollRightArrowBtns[i].addEventListener('click', function (event) {
            var rightArrowClicked = event.target
            rightArrowClicked.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('div')[3].scrollBy({
                left: 344,
                behavior: 'smooth'
            });
        })
    }
}
// Left

const scrollLeftArrowBtns = document.getElementsByClassName('left-arrow-img')

function scrollLeft() {
    for (let i = 0; i < scrollLeftArrowBtns.length; i++) {
        scrollLeftArrowBtns[i].addEventListener('click', function (event) {
            var leftArrowClicked = event.target
            leftArrowClicked.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('div')[3].scrollBy({
                left: -344,
                behavior: 'smooth'
            });
        })
    }
}

// // // ZOOM BUTTON // // // 

// ?? ?? ?? why does img hides when we dont hover the pdf

const hoverZoomBtns = document.getElementsByClassName('hover-zoom-img')

function zoom() {
    for (let i = 0; i < hoverZoomBtns.length; i++) {
        //to add zoom effect on image
        hoverZoomBtns[i].addEventListener('click', function (event) {
            // ZOOM OUT
            if (event.target.src == 'http://127.0.0.1:5500/images/icons/hover-zoom-out.svg') {
                event.target.parentElement.parentElement.parentElement.getElementsByClassName('pdf-img')[0].getElementsByTagName('img')[0].style.cssText = `
                position: relative; 
                filter: none;
                height: 120px;
                width: 145px;`

                // to change btns position
                event.target.parentElement.parentElement.style.cssText = `
                >button{top: 96px;
                    left: 57px;
                    display: none;}
                    `
                event.target.parentElement.parentElement.style.cssText = `
                    :hover{
                        display: flex;
                    }
                    `
                event.target.src = 'http://127.0.0.1:5500/images/icons/hover-zoom.svg'
                // zoomIn()
                console.log(event)
            } else {
                // ZOOM IN
                event.target.parentElement.parentElement.parentElement.getElementsByClassName('pdf-img')[0].getElementsByTagName('img')[0].style.cssText = `
                position: absolute; 
                filter: drop-shadow(3px 15px 20px rgba(0, 0, 0, 0.18));
                height: 284px;
                width: 192px;
                left: -19px;
                top: 0px;
                z-index: 1;`

                // to change btns position
                event.target.parentElement.parentElement.style.cssText = `
                top: 255px;
                left: 77px;
                display: flex;
                    `

                // to zoom out the image
                event.target.src = 'http://127.0.0.1:5500/images/icons/hover-zoom-out.svg'
                event.target.classList.add('hover-zoom-out-img')
                // zoomOut()
                console.log(event)
            }
        })
    }
}

// // // QUESTION BOX // // //
// ?? ?? ?? not working why?

function quesBox() {
    const descQuesBox = document.getElementsByClassName('down-arrow')
    for (let i = 0; i < descQuesBox.length; i++) {
        descQuesBox[i].addEventListener('click', function (event) {
            var buttonStyle = event.target.parentElement.parentElement.parentElement.getElementsByClassName('c-para-text')[0]
            if (buttonStyle.style.display == 'block') {
                buttonStyle.style.display = 'none'
            } else {
                buttonStyle.style.display = 'block'
            }
        })
    }
}

// // // DOCS DESCRIPTION BUTTONS // // //

// ?? ?? ?? works only on double click why?

function docsDescBtn() {
    var docsDescBtn = document.getElementsByClassName('docs-desc-hover-img')
    for (let i = 0; i < docsDescBtn.length; i++) {
        docsDescBtn[i].addEventListener('click', (event) => {
            var btnBg = event.target.parentElement.parentElement
            var button = event.target.parentElement
            if (btnBg.classList[2] == 'desc-btn-bg-clicked') {
                button.classList.remove('desc-btn-clicked')
                btnBg.classList.remove('desc-btn-bg-clicked')

                if (i == 0) {
                    docsDescBtn[i].style.cssText = `content: url('/images/icons/bookmark.svg');`

                    docsDescBtn[i].style.cssText = `
            :hover{
                content: url('/images/icons/bookmark-blue.svg');}`
                } else {
                    docsDescBtn[i].style.cssText = `content: url('/images/icons/add-to-cart.svg');
                height: 16px;`

                    docsDescBtn[i].style.cssText = `
            :hover{
                content: url('/images/icons/add-to-cart-blue.svg');}`
                }
            } else {
                btnBg.classList.add('desc-btn-bg-clicked')
                button.classList.add('desc-btn-clicked')
                if (i == 0) {
                    docsDescBtn[i].style.cssText = `content: url('/images/icons/bookmark-blue.svg');`
                } else {
                    docsDescBtn[i].style.cssText = `content: url('/images/icons/add-to-cart-blue.svg');
                height: 16px;`
                }
            }
        })
    }
}

// // // QUESTION DESCRIPTION BOX // // //

function descBox() {
    // change color on clicking
    var needed_parent = document.getElementsByClassName('ques-desc-heading')[0].getElementsByTagName('div')
    needed_parent[1].classList.toggle('selected')
    needed_parent[0].classList.toggle('not-selected')

    // hide/show ques-desc-box elements
    document.getElementsByClassName('ques-box')[0].classList.toggle('d-none')
    document.getElementsByClassName('desc-para')[0].parentElement.classList.toggle('d-block')
}

// // // SAVED UPLOAD - MY DOCS // // //

function docsSavedUpload() {
    var neededParent = document.getElementsByClassName('doc-selection-box')[0].getElementsByTagName('h4')
    neededParent[0].classList.toggle('not-selected')
    neededParent[1].classList.toggle('selected')
    var showDocs
    testi_var += 1
    if (testi_var % 2 == 0) {
        // if even
        showDocs = {
            "show": 'uploaded'
        }
    } else {
        showDocs = {
            "show": 'saved'
        }
    }
    // toFetch('/savedUpload',showDocs)

    document.getElementsByClassName('savedDocs')[0].classList.toggle('d-none')
    var uploadDocs = document.getElementsByClassName('uploadDocs')
    for (let i = 0; i < uploadDocs.length; i++) {
        uploadDocs[i].classList.toggle('d-none')

    }

}
// this is how above functions can be made one.
// function toggleBox(className,tagName,visClassName.....) {
//     // change color on clicking
//     var needed_parent = document.getElementsByClassName('ques-desc-heading')[0].getElementsByTagName('div')
//     needed_parent[1].classList.toggle('selected')
//     needed_parent[0].classList.toggle('not-selected')

//     // hide/show ques-desc-box elements
//     document.getElementsByClassName('ques-box')[0].classList.toggle('d-none')
//     document.getElementsByClassName('desc-para')[0].parentElement.classList.toggle('d-block')
// }

// let continueNum = 0 // no use


function onceFunc(func) {
    let called = false;
    return function () {
        if (!called) {
            called = true
            return func()
        }
        return
    }
}

// // // DOCS-DESC LINK SETUP // // //

var descLink = document.getElementsByClassName('desc-link')


for (let i = 0; i < descLink.length; i++) {
    descLink[i].addEventListener('click', function (event) {
        var descLinkId = {
            "docid": descLink[i].getElementsByClassName('d-none')[0].innerText
        }
        console.log('link clicked');
        // to show view document button
        event.target.parentElement.parentElement.getElementsByClassName('doc-desc-link')[0].classList.toggle('d-none')
        var url = '/descLinkClicked'
        // to send needed data to server
        toFetch(url, descLinkId);
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

// // // HOVER BUTTONS - STUDY MATERIAL // // //

function addToSavCar(btnCollection, url) {
    for (let i = 0; i < btnCollection.length; i++) {
        btnCollection[i].addEventListener('click', function (event) {
            let neededData = {
                "docid": event.target.parentElement.parentElement.parentElement.getElementsByClassName('desc-link')[0].getElementsByClassName('d-none')[0].innerText
            }
            // event.target.classList.toggle('')
            toFetch(url, neededData)
        })
    }
}

// // // TO ACCESS THE FILES // // //

// const inputElement = document.getElementById('upDocs')
// inputElement.addEventListener("change", handleFiles, false);
// function handleFiles() {
//   const fileList = this.files;
//   console.log(fileList.length);
// }


// const searchBtns = document.getElementsByClassName('search-btn')

// for (let i = 0; i < searchBtns.length; i++) {
//     searchBtns[i].addEventListener('click',(e)=>{

//     })

// }

// // // FILTER BUTTON // // //
var myDocsFilter = document.getElementById('my-docs-filter')
var filterBtns = document.getElementsByClassName('filter-btn')

for (let i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener('click', (event) => {
        event.target.classList.toggle('filter-clicked')
        event.target.classList.toggle('main-search')
        document.getElementById('filter').classList.toggle('d-none')
    })

}

// // // PROFILE // // //
var owner = document.getElementById("owner")
owner.addEventListener('click', (e) => {
    let data = {
        "user": e.target.innerText
    }
    toFetch('/profile/user', data)
})

