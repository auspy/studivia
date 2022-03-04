// // // FETCH FUNCTION // // //
window.onload = function () {}

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

const username = document.querySelector('input[name="username"]')
const userPass = document.querySelector('input[name="userPass"]')
const rSubmit = document.querySelector('input[type="submit"]')
const heading = document.getElementById('header').getElementsByTagName('h3')[0]


const userMail = document.querySelector('input[name="userMail"]')
userMail.addEventListener('change', (e) => {
    let change = e.target.value
    console.log(change);
    let testingValues = /@(gmail|hotmail|outlook|yahoo|icloud|mail|zoho).(com|org|co.in|co.uk|net|in)/
    let sChars = /^\W/
    let uscore = /^_/
    let digit = /^\d/
    if (!userMail.validity.valid) {
        if (!testingValues.test(change)) {
            userMail.setCustomValidity('wrong domian');
        } else if (sChars.test(change)) {
            userMail.setCustomValidity('contains character in starting');
        } else if (uscore.test(change)) {
            userMail.setCustomValidity('contains character in starting');
        } else if (digit.test(change)) {
            userMail.setCustomValidity('contains character in starting');
        } else {
            userMail.setCustomValidity('')
        }
    }
})


userPass.addEventListener('change', (e) => {
    let change = e.target.value
    console.log(e.target.value);
    console.log(change.length);
    let uCaseLetter = /(?=.*?[A-Z])/
    let lCaseLetter = /(?=.*?[a-z])/
    let digit = /(?=.*?[0-9])/
    let sChar = /(?=.*?[#?!@$%^&*-])/
    // let uCaseLetter = /\w/
    // let digit = /\d/
    // let sChar = /\W/

    if (!uCaseLetter.test(change)) {
        userPass.setCustomValidity('Must contain an uppercase letter(A-Z)');
    } else if (!sChar.test(change)) {
        userPass.setCustomValidity('Must contain a special character');
    } else if (!digit.test(change)) {
        console.log(!digit.test(change));
        userPass.setCustomValidity('Must contain a digit(0-9)');
    } else if (!lCaseLetter.test(change)) {
        userPass.setCustomValidity('Must contain a lowercase letter(a-z)');
    } else if (change.length < 8) {
        userPass.setCustomValidity('Must contain atleast 8 digits');
    } else {
        userPass.setCustomValidity('')
    }
})