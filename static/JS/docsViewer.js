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


// Asynchronous download of PDF
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');
  var thePDF = pdf
  var totalPages = pdf._pdfInfo.numPages
  console.log("totalPages",totalPages);
  let data = {"totalpages": totalPages}
  toFetch('/pdf-details',data)
  //Start with first page
  pdf.getPage( 1 ).then( handlePages );
  
  function handlePages(page)
  {
      //This gives us the page's dimensions at full scale
      var scale = 1.45
      var viewport = page.getViewport({ scale : scale} );
  
      //We'll create a canvas for each page to draw it on
      var canvas = document.createElement( "canvas" );
    //   canvas.style.display = "block";
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      //Draw it on the canvas
      page.render({canvasContext: context, viewport: viewport});
  
      //Add it to the web page
      document.getElementById('pdf-view').appendChild( canvas );
  
      //Move to next page
      currPage++;
      if ( thePDF !== null && currPage <= totalPages )
      {
          thePDF.getPage( currPage ).then( handlePages );
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

// var loadingTask = pdfjsLib.getDocument(url);
// loadingTask.promise.then(function(pdf) {
//   console.log('PDF loaded');
//   var totalPages = pdf._pdfInfo.numPages
//   console.log("totalPages",totalPages);
//   var countPromises = [];
//   let data = {"totalpages": totalPages}
//   toFetch('/pdf-details',data)
  
  
//   // Fetch pages
// // PDFJS has a member variable numPages, so you'd just iterate through them. BUT it's important to remember that getting a page in pdf.js is asynchronous, so the order wouldn't be guaranteed. So you'd need to chain them. 
//   var pages = []
//   for (let i = 1; i <= totalPages.length; i++) {
//     pages = pdf.getPage(i)
//   }
//   var pageNumber = 1;
//   pdf.getPage(pageNumber).then(function(page) {
//     console.log('Page loaded');
    
//     var scale = 1.45;
//     var viewport = page.getViewport({scale: scale});

//     // Prepare canvas using PDF page dimensions
//     var canvas = document.getElementsByClassName('the-canvas')[0];
//     var context = canvas.getContext('2d');
//     canvas.height = viewport.height;
//     canvas.width = viewport.width;

//     // Render PDF page into canvas context
//     var renderContext = {
//       canvasContext: context,
//       viewport: viewport
//     };
//     var renderTask = page.render(renderContext);
//     renderTask.promise.then(function () {
//       console.log('Page rendered');
//     });
//   });
// }, function (reason) {
//   // PDF loading error
//   console.error(reason);
// });

// for (let i = 1; i < pdf._pdfInfo.numPages.length+1; i++) {
//     var newpage= document.createElement('div')
//     newpage.classList.add("pdf-page","m-b-15","f-c-c")
//     newpage.innerHTML =`
//     <div class="page-num f-r-c m-b-20">
//     <div class="semi-10">Showing Page:</div>
//     <div class="semi-16-c f-r-c">${i}<div class="semi-16-c total-pages">/${pdf._pdfInfo.numPages}</div>
//     </div>
//       </div>
//       <canvas class="the-canvas"></canvas>`
//       document.getElementById("pdf-view").append(newpage)
    
//       var pageNumber = i;
//       // Fetch the first page
//       pdf.getPage(pageNumber).then(function(page) {
//         console.log('Page loaded');
        
//         var scale = 1.45;
//         var viewport = page.getViewport({scale: scale});
    
//         // Prepare canvas using PDF page dimensions
//         var canvas = document.getElementsByClassName('the-canvas')[i-1];
//         var context = canvas.getContext('2d');
//         canvas.height = viewport.height;
//         canvas.width = viewport.width;
    
//         // Render PDF page into canvas context
//         var renderContext = {
//           canvasContext: context,
//           viewport: viewport
//         };
//         var renderTask = page.render(renderContext);
//         renderTask.promise.then(function () {
//           console.log('Page rendered');
//         });
//       });