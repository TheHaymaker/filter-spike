var FILTER = FILTER || {};

$(document).ready(function(){

      // Define filter criteria / options
      FILTER.geos = ["North-America", "Europe-Africa-Latin-America", "Asia-Pacific"];
      FILTER.industries = ["Digital", "Technology", "Corporate-Functions", "Consulting", "Products", "Strategy", "H&PS", "Resources", "CMT", "Financial-Services"];
      FILTER.countries = ["Netherlands", "USA", "Canada", "Argentina", "Germany", "France", "Spain", "Austria", "Singapore", "United-Kingdom", "Switzerland", "Finland", "Belgium", "South-Africa", "Ireland"];

      // store category selections inside nested object
      FILTER.categories = {};

      // Filter state tracking
      FILTER.allThree = false;
      FILTER.justTwo = false;
      FILTER.whichTwo = [];

      // determines which category the value belongs to
      // in the event the category is not available
      FILTER.determineWhichCategory = function(val) {
        if ( this.justTwo ) {
          for (var i = 0; i < val.length; i++) {
            for (var j = 0; j < this.industries.length; j++) {
              if (this.industries[j] === val[i]) {
                this.whichTwo.push("INDUSTRY");
              }
            }
            for (var j = 0; j < this.geos.length; j++) {
              if (this.geos[j] === val[i]) {
                this.whichTwo.push("GEO");
              }
            }
            for (var j = 0; j < this.countries.length; j++) {
              if (this.countries[j] === val[i]) {
                this.whichTwo.push("COUNTRY");
              }
            }
          }
        }

        if ( this.justOne ) {
          for (var j = 0; j < this.industries.length; j++) {
            if (this.industries[j] === val) {
              this.whichOne = "INDUSTRY";
            }
          }
          for (var j = 0; j < this.geos.length; j++) {
            if (this.geos[j] === val) {
              this.whichOne = "GEO";
            }
          }
          for (var j = 0; j < this.countries.length; j++) {
            if (this.countries[j] === val) {
              this.whichOne = "COUNTRY";
            }
          }
        }
      };

      // more Filter state tracking
      // these are used later on
      // and were created to simplify our
      // conditional statements
      FILTER.justOne = false;
      FILTER.whichOne;

      // Determines and updates the state of the filter object
      FILTER.determineFilterStatus = function() {
        if(this.categories.category1 && this.categories.category2 && this.categories.category3) {
          // All three are activated
          this.allThree = true;
          this.justTwo = false;
          this.justOne = false;

        } else if (this.categories.category1 && this.categories.category2 && !this.categories.category3) {
          // just two - 1 and 2
          this.allThree = false;
          this.justTwo = true;
          this.justOne = false;
          this.whichTwo = [];
          this.whichOne = null;
          var x = [this.categories.category1, this.categories.category2];
          this.determineWhichCategory(x);

        } else if (this.categories.category2 && this.categories.category3 && !this.categories.category1) {
          // just two - 2 and 3
          this.allThree = false;
          this.justTwo = true;
          this.justOne = false;
          this.whichTwo = [];
          this.whichOne = null;
          var x = [this.categories.category2, this.categories.category3];
          this.determineWhichCategory(x);

        } else if (this.categories.category1 && this.categories.category3 && !this.categories.category2) {
          // just two 1 and 3
          this.allThree = false;
          this.justTwo = true;
          this.justOne = false;
          this.whichTwo = [];
          this.whichOne = null;
          var x = [this.categories.category1, this.categories.category3];
          this.determineWhichCategory(x);

        } else if (this.categories.category1 && !this.categories.category2 && !this.categories.category3) {
          // just 1 - 1
          this.allThree = false;
          this.justTwo = false;
          this.justOne = true;
          this.determineWhichCategory(this.categories.category1);

        } else if (!this.categories.category1 && this.categories.category2 && !this.categories.category3) {
          // just 1 - 2
          this.allThree = false;
          this.justTwo = false;
          this.justOne = true;
          this.determineWhichCategory(this.categories.category2);

        } else if (!this.categories.category1 && !this.categories.category2 && this.categories.category3) {
          // just 1 - 3
          this.allThree = false;
          this.justTwo = false;
          this.justOne = true;
          this.determineWhichCategory(this.categories.category3);

        } else {
          this.allThree = false;
          this.justTwo = false;
          this.justOne = false;
          this.whichTwo = [];
          this.whichOne = null;
          console.log("None are selected.");
        }
      };

      // Zeros out categories to start
      FILTER.categories.category1 = null;
      FILTER.categories.category2 = null;
      FILTER.categories.category3 = null;

      // Grab all of your related DOM nodes
      FILTER.people = document.querySelectorAll('.filter-list li');
      FILTER.select = document.querySelectorAll('.select-option');
      FILTER.selectOptions = document.querySelectorAll('.select-option option');

      // This manually assigns a string value
      // to the <select> element's name property
      // e.g. <select name="GEO"></select>
      // the .ASPnet system we built this for stripped out
      // our data-, selected and name html attributes in form elements
      // and we needed this data to be consistent available
      FILTER.select[0].name = "GEO";
      FILTER.select[1].name = "INDUSTRY";
      FILTER.select[2].name = "COUNTRY";

      // Function using immediately invoked functions
      // and closures to dynamically assign
      // event listeners to form elements
      FILTER.addListeners = function() {

        for (var i = 0; i < FILTER.select.length; i++) {
          (function(){
            var k = i;

            FILTER.select[k].addEventListener("change", function(e){
              console.log(this);
              var searchVal = this.value;
              var category = this.name;
              FILTER.returned = FILTER.getCategory( FILTER.returnCategory(searchVal), category );
              FILTER.determineFilterStatus();
              FILTER.filterThePeople();

            });


          }());
        }

      };

      // Helper function to return proper data attr
      // from DOM string value
      FILTER.returnCategory = function (option) {
        if(option === "---") {
          return null;
        } else {
          return option;
        }
      };

      // Returns an obj with category names
      // that is ultimately not used
      // but this holds the logic to determine
      // how and with what data occupies
      // the FILTER object's categories
      FILTER.getCategory = function(sv, cat) {

        var searchV = sv;
        var categ = cat;

          // GEO CHECK
          for (var i = 0; i < FILTER.geos.length; i++) {
            if (FILTER.geos[i] === searchV) {
              categ = "GEO";
            }
          }
          // INDUSTRY CHECK
          for (var i = 0; i < FILTER.industries.length; i++) {
            if (FILTER.industries[i] === searchV) {
              categ = "INDUSTRY";
            }
          }
          // COUNTRY CHECK
          for (var i = 0; i < FILTER.countries.length; i++) {
            if (FILTER.countries[i] === searchV) {
              categ = "COUNTRY";
            }
          }

          if( categ === "GEO" ) {
            FILTER.categories.category1 = searchV;
          } else if ( categ === "INDUSTRY" ) {
              FILTER.categories.category2 = searchV;
          } else if ( categ === "COUNTRY" ) {
              FILTER.categories.category3 = searchV;
          }


        return {
          0: FILTER.categories.category1,
          1: FILTER.categories.category2,
          2: FILTER.categories.category3
        }
      };

      // Applies the .hide class to all list items
      // that do not contain any combination of filter options
      // This creates the filtering behavior
      FILTER.filterThePeople = function() {

        for (var i = 0; i < FILTER.people.length; i++) {
          // ALL THREE
          if (this.allThree) {
            // Iterate over all the data-attributes
            if( (this.people[i].classList.contains(this.categories.category1) ) &&
                (this.people[i].classList.contains(this.categories.category2) ) &&
                (this.people[i].classList.contains(this.categories.category3) )) {
              this.people[i].classList.remove("hide");
            } else {
              this.people[i].classList.add("hide");
            }

          // JUST TWO
          } else if (this.justTwo) {

            if (this.whichTwo[0] === "GEO" && this.whichTwo[1] === "INDUSTRY") {
              if( (this.people[i].classList.contains(this.categories.category1) ) &&
                (this.people[i].classList.contains(this.categories.category2)) ) {
                  this.people[i].classList.remove("hide");
              } else {
                this.people[i].classList.add("hide");
              }
            } else if (this.whichTwo[0] === "INDUSTRY" && this.whichTwo[1] === "COUNTRY") {
              if ( (this.people[i].classList.contains(this.categories.category2) ) &&
                ( this.people[i].classList.contains(this.categories.category3) ) ) {
                  this.people[i].classList.remove("hide");
              } else {
                this.people[i].classList.add("hide");
              }
            } else if (this.whichTwo[0] === "GEO" && this.whichTwo[1] === "COUNTRY") {
              if( (this.people[i].classList.contains(this.categories.category1) ) &&
                  (this.people[i].classList.contains(this.categories.category3) )) {
                  this.people[i].classList.remove("hide");
              } else {
                this.people[i].classList.add("hide");
              }
            }

          // JUST ONE
          } else if (this.justOne) {
            if( this.whichOne === "GEO" ) {
              if( this.people[i].classList.contains(this.categories.category1) )  {
                  this.people[i].classList.remove("hide");
              } else {
                this.people[i].classList.add("hide");
              }
            } else if( this.whichOne === "INDUSTRY" ) {
              if( this.people[i].classList.contains(this.categories.category2) ) {
                  this.people[i].classList.remove("hide");
              } else {
                this.people[i].classList.add("hide");
              }
            } else if( this.whichOne === "COUNTRY" ) {
              if( this.people[i].classList.contains(this.categories.category3)) {
                  this.people[i].classList.remove("hide");
              } else {
                this.people[i].classList.add("hide");
              }
            }
          } else {
            this.people[i].classList.remove("hide");
          }
        }
      };

      // Add your listeners...
      FILTER.addListeners();

});