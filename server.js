// // // BASIC // // //
require('dotenv').config();
const express = require("express")
const ejs = require('ejs')
const bodyParser = require('body-parser') // helps us get information inputed by users
const https = require("https")
const passport = require('passport');
const session = require('express-session')
var mySqlStore = require('express-mysql-session')(session);
const mysql = require('mysql')
var LocalStrategy = require('passport-local').Strategy;
const Connection = require("mysql/lib/Connection")
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const e = require('connect-flash');
const {
    resolve
} = require('path');
const {
    reject
} = require('underscore');
const saltRounds = 10;
// var GoogleStrategy = require('passport-google-oauth20').Strategy;

// INITIALIZATION
const app = express()

app.use(express.static(__dirname + '/static'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
})) // url encoded is used to get information from html forms

// CREATE CONNECTION
// sql code: karne_kya_he kispe_karna_he uska_nam_kya_he usme_kya_kya_hoga
var con = mysql.createConnection({
    host: "studiviadb.cnreudh8065g.ap-south-1.rds.amazonaws.com",
    port: "3306",
    user: "auspy",
    password: "password",
    database: "studiviaDB"
})
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     database: "studiviaDB"
// })

// CONNECT
con.connect(function (err) {
    if (err) throw err;
    console.log("connected!")
    // TABLE 
})

// SESSION
var sessionStore = new mySqlStore({}, con);

app.use(session({
    key: 'session_cookie_name',
    secret: ['verysecret', 'notsoimportant', 'highlyprobably', 'secretisneeded'],
    name: "studiviacookieitis",
    store: sessionStore,
    cookie: {
        sameSite: true,
    },
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'));
app.use(flash());

var loginStatus = false

// // // AUTHENTICATION // // //

var currentUser, errorMsg = ''
var savedArr = [],
    uploadArr = [],
    cartArr = []

passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'userPass',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
}, function (req, username, userPass, cb) {
    let sql = "SELECT *,password,username as uid FROM userLedger WHERE username = " + con.escape(username) + "or email =" + con.escape(username)
    con.query(sql, function (err, user) {
        console.log(user);
        if (err) {
            return cb(err);
        }
        if (!user.length) {
            errorMsg = 'Wrong username or password'
            console.log('error', errorMsg)
            return cb(null, false);
        } else if (userPass) {
            bcrypt.compare(userPass, user[0].password, function (err, result) {
                if (result === false) {
                    console.log('Wrong password');
                    errorMsg = 'Wrong password'
                    return cb(null, false);
                } else {
                    var mailChar = /@/
                    if (mailChar.test(String(username))) {
                        req.session["user"] = user[0].uid
                    } else {
                        req.session["user"] = username
                        currentUser = req.session.user
                    
                    // reset the arrays so that current user docs can be filled
                    savedArr = []
                    uploadArr = []
                    cartArr = []
                    findDocs()
                    findDocs('uploaded') // to load upload docs of current user on login
                    findDocs('cart')
                    loginStatus = true
                    console.log("req.session",req.session,"req.session.user",req.session.user);
                    followFunc('follower',req.session.user)
                    followFunc('following',req.session.user)
                    dashFunc(req.session.user)
                    
                    req.session.regenerate((err) => {}) // to regenrate session

                    return cb(null, user[0], req.flash('message', 'welcome'));
                }
                }
            });
        }
    });

}));

passport.serializeUser(function (user, cb) {
    cb(null, {
        username: user.username
    });
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});

// // // GOOGLE OAUTH // // //
// passport.use(new GoogleStrategy({
//         clientID: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         callbackURL: "http://localhost:3000/auth/google/studivia"
//         // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//     },
//     function (accessToken, refreshToken, profile, cb) {

//         let sql = "SELECT * FROM docsLedger WHERE userId = " + profile.id
//         let name = profile.displayName.split(" ")
//         let firstName = name[0]
//         let lastName = name[1]
//         con.query(sql, (err, users) => {
//             if (err) {
//                 console.log('google error');
//                 return cb(err);
//             }
//             if (!users.length) {
//                 let insertUser = "INSERT INTO docsLedger(userId,firstName,lastName) VALUES(" + con.escape(profile.id) + "," + con.escape(firstName) + "," + con.escape(lastName) + ")"
//                 con.query(insertUser, (err) => {
//                     console.log('added new user');
//                 })
//             }
//             console.log('welcome, from google');
//             return cb(null, users, req.flash('message', 'welcome'))
//         })
//     }
// ));


// // // REGISTER PAGE/ SIGN UP PAGE/SETUP MAIL CHIMP // // //

