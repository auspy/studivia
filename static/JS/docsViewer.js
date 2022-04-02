// steps to show images

// 2. get num of pages
// 3. run loop for number of pages 
// 3.1 create number of pages 
// 4. show limited pages in first render.
// 5. load more pages after scroll reaches certain point

var pdfname = document.getElementById("docpathviewer").innerText
console.log(pdfname);

const url = "/uploads" + pdfname.split("uploads")[1]

// // // PDF VIEWER // // //
var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

var currPage = 1; //Pages are 1-based not 0-based
var thePDF = null;
var totalPages

// Asynchronous download of PDF
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function (pdf) {
    console.log('PDF loaded');
    thePDF = pdf
    totalPages = pdf._pdfInfo.numPages
    console.log("totalPages", totalPages);
    let data = {
        "totalpages": totalPages
    }
    toFetch('/pdf-details', data)
    //Start with first page
    pdf.getPage(1).then(handlePages);

    function handlePages(page) {
        //This gives us the page's dimensions at full scale
        var scale = 1.45
        var viewport = page.getViewport({
            scale: scale
        });

        //We'll create a canvas for each page to draw it on
        var canvas = document.createElement("canvas");
        var pagenum = document.createElement("div")
        pagenum.classList.add("page-num", "f-r-c", "m-b-10", "regu-14")
        pagenum.innerHTML = `
      ${currPage} <div class="semi-14 total-pages">/${totalPages}</div>`
        canvas.classList.add("pdf-page", "m-b-30", "the-canvas")
        var wrapcanvas = document.createElement("div")
        wrapcanvas.classList.add("page")

        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        //Draw it on the canvas
        page.render({
            canvasContext: context,
            viewport: viewport
        });

        //Add it to the web page
        document.getElementById("pdf-view").appendChild(wrapcanvas);
        var purchase = true

        // to decide number of pages to be shown
        var showablepages = 2
        if(totalPages<5){
            showablepages =1
        } else if(totalPages<=2){
            showablepages=0
        }
        if (purchase == true) {
            document.getElementsByClassName("page")[currPage - 1].appendChild(pagenum)
            document.getElementsByClassName("page")[currPage - 1].appendChild(canvas)
        } else if(purchase==false && currPage<=showablepages){
            document.getElementsByClassName("page")[currPage - 1].appendChild(pagenum)
            document.getElementsByClassName("page")[currPage - 1].appendChild(canvas)

            // to view more
            if(currPage == showablepages){
                var viewmore = document.createElement('div')
                viewmore.innerHTML=`
                <h3>To view more PURCHASE DOCUMENT or SUBSCRIBE.</h3>`
                document.getElementById('pdf-view').appendChild(viewmore)
            }
        }

        //Move to next page
        currPage++;
        if (thePDF !== null && currPage <= totalPages) {
            thePDF.getPage(currPage).then(handlePages);
        }
    }
}, function (reason) {
    // PDF loading error
    console.error(reason);
});

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