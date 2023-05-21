// start by creating data so we don't have to type it in each time
let movieArray = [];

// define a constructor to create movie objects
let MovieObject = function (pTitle, pYear, pGenre, pMan, pWoman, pURL) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.Title = pTitle;
    this.Year = pYear;
    this.Genre = pGenre;  // action  comedy  drama  horrow scifi  musical  western
    this.Man = pMan;
    this.Woman = pWoman;
    this.URL = pURL;
}


movieArray.push(new MovieObject("Moonstruck", 1981, "Drama", "Nicholas Cage", "Cher", "https://www.youtube.com/watch?v=M01_2CKL6PU"));
movieArray.push(new MovieObject("Wild At Heart", 1982, "Drama", "Nicholas Cage", "Laura VanDern", "https://www.youtube.com/watch?v=7uRJartX79Q"));
movieArray.push(new MovieObject("Raising Arizona", 1983, "Comedy", "Nicholas Cage", "Holly Hunter", "https://www.youtube.com/watch?v=NoXJKArYi1g"));
movieArray.push(new MovieObject("USS Indianapolis: Men of Courage", 2016, "Drama", "Nicholas Cage", "Emily Tennant", "https://youtu.be/ZDPE-NronKk"));
movieArray.push(new MovieObject("Venusstruck", 1983, "Drama", "Nicholas Cage", "Cher", "https://www.youtube.com/watch?v=M01_2CKL6PU"));
movieArray.push(new MovieObject("Marsstruck", 1984, "Comedy", "Nicholas Cage", "Cher", "https://www.youtube.com/watch?v=M01_2CKL6PU"));
movieArray.push(new MovieObject("Jupiterstruck", 1985, "Drama", "Nicholas Cage", "Cher", "https://www.youtube.com/watch?v=M01_2CKL6PU"));
movieArray.push(new MovieObject("Saturnstruck", 1986, "Comedy", "Nicholas Cage", "Cher", "https://www.youtube.com/watch?v=M01_2CKL6PU"));



let selectedGenre = "not selected";

document.addEventListener("DOMContentLoaded", function () {

    createList();

// add button events ************************************************************************
    
    document.getElementById("buttonAdd").addEventListener("click", function () {
        movieArray.push(new MovieObject(document.getElementById("title").value, document.getElementById("year").value,
            selectedGenre, document.getElementById("man").value, document.getElementById("woman").value));
        document.location.href = "index.html#ListAll";
        // also add the URL value
    });
    
    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("title").value = "";
        document.getElementById("year").value = "";
        document.getElementById("man").value = "";
        document.getElementById("woman").value = "";
        document.getElementById("URL").value = "";
    });

    $(document).bind("change", "#select-genre", function (event, ui) {
        selectedGenre = $('#select-genre').val();
    });

    document.getElementById("delete").addEventListener("click", function () {
        let localParm = localStorage.getItem('parm');  // get the unique key back from the dictionairy
        deleteMovie(localParm);
        createList();  // recreate li list after removing one
        document.location.href = "index.html#ListAll";  // go back to movie list 
    });

// 2 sort button event methods
    document.getElementById("buttonSortTitle").addEventListener("click", function () {
        movieArray.sort(dynamicSort("Title"));
        createList();
        document.location.href = "index.html#ListAll";
    });

    document.getElementById("buttonSortGenre").addEventListener("click", function () {
        movieArray.sort(dynamicSort("Genre"));
        createList();
        document.location.href = "index.html#ListAll";
    });

    // button on details page to view the youtube video
    document.getElementById("trailer").addEventListener("click", function () {
        window.open(document.getElementById("oneURL").innerHTML);
    });

    document.getElementById("buttonSubsetComedy").addEventListener("click", function () {
       
        createListSubset("Comedy");  // recreate li list after removing one
        //document.location.href = "index.html#ListSome";  // go back to movie list 
    });

    document.getElementById("buttonSubsetDrama").addEventListener("click", function () {
       
        createListSubset("Drama");  // recreate li list after removing one
        //document.location.href = "index.html#ListSome";  // go back to movie list 
    });
// end of add button events ************************************************************************

  
  