app.post('/register', (req, res, next) => {
    var username = req.body.username
    var email = req.body.userMail
    // to check if the user is already registered
    let sqlCheck = "SELECT * FROM userLedger WHERE username =" + con.escape(username) + " or email =" + con.escape(email)
    con.query(sqlCheck, (err, users) => {
        if (err) throw err;
        if (users != '') {
            // console.log(users[0].Username,'users');
            if (users[0].Username == username) {
                console.log('username already exists');
                res.redirect('/register')
            } else if (users[0].Email == email) {
                console.log('email already registered');
                res.redirect('/register')
            }
        } else {
            // console.log(req.body);
            bcrypt.hash(req.body.userPass, saltRounds, function (err, hash) {
                if (err) throw err;
                // console.log('register form details', req.body);
                let year = Number(req.body.userGradYear.substring(0, 4))
                // to add user to user ledger
                let sql = "INSERT INTO userLedger(firstname,lastname,email,password,username,university,graduation_year,course) VALUES(" + con.escape(req.body.firstName) + "," + con.escape(req.body.lastName) + "," + con.escape(email) + "," + con.escape(hash) + "," + con.escape(req.body.username) + "," + con.escape(req.body.userUniv) + "," + con.escape(year) + "," + con.escape(req.body.userCourse) + ")"
                con.query(sql, function (err) {
                    if (err) throw err;
                    console.log('added to user ledger');
                    res.redirect('/login.html') // we can add a if else in login and use a var to describe situation. like if coming after login we will ask them to login to get started. on writing wrong password we will show error.
                })
                // to create new table for new user
                let newUserTable = "CREATE TABLE " + username + "(docID varchar(16) PRIMARY KEY,saved BIT DEFAULT NULL,cart BIT DEFAULT NULL,uploaded BIT DEFAULT NULL,purchased BIT DEFAULT NULL,lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)"
                let userFTable = "CREATE TABLE " + username + "F( `username` VARCHAR(16) NOT NULL , `follower` BOOLEAN NOT NULL DEFAULT FALSE , `following` BOOLEAN NOT NULL DEFAULT FALSE , `lastUpdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`username`)) ENGINE = InnoDB;"
                let userPTable = "CREATE TABLE " + username + "P( `postid` VARCHAR(20) NOT NULL , `liked` BOOLEAN NOT NULL DEFAULT FALSE , `shared` BOOLEAN NOT NULL DEFAULT FALSE , `saved` BOOLEAN NOT NULL DEFAULT FALSE , PRIMARY KEY (`postid`(16))) ENGINE = InnoDB;"
                con.query(newUserTable, function (err) {
                    if (err) throw err;
                })
                con.query(userFTable, function (err) {
                    if (err) throw err;
                    console.log("created follow table for", username);
                })
                con.query(userPTable, function (err) {
                    if (err) throw err;
                    console.log("created posts table for", username);
                })
            })
        }
    })

    // // to send user data to mailchimp
    // // api key: 903d6a06801c5965a6ac93819f85b1fd-us14
    // //374202afae

    // let data1 = {
    //     members: [{
    //         email_address: req.body.userMail,
    //         status: "subscribed",
    //         merge_fields: {
    //             FNAME: req.body.firstName,
    //             LNAME: req.body.lastName
    //         }
    //     }]
    // }
    // let dataJson = JSON.stringify(data1)
    // const mailchimpUrl = "https://us14.admin.mailchimp.com/lists/374202afae"
    // const options = {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     auth: "studiviaishere:process.env.MAILCHIMP_API"
    // }
    // const request = https.request(mailchimpUrl, options, function (response) {
    //     response.on("data", function (data) {
    //         console.log(data);
    //     })
    // })

    // res.sendFile(__dirname + '/html/dashboard.html')
    // request.write(dataJson)
    // request.end()
})

app.get('/register', (req, res, next) => {
    res.render('register', {
        page: 'Register'
    })
})

// // // LOGIN // // //

app.get('/login.html', function (req, res, next) {
    res.render('login', {
        page: 'Login',
        errorHtml: errorMsg
    })
})

app.post('/login.html', passport.authenticate('local', {
        failureRedirect: '/login.html'
    }),
    function (req, res) {
        console.log('in dash', req.session.user);
        return res.redirect('/dashboard.html')
    });

// // // LISTEN, SERVER START // // //
app.listen(8000, () => {
    console.log('server started yes')
})

// // // ALL PAGES // // //

// need to think of the naming convention of url

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html')
})

// app.get('/auth/google', (res, req) => {
//     passport.authenticate('google', {
//         scope: ['profile']
//     });
// })

// app.get('/auth/google/studivia',
//     passport.authenticate('google', {
//         failureRedirect: '/login'
//     }),
//     function (req, res) {
//         res.redirect('/dashboard.html');
//         // Successful authentication, redirect home.
//     });

app.get('/index.html', function (req, res) {
    req.flash('message', 'Success!!');
    res.sendFile(__dirname + '/html/index.html')
})

app.get('/student_reviews.html', function (req, res) {
    res.render('reviews')
})

app.get('/rankings.html', function (req, res) {
    res.sendFile(__dirname + '/html/rankings.html')
})

app.get('/sell-docs.html', function (req, res) {
    res.render('sell_docs', {
        loginStatusHtml: loginStatus
    })
})

app.get('/pricing.html', function (req, res) {
    res.render('pricing')
})

