var APP = APP || {};

window.onload = function(){



  APP.industries = ["toys", "cars", "planes", "bikes"];
  APP.geos = ["america", "asia", "canada"];
  APP.cities = ["chicago", "atlanta", "los angeles"];
  APP.categories = {};
  APP.allThree = false;
  APP.justTwo = false;
  APP.whichTwo = [];
  APP.determineWhichCategory = function(val) {
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
        for (var j = 0; j < this.cities.length; j++) {
          if (this.cities[j] === val[i]) {
            this.whichTwo.push("CITY");
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
      for (var j = 0; j < this.cities.length; j++) {
        if (this.cities[j] === val) {
          this.whichOne = "CITY";
        }
      }
    }
  };
  APP.justOne = false;
  APP.whichOne;
  APP.determineFilterStatus = function() {
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

    }
  }
  APP.categories.category1 = null;
  APP.categories.category2 = null;
  APP.categories.category3 = null;

  APP.people = document.querySelectorAll('li');

  APP.select = document.querySelectorAll('select');

  for (var i = 0; i < APP.select.length; i++) {
    APP.select[i].addEventListener("change", function(e){

        APP.returned = getCategory(e);
        APP.determineFilterStatus();
        filterThePeople();

    });
  }

  function returnCategory (option) {
    if(option.value === "---") {
      return null;
    } else {
      return option.value;
    }
  }

  function getCategory(event) {
    var options = event.target;
    var activeValue;

    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      if( options.name === "GEO" ) {
        if(options[i].selected) {
          APP.categories.category1 = returnCategory(opt);
        }
      } else if ( options.name === "INDUSTRY" ) {
        if(options[i].selected) {
          APP.categories.category2 = returnCategory(opt);
        }
      } else if ( options.name === "CITY" ) {
        if(options[i].selected) {
          APP.categories.category3 = returnCategory(opt);
        }
      }

    }

    return {
      0: APP.categories.category1,
      1: APP.categories.category2,
      2: APP.categories.category3
    };
  }

  function filterThePeople() {

    for (var i = 0; i < APP.people.length; i++) {
      // ALL THREE
      if (APP.allThree) {
        // Iterate over all the data-attributes
        if( (APP.people[i].dataset.geo === APP.categories.category1) &&
            (APP.people[i].dataset.industry === APP.categories.category2) &&
            (APP.people[i].dataset.city === APP.categories.category3) ) {
          APP.people[i].classList.remove("hide");
        } else {
          APP.people[i].classList.add("hide");
        }

      // JUST TWO
      } else if (APP.justTwo) {

        if (APP.whichTwo[0] === "GEO" && APP.whichTwo[1] === "INDUSTRY") {
          if( (APP.people[i].dataset.geo === APP.categories.category1) &&
            (APP.people[i].dataset.industry === APP.categories.category2) ) {
              APP.people[i].classList.remove("hide");
          } else {
            APP.people[i].classList.add("hide");
          }
        } else if (APP.whichTwo[0] === "INDUSTRY" && APP.whichTwo[1] === "CITY") {
          if( (APP.people[i].dataset.industry === APP.categories.category2) &&
            (APP.people[i].dataset.city === APP.categories.category3) ) {
              APP.people[i].classList.remove("hide");
          } else {
            APP.people[i].classList.add("hide");
          }
        } else if (APP.whichTwo[0] === "GEO" && APP.whichTwo[1] === "CITY") {
          if( (APP.people[i].dataset.geo === APP.categories.category1) &&
            (APP.people[i].dataset.city === APP.categories.category3) ) {
              APP.people[i].classList.remove("hide");
          } else {
            APP.people[i].classList.add("hide");
          }
        }

      // JUST ONE
      } else if (APP.justOne) {
        if( APP.whichOne === "GEO" ) {
          if( APP.people[i].dataset.geo === APP.categories.category1 ) {
              APP.people[i].classList.remove("hide");
          } else {
            APP.people[i].classList.add("hide");
          }
        } else if( APP.whichOne === "INDUSTRY" ) {
          if( APP.people[i].dataset.industry === APP.categories.category2 ) {
              APP.people[i].classList.remove("hide");
          } else {
            APP.people[i].classList.add("hide");
          }
        } else if( APP.whichOne === "CITY" ) {
          if( APP.people[i].dataset.city === APP.categories.category3 ) {
              APP.people[i].classList.remove("hide");
          } else {
            APP.people[i].classList.add("hide");
          }
        }
      }
    }

  }

}