// page before show code *************************************************************************
    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#ListAll", function (event) {   // have to use jQuery 
        createList();
    });

    $(document).on("pagebeforeshow", "#ListSome", function (event) {   // have to use jQuery 
        // clear prior data
        var ulMovieList = document.getElementById("ulMovieList");
        ulMovieList.innerHTML = "";
    });

    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#details", function (event) {   
        let localParm = localStorage.getItem('parm');  // get the unique key back from the dictionairy
        // next step to avoid bug in jQuery Mobile,  force the movie array to be current
        movieArray = JSON.parse(localStorage.getItem('movieArray'));  
 
        let localID = GetArrayPointer(localParm); // map to which array element it is
        
 
      // no longer using pointer -1 now that we have real keys
      // document.getElementById("oneTitle").innerHTML = "The title is: " + movieArray[localID-1].Title;

        document.getElementById("oneTitle").innerHTML = "The title is: " + movieArray[localID].Title;
        document.getElementById("oneYear").innerHTML = "Year released: " + movieArray[localID ].Year;
        document.getElementById("oneGenre").innerHTML = "Genre: " + movieArray[localID ].Genre;
        document.getElementById("oneWoman").innerHTML = "Leading Woman: " + movieArray[localID].Woman;
        document.getElementById("oneMan").innerHTML = "Leading Man: " + movieArray[localID].Man;
        document.getElementById("oneURL").innerHTML = movieArray[localID].URL;
    });
 
// end of page before show code *************************************************************************

});  
// end of wait until document has loaded event  *************************************************************************



// next 2 functions ( createList and createListSubset ) could be combined into 1 with a little work
// such as I could pass in a variable which said which divMovieList div it should draw
function createList() {
    // clear prior data
      var ulMovieList = document.getElementById("ulMovieList");
      ulMovieList.innerHTML = "";

    var ul = document.createElement('ul');
    movieArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        // adding a class name to each one as a way of creating a collection
        li.classList.add('oneMovie'); 
        // use the html5 "data-parm" to encode the ID of this particular data object
        // that we are building an li from
        li.setAttribute("data-parm", element.ID);
        li.innerHTML = element.ID + ":  " + element.Title + "  " + element.Genre;
        ulMovieList.appendChild(li);
    });


    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneMovie");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
        // get that data-parm we added for THIS particular li as we loop thru them
        var parm = this.getAttribute("data-parm");  // passing in the record.Id
        // get our hidden <p> and save THIS ID value in the localStorage "dictionairy"
        localStorage.setItem('parm', parm);
        // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
        // current movie array and save it to localStorage as well.
        let stringMovieArray = JSON.stringify(movieArray); // convert array to "string"
        localStorage.setItem('movieArray', stringMovieArray);
        // now jump to our page that will use that one item
        document.location.href = "index.html#details";
        });
    });

};
 

function createListSubset(whichType) {
    // clear prior data
    var ulMovieList = document.getElementById("ulSubsetMovieList");
    ulMovieList.innerHTML = "";

    var ul = document.createElement('ul');
    movieArray.forEach(function (element,) {
        if (element.Genre === whichType) {
            // use handy array forEach method
            var li = document.createElement('li');
            // adding a class name to each one as a way of creating a collection
            li.classList.add('oneMovie');
            // use the html5 "data-parm" to encode the ID of this particular data object
            // that we are building an li from
            li.setAttribute("data-parm", element.ID);
            li.innerHTML = element.ID + ":  " + element.Title + "  " + element.Genre;
            ulMovieList.appendChild(li);
        }
    });


    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneMovie");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
            // get that data-parm we added for THIS particular li as we loop thru them
            var parm = this.getAttribute("data-parm");  // passing in the record.Id
           
            localStorage.setItem('parm', parm);
            // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
            // current movie array and save it to localStorage as well.
            let stringMovieArray = JSON.stringify(movieArray); // convert array to "string"
            localStorage.setItem('movieArray', stringMovieArray);
            // now jump to our page that will use that one item
            document.location.href = "index.html#details";
            });
        });
 
};

// remove a movie from array
function deleteMovie(which) {
    console.log(which);
    let arrayPointer = GetArrayPointer(which);
    movieArray.splice(arrayPointer, 1);  // remove 1 element at index 
}

// cycles thru the array to find the array element with a matching ID
function GetArrayPointer(localID) {
    for (let i = 0; i < movieArray.length; i++) {
        if (localID === movieArray[i].ID) {
            return i;
        }
    }
}

/**
 *  https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
* Function to sort alphabetically an array of objects by some specific key.
* 
* @param {String} property Key of the object to sort.
*/
function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}