var userFeedPosts = [],userFeed

// function feedPosts() {
//     // gives all the posts of users our current user is following
//     return new Promise((resolve, reject) => {
//         var feedSql = ''
//         console.log("users i follow", followingUsers, followingUsers.length);
//         if (followingUsers.length > 0) {
//             feedSql = "SELECT * FROM postLedger WHERE username =" + con.escape(followingUsers[0].username)
//             // console.log("sql for =1", feedSql);
//             if (followingUsers.length > 1) {
//                 for (let i = 1; i < followingUsers.length; i++) {
//                     feedSql = feedSql + " OR username =" + con.escape(followingUsers[i].username)
//                     console.log("sql for >1", feedSql);
//                 }
//             }
//             // to get posts of profiles followed by user
//             con.query(feedSql, (err, posts) => {
//                 console.log('sql in query', feedSql);
//                 if (err) throw err;
//                 if (posts.length) {
//                     userFeedPosts = posts // stores the posts needed to show on dashboard
//                     console.log("posts added to feed");
//                     likedStatus() // problem with this is that we have to reload page to get the data. maybe we can use async await to render page when this has finished processing
//                     displayComments() // display comments 
//                 } else {
//                     userFeedPosts = []
//                 }
//                 console.log("userFeedPosts", userFeedPosts);
//             })
//         }
//         resolve(userFeedPosts)
//     })
// }
function feedPosts(user) {
    // gives all the posts of users our current user is following
    var feedSql = ''
    console.log("users i follow", followingUsers, followingUsers.length);
    if (followingUsers.length > 0) {
        feedSql = "SELECT * FROM postLedger WHERE username =" + con.escape(followingUsers[0].username)
        // console.log("sql for =1", feedSql);
        if (followingUsers.length > 1) {
            for (let i = 1; i < followingUsers.length; i++) {
                feedSql = feedSql + " OR username =" + con.escape(followingUsers[i].username)
                console.log("sql for >1", feedSql);
            }
        }
        // to get posts of profiles followed by user
        con.query(feedSql, (err, posts) => {
            console.log('sql in query', feedSql);
            if (err) throw err;
            if (posts.length) {
                userFeedPosts = posts // stores the posts needed to show on dashboard
                console.log("posts added to feed");
                likedStatus(user) // problem with this is that we have to reload page to get the data. maybe we can use async await to render page when this has finished processing
                displayComments() // display comments
            } else {
                userFeedPosts = []
            }
            console.log("userFeedPosts", userFeedPosts);
        })
    }
}

var postsLiked = {},
    postComments = {} // can later on merge as i get more understanding of json

function likedStatus(user) {
    // takes all the posts being shown on feed and gives their like status in a dictionary type datatype
    postsLiked = {}
    // forms dictionary of postid: likedStatus
    for (let i = 0; i < userFeedPosts.length; i++) {
        let checkLiked = "SELECT * FROM " + userFeedPosts[i].postId + " WHERE username =" + con.escape(user)
        console.log("posts on feed", userFeedPosts[i]);
        console.log("id of posts on feed", userFeedPosts[i].postId);

        con.query(checkLiked, (err, rows) => {
            if (err) throw err;
            console.log("liked status rows", rows);
            if (rows.length) {
                if (rows[0].liked == true) {
                    postsLiked[String(userFeedPosts[i].postId)] = true //String doesn't matter
                    // console.log(0,"status true");
                } else {
                    postsLiked[userFeedPosts[i].postId] = false
                    // console.log(0,"status false");
                }
            }
            // else{
            //     postsLiked = {}
            // }
        })
        postStatusCount(userFeedPosts[i].postId, 'liked')
    }
}

var postLikeCount

function postStatusCount(postid, statusName) {
    postLikeCount = 0
    // to be used with liked status on dashboard
    // to count total users who liked/shared/commented on the post
    let totalLikes = "SELECT * FROM " + postid + " WHERE " + statusName + " = true"
    con.query(totalLikes, (err, users) => {
        if (err) throw err;
        if (users.length) {
            postLikeCount = users.length
            console.log("total users who", statusName, postLikeCount);
        }
    })
}

var userComment = {}

function displayComments() {
    // return new Promise((resolve,reject)=>{
    postComments = {}
    for (let i = 0; i < userFeedPosts.length; i++) {
        userComment = {}
        let sql = "SELECT * FROM " + userFeedPosts[i].postId + "P"
        con.query(sql, (err, comments) => {
            if (err) throw err;
            // console.log(comments);
            if (comments.length) {
                // agar comments he to aise bhardo
                for (let j = 0; j < comments.length; j++) {
                    // this creates a json storage for sno and username,comment
                    userComment[comments[j].sno] = [comments[j].username, comments[j].comment]
                }
                postComments[userFeedPosts[i].postId] = userComment

            } else {
                // agar comments nhi he to khali array
                postComments[userFeedPosts[i].postId] = false
            }
            // json storage created in above loop is stored as value for postid(key). so now we have all comments with users which can be called for each post using its postid.
            // console.log("userComment after loop",userComment);
            // console.log("post comments",postComments);
        })
    }
    // resolve()
    // })

}

const dashValues = {}

function dashFunc(user=currentUser) {
    let savedSql = "SELECT * FROM " + user + " WHERE saved = 1"
    let uploadSql = "SELECT * FROM " + user + " WHERE uploaded = 1"
    let cartSql = "SELECT * FROM " + user + " WHERE cart = 1"
    let userPosts = "SELECT * FROM postLedger WHERE userid = " + con.escape(user) + "or username = " + con.escape(user) // total posts by user

    con.query(savedSql, (err, savedCount) => {
        if (err) throw err;
        dashValues["saved"] = savedCount.length
    })

    con.query(uploadSql, (err, uploadCount) => {
        if (err) throw err;
        dashValues["upload"] = uploadCount.length
    })

    con.query(cartSql, (err, cartCount) => {
        if (err) throw err;
        dashValues["cart"] = cartCount.length
    })

    con.query(userPosts, (err, postCount) => {
        if (err) throw err;
        dashValues["posts"] = postCount.length

    })
}

app.get('/dashboard.html',(req, res) => {
    if (req.isAuthenticated()) {
        feedPosts(req.session.user)
            // console.log("userFeedPosts in dash", userFeedPosts);
            // if (userFeedPosts == []) {
            //     postComments = null
            // }
            console.log("dashValues", dashValues);
            // console.log("feed-posts liked status in dash", postsLiked);
            // console.log("post comments in dash", postComments);
            // return res.send('nice')
            res.render('dashboard', {
                usernameHtml: req.session.user,
                savedHtml: dashValues['saved'],
                uploadHtml: dashValues['upload'],
                cartHtml: dashValues['cart'],
                postHtml: dashValues['posts'],
                followerHtml: followerUsers.length,
                followingHtml: followingUsers.length,
                userFeedPostsHtml: userFeedPosts,
                postsLikedHtml: postsLiked,
                likeCountHtml: postLikeCount,
                postCommentsHtml: postComments
            })
            loginStatus = true
    } else {
        loginStatus = false
        return res.redirect('/login.html')
    }
})



app.get('/contact-us.html', function (req, res) {
    res.render('contact')
})

app.get('/checkout.html', function (req, res) {
    res.render('checkout', {
        page: 'Checkout'
    })
})

app.get('/logout', (req, res) => {
    loginStatus = false
    errorMsg = ''
    req.logout()
    req.session.destroy((err) => {})
    res.redirect('/')
})

// // // POST REQUESTS // // //

// // // ON UPLOADING A DOC // // //

var latestDocId
var step = 1

app.post('/sell-docs.html', function (req, res) {
    step = 2
    // UPLOADED DOC DETAILS
    var docName = req.body.name
    var docUniv = req.body.university
    var docType = req.body.docType
    var docLang = req.body.langName
    var docCour = req.body.courseName
    var docSubj = req.body.subName
    var docTopic = req.body.topic
    var docYear = req.body.year
    var docDesc = req.body.desc
    var docPrice = req.body.setPrice
    var docEarn = req.body.earnPer
    console.log(req.body)
    console.log(req.body.upDocs)
    console.log(req.body.upDocs)

    // FOR DOCID : getting last input in docsLedger so that we can increment it whenever new doc is added
    var docCount
    var digits = "0000"
    var lastEntry = "SELECT DocId FROM `docsLedger` ORDER BY `lastUpdated` DESC LIMIT 1;"
    con.query(lastEntry, function (err, neededId) {
        if (err) throw err;
        // to get last 4 digits of DocId
        var lastId = String(neededId[0].DocId)
        var last4digits = lastId.substring(lastId.length - 4)
        var neededNum = parseInt(last4digits) + 1

        // to convert final number into 4 digits and get docID-last-4-digits
        docCount = (digits.substring(String(neededNum).length) + neededNum)
        var docId = (docName.substring(0, 3) + docUniv.substring(0, 3) + docSubj.substring(0, 3) + docLang.substring(0, 2) + docCount).toUpperCase()
        latestDocId = docId

        // ADD DOC TO MAIN LEDGER AND NEWUSER TABLE
        var addDocToLedger = "INSERT INTO docsLedger(DocName,username,DocId,University,Doc_Type,language,course,subject,topic,year,description,price) VALUES (" + con.escape(docName) + "," + con.escape(req.session.user) + "," + con.escape(docId) + "," + con.escape(docUniv) + "," + con.escape(docType) + "," + con.escape(docLang) + "," + con.escape(docCour) + "," + con.escape(docSubj) + "," + con.escape(docTopic) + "," + con.escape(docYear) + "," + con.escape(docDesc) + "," + con.escape(docPrice) + ")"
        var addToNewUser = "INSERT INTO " + req.session.user + "(docID, uploaded) VALUES(" + con.escape(docId) + ", 1)"
        con.query(addDocToLedger, function (err) {
            if (err) throw err;
            console.log('added name', docCount)
        })
        con.query(addToNewUser, function (err) {
            if (err) throw err;
            console.log('added to new user')
        })
        console.log(req.body)
    })

    res.render('sell_docs_2')
})

// TO GET ANS OF DOC RELATED QUESTIONS
app.post('/sell-docs-2.html', function (req, res) {
    var ans1 = req.body.docQues1
    var ans2 = req.body.docQues2
    var ans3 = req.body.docQues3
    var ans4 = req.body.docQues4
    var ans5 = req.body.docQues5
    var ans6 = req.body.docQues6

    var addAns = "UPDATE `docsLedger` SET `ans1` = " + con.escape(ans1) + ",`ans2`= " + con.escape(ans2) + ", `ans3`= " + con.escape(ans3) + ", `ans4`= " + con.escape(ans4) + ", `ans5`= " + con.escape(ans5) + ", `ans6`= " + con.escape(ans6) + " WHERE `docsLedger`.`DocId` = " + con.escape(latestDocId) + ";"
    con.query(addAns, function (err) {
        if (err) throw err;
        console.log('updated')
    })
    findDocs('uploaded') // will be added to send for verification of step 3 when i create one
    res.render('sell_docs_3')
})

// // // STUDY MATERIAL DOCS // // //

// LATEST DOCS

app.get('/study_material.html', function (req, res) {
    if (req.isAuthenticated()) {
        // to get values for new pdfs
        var latestDocs = 'SELECT DocId,DocName,Username,Course,University,Doc_Type,Subject,Topic,Price FROM `docsLedger` ORDER BY lastUpdated DESC LIMIT 20;'
        con.query(latestDocs, function (err, neededInfo) {
            if (err) throw err;
            for (let i = 0; i < neededInfo.length; i++) {
                // console.log(neededInfo)
                return res.render("study_material", {
                    neededInfoList: neededInfo
                })
            }
        })
        loginStatus = true
    } else {
        res.redirect('/login.html')
        loginStatus = false
    }
})

// // // DOCS DESC // // //
var docDescList

// to get data of document clicked from client and then sql
app.use(express.json({
    limit: '1mb'
}))
app.post('/descLinkClicked', function (req, res) {
    // console.log(req.body);
    var docNeeded = "SELECT * FROM docsLedger WHERE docid = " + con.escape(req.body.docid)
    con.query(docNeeded, function (err, docDesc) {
        if (err) throw err;
        docDescList = docDesc
        // console.log(docDescList);
    })
})
// console.log('outside',docDescList);

// to use data sent by client on button click and create needed page using ejs template
app.get('/doc-desc', function (req, res) {
    // console.log('inside',docDescList[0].DocName);
    return res.render('docsViewer', {
        docDescList1: docDescList[0],
        documentName: docDescList[0].DocName,
        course: docDescList[0].Course,
        subject: docDescList[0].Subject,
        university: docDescList[0].University,
        topic: docDescList[0].Topic,
        year: docDescList[0].Year,
        type: docDescList[0].Doc_Type
    })
})

// // // ADD TO CART OR SAVED DOCS // // //
addToSavCarServer('/addCart', 'cart')
addToSavCarServer('/saveDoc', 'saved')

function addToSavCarServer(url, savCar) {
    app.post(url, function (req, res) {
        // console.log(req.body.docid);
        let idSearch = "SELECT saved,cart,uploaded,purchased FROM " + req.session.user + " WHERE docid =" + con.escape(req.body.docid)
        con.query(idSearch, (err, savedColValue) => {
            if (savedColValue != "") {
                var savCarBothNull = savedColValue[0].saved == null && savedColValue[0].cart == null
                var upPurBothNull = savedColValue[0].uploaded == null && savedColValue[0].purchased == null
                var upOrPurNotNull = savedColValue[0].uploaded != null || savedColValue[0].purchased != null
                if (savCar == 'saved') {
                    var onClick1 = savedColValue[0].saved == null && savedColValue[0].cart != null
                    var onClickBothNull = savedColValue[0].saved != null && savedColValue[0].cart == null

                } else {
                    var onClick1 = savedColValue[0].saved != null && savedColValue[0].cart == null
                    var onClickBothNull = savedColValue[0].saved == null && savedColValue[0].cart != null
                }
            }
            // console.log(savedColValue);
            if (err) throw err;
            else if (savedColValue == "") {
                // when ye id he hi nhi table me
                // console.log('situation 1 and saved+cart value is', savedColValue[0]);
                // console.log('will add', req.body.docid);
                let sql = "INSERT INTO " + req.session.user + "(docid," + savCar + ") VALUES(" + con.escape(req.body.docid) + ",1)"
                con.query(sql, (err) => {
                    if (err) throw err;
                    console.log('inserted', req.body.docid, 'to findDocs')
                })
            } else if ((savedColValue[0].saved != null && savedColValue[0].cart != null) || (onClickBothNull && upOrPurNotNull)) {
                // when saved aur cart dono 1 he and button click hua. so, ab ek ko null karna he
                if (req.body.extra == 'save-for-later') {
                    let sql = "UPDATE " + req.session.user + " SET cart = NULL WHERE docid =" + con.escape(req.body.docid)
                    con.query(sql, (err) => {
                        if (err) throw err;
                        console.log('updated null in cart for', req.body.docid, 'beacuse already in saved')
                    })
                } else if (req.body.extra == 'move-to-cart') {
                    let sql = "UPDATE " + req.session.user + " SET saved = NULL WHERE docid =" + con.escape(req.body.docid)
                    con.query(sql, (err) => {
                        if (err) throw err;
                        console.log('updated null in saved for', req.body.docid, 'beacuse already in cart')
                    })
                } else {
                    let sql = "UPDATE " + req.session.user + " SET " + savCar + " = NULL WHERE docid =" + con.escape(req.body.docid)
                    con.query(sql, (err) => {
                        if (err) throw err;
                        console.log('updated null in ' + savCar + ' for', req.body.docid, 'for cart')
                    })
                }
                findDocs()
                findDocs('cart')
                // console.log('situation 2 and saved+cart value is', savedColValue[0],'+ sql is',sql);
                // console.log('will update', req.body.docid);

            } else if (onClick1 || (savCarBothNull && upOrPurNotNull)) {
                // when saved ya cart dono me se ek 1 he and dusre ka button click hua OR saved + cart dono null he but uploaded and purchased me se koi null nhi he. so, ab null wale ko 1 karna he
                // console.log('condition 4', onClick1);
                // console.log('situation 3 and saved+cart value is', savedColValue[0]);
                if (req.body.extra == 'move-to-cart') {
                    let sql = "UPDATE " + req.session.user + " SET " + savCar + " = 1,saved = null WHERE docid =" + con.escape(req.body.docid)
                    con.query(sql, (err) => {
                        if (err) throw err;
                        console.log('updated 1 in ' + savCar + 'for', req.body.docid, 'and removed this from saved')
                        // will check count of both again

                    })
                } else if (req.body.extra == 'save-for-later') {
                    let sql = "UPDATE " + req.session.user + " SET " + savCar + " = 1, cart = null WHERE docid =" + con.escape(req.body.docid)
                    con.query(sql, (err) => {
                        if (err) throw err;
                        console.log('updated 1 in ' + savCar + 'for', req.body.docid, 'and removed from cart')
                    })
                } else {
                    let sql = "UPDATE " + req.session.user + " SET " + savCar + " = 1 WHERE docid =" + con.escape(req.body.docid)
                    con.query(sql, (err) => {
                        if (err) throw err;
                        console.log('updated 1 in ' + savCar + 'for', req.body.docid, 'in', req.session.user)
                    })
                }
                findDocs()
                findDocs('cart')
            } else if ((onClickBothNull || savCarBothNull) && (upPurBothNull)) {
                // when is id me dono null ya phir jo 1 tha uska button click hua to ab wo bhi null he. lekin delete tabhi hoga agar uploaded and purchased dono null he
                let sql = "DELETE FROM " + req.session.user + " WHERE docid =" + con.escape(req.body.docid)
                // console.log('situation 4 and saved+cart value is', savedColValue[0]);
                con.query(sql, (err) => {
                    if (err) throw err;
                    console.log('removed', req.body.docid, 'from table')
                })
            }
        })
    })
}

// // // SHOW SAVED DOCS and UPLOADED DOCS IN MY_DOCS // // //


function findDocs(docs = 'saved') {
    if (docs == 'cart') {
        cartArr = []
    }
    savedArr = [] // since saved docs can be removed we need to reset the list and count again unlike uploaded which remains same after running once
    // i want to run this only when a new document is uploaded or server is started again
    // and for saved whenever user clicks on saved button and on server restart
    //?? ?? ?? agar saved docs badh jae to for loop boht bar chalega jissse system slow ho skta he. kya isse solve karne ka koi tarika he?
    let sql = " SELECT docid FROM " + currentUser + " WHERE " + docs + " =1"
    con.query(sql, (err, neededId) => {
        if (err) throw err;
        console.log(sql, neededId)
        neededId.forEach((item, index) => {
            let sql = "SELECT DocId,DocName,Username,Course,year,University,Doc_Type,Subject,Topic,Price FROM `docsLedger` WHERE docid =" + con.escape(item.docid)
            con.query(sql, (err, neededInfo) => {
                if (err) throw err;
                // to make tags shorter
                if (neededInfo[0].Doc_Type == 'Assignment') {
                    neededInfo[0].Doc_Type = 'Assign.'
                } else if (neededInfo[0].Doc_Type == 'Question Paper') {
                    neededInfo[0].Doc_Type = 'QuesP.'
                }
                if (docs == 'saved') {
                    savedArr[index] = neededInfo
                    if (index == neededId.length - 1) {
                        console.log('saved array length', savedArr.length);
                    }
                } else if (docs == 'uploaded') {
                    uploadArr[index] = neededInfo
                } else if (docs == 'cart') {
                    cartArr[index] = neededInfo
                    if (index == neededId.length - 1) {
                        console.log('cart array length', cartArr.length);
                    }
                }
            })
        });
        // console.log('new','saved array', savedArr.length, savedArr ,'uploaded array' ,uploadArr)
    })
}

app.get('/my-docs.html', function (req, res) {
    return res.render('my_docs', {
        infoList: savedArr,
        infoList1: uploadArr
    })
})

// // // SHOW DOCS IN CART // // //

app.get('/cart.html', function (req, res) {
    if (req.isAuthenticated() == true) {
        res.render('cart', {
            cartArrHtml: cartArr,
            savedArrHtml: savedArr
        })
    } else {
        res.redirect('/login.html')
    }
})

app.post('/toCheckout', (req, res) => {
    console.log('server', req.body.docids);
    res.redirect('/checkout.html')
})

// // // SEARCH // // //

app.get('/search-result.html', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('search')
    } else {
        res.redirect('/login.html')
    }
})

// STUDY MATERIAL SEARCH

app.post('/search', (req, res) => {
    console.log(req.body.searchInput);
    let words = req.body.searchInput.split(" ")
    console.log(words, words[1], words.length);
    let pre = "'%"
    let post = "%'"
    let sql = "SELECT DocId,DocName,Username,Course,year,University,Doc_Type,Subject,Topic,Price FROM docsLedger WHERE docname LIKE " + pre + words[0] + post
    if (words.length > 1) {
        for (let i = 1; i < words.length; i++) {
            let addToSql = " OR docname LIKE " + pre + words[i] + post
            sql = sql + addToSql
        }
    }
    con.query(sql, (err, docs) => {
        if (err) throw err;
        console.log(docs[0]);
        res.render('search', {
            docsHtml: docs,
            heading: req.body.searchInput,
            totalResults: docs.length
        })
    })
})

// // // CREATE POST // // //

app.post('/new-post', (req, res) => {
    console.log(req.body);
    console.log(req.session.user);
    // create postId
    let sql = "SELECT firstname,userid FROM userLedger WHERE username =" + con.escape(req.session.user)
    let userPosts = "SELECT * FROM postLedger WHERE userid = " + con.escape(req.session.user) + "or username = " + con.escape(req.session.user) // total posts by user
    let totalPosts = "SELECT * FROM postLedger"
    con.query(sql, (err, user) => {
        console.log(user, "user");
        if (err) throw err;
        con.query(userPosts, (err, posts) => {
            if (err) throw err;
            con.query(totalPosts, (err, tPosts) => {
                if (err) throw err;
                let digits = "0000" + String(posts.length)
                let tPostDigits = "0000" + String(tPosts.length)
                let postid = req.session.user.substring(0, 3).toUpperCase() + String(user[0].firstname).substring(0, 3).toUpperCase() + digits.substring(digits.length - 4) + tPostDigits.substring(tPostDigits.length - 4)
                console.log(postid);
                // add post to post ledger
                let addPost = "INSERT INTO postLedger(username,userId,postId,content) VALUES(" + con.escape(req.session.user) + "," + con.escape(user[0].userid) + "," + con.escape(postid) + "," + con.escape(req.body.postText) + ")"
                con.query(addPost, (err) => {
                    if (err) throw err;
                    console.log(postid, " add to postLedger");
                })
                let postTable = "CREATE TABLE " + postid + " ( `username` VARCHAR(16) NOT NULL , `liked` BOOLEAN NOT NULL DEFAULT FALSE , `shared` BOOLEAN NOT NULL DEFAULT FALSE , `saved` BOOLEAN NOT NULL DEFAULT FALSE , `lastUpdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`username`)) ENGINE = InnoDB;"
                let postTableP = "CREATE TABLE " + postid + "P( `sno` INT(5) NOT NULL , `username` VARCHAR(16) NOT NULL , `comment` VARCHAR(500) NOT NULL , `lastUpdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`sno`)) ENGINE = InnoDB;"
                con.query(postTable, (err) => {
                    if (err) throw err;
                    console.log("created post table for", postid);
                })
                con.query(postTableP, (err) => {
                    if (err) throw err;
                    console.log("created post table P for", postid);
                })
            })
        })
    })
    res.redirect('/dashboard.html')
})

// // // PROFILE // // //
var profileUser = currentUser,
    followStatus = true,
    followSql, followingUsers = [],
    followerUsers = []
app.get("/profile", (req, res) => {
    followFunc("follower")
    followFunc("following")
    if ((profileUser == req.session.user) || (profileUser == req.session.user.toUpperCase())) {
        followStatus = false
    } else {
        followStatus = true
    }
    console.log("followStatus", followStatus, profileUser);
    if (req.isAuthenticated()) {
        let sql = "SELECT * FROM postLedger WHERE username = " + con.escape(profileUser)
        con.query(sql, (err, posts) => {
            if (err) throw err;
            console.log('posts', posts);
            console.log("followingUsers", followingUsers);
            res.render('profile', {
                postsHtml: posts,
                followStatusHtml: followStatus,
                usersHtml: followingUsers,
                followerUsersHtml: followerUsers
            })
        })
    } else {
        res.redirect('/login.html')
    }
})

function followFunc(data,user=currentUser) {
    // return new Promise((resolve, reject) => {
        // console.log("followFunc parameter and user",data,req.session.user);
        console.log("current user in follow func",user);
        followSql = "SELECT username FROM " + currentUser + "F WHERE " + data + " = true;"
        con.query(followSql, (err, users) => {
            if (err) throw err;
            if (data == "following") {
                followingUsers = users
                // console.log(req.session.user, "is ",data, users);
                // console.log("followingUsers.length",followingUsers.length);
            } else {
                followerUsers = users
                // console.log("followerUsers.length",followerUsers.length);
            }
        })
        if (data == "following") {
            return(followingUsers.length)
        } else {
            return(followerUsers.length)
        }
    // })
}

// SENDS USER WHOSE PROFILE WE NEED TO DISPLAY
app.post('/profile/user', (req, res) => {
    console.log("fetch from index", req.body);
    profileUser = req.body.user.toUpperCase()
    res.redirect('/profile')
})

// // // FOLLOW // // //

app.post('/follow', (req, res) => {
    let checkTable = "SELECT * FROM " + req.session.user + "F WHERE username = " + con.escape(profileUser.toLowerCase())
    con.query(checkTable, (err, users) => {
        if (users.length) {
            console.log("users.following", users);
            if (users[0].following == 1) {
                console.log("user already exists");
                let sql = "UPDATE " + req.session.user + "F SET following = false WHERE username = " + con.escape(profileUser.toLowerCase()) + ";"
                con.query(sql, (err) => {
                    if (err) throw err;
                    console.log(sql, req.session.user, "unfollowed", profileUser.toLowerCase());
                })
            } else {
                console.log("user already exists");
                let sql = "UPDATE " + req.session.user + "F SET following = true WHERE username = " + con.escape(profileUser.toLowerCase()) + ";"
                con.query(sql, (err) => {
                    if (err) throw err;
                    console.log(sql, req.session.user, "followed", profileUser.toLowerCase());
                })
            }
        } else {
            let sql = "INSERT INTO " + req.session.user + "F(username,following) VALUES(" + con.escape(profileUser.toLowerCase()) + ",true)"
            con.query(sql, (err) => {
                if (err) throw err;
                console.log(req.session.user, "followed", profileUser.toLowerCase());
            })
        }
        followFunc("following")
        followFunc("follower")
    })
})

// // // LIKE/SAVE POST // // //
var liked = false
app.post('/post/like', (req, res) => {
    console.log(req.body.postId);
    res.send('liked')
    let checkUser = "SELECT * FROM " + req.body.postId + " WHERE username = " + con.escape(req.session.user)
    con.query(checkUser, (err, users) => {
        if (err) throw err;
        var likeSql, addPostToP
        if (users.length) {
            console.log("user already interacted with the post");
            if (users[0].liked == true) {
                likeSql = "UPDATE " + req.body.postId + " SET liked = false WHERE username = " + con.escape(req.session.user)
                console.log(req.session.user, "unliked", req.body.postId);
                liked = false
                addPostToP = "UPDATE " + req.session.user + "P SET liked = false WHERE postid = " + con.escape(req.body.postId)

            } else {
                likeSql = "UPDATE " + req.body.postId + " SET liked = true WHERE username = " + con.escape(req.session.user)
                console.log(req.session.user, "liked", req.body.postId);
                liked = true
                addPostToP = "UPDATE " + req.session.user + "P SET liked = true WHERE postid = " + con.escape(req.body.postId)
            }
        } else {
            likeSql = "INSERT INTO " + req.body.postId + "(username,liked) VALUES(" + con.escape(req.session.user) + ", true ) "
            console.log(req.session.user, "inserted into table and liked", req.body.postId);
            liked = true
            addPostToP = "INSERT INTO " + req.session.user + "P(postid) VALUES(" + con.escape(req.body.postId) + ")"
        }
        con.query(addPostToP, (err) => {
            if (err) throw err;
            console.log("added", req.body.postId, "to", req.session.user, "P");
        })
        con.query(likeSql, (err) => {
            if (err) throw err;
            console.log(likeSql, "sql used in like query");
        })
    })
})

// // // COMMENT // // //

// GET COMMENT FROM USER
app.post('/post/comment', (req, res) => {
    console.log("comment", req.body);
    // in postid table
    let sqlPost = "INSERT INTO " + req.body.postid + "P(username,comment) VALUES(" + con.escape(req.session.user) + "," + con.escape(req.body.comment) + ")"
    con.query(sqlPost, (err) => {
        if (err) throw err;
        console.log("inserted into", req.body.postid, "table", req.body.comment);
    })
})

// problem is feedPosts are not getting list of following users on time which is causing is