// Execute after DOM is loaded.
$(function () {

  const dict = {};
  let users = {};

  // Keep track of currently selected amenities.
  $(':checkbox').change(function () {
    if ($(this).is(':checked')) {
      dict[this.id] = this.name;
    } else {
      if (dict[this.id]) {
        delete dict[this.id];
      }
    }

    // Print selected amenities to the page.
    $('div.amenities h4').text($.map(dict, function (v, k) {
      return v;
    }).join(', '));
  });


  checkApiStatus();
  users = getUserNames();
  fetchPlaces(users);

  // Get places based on amenities avaiable when Search button is clicked.
  $('section.filters button').click(function () {
    const amenity_ids = [];
    for (let k in dict) {
      amenity_ids.push(k);
    }
    fetchPlaces(users, amenity_ids);
  });
});

// Check API status.
function checkApiStatus () {
  $.getJSON('http://localhost:5001/api/v1/status/', (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
}

// Create dictionary of users.
function getUserNames () {
  let users = {};
  $.getJSON('http://localhost:5001/api/v1/users/', (data) => {
    $(data).each(function (i) {
      users[data[i].id] = data[i].first_name + ' ' + data[i].last_name;
    })
  });
  return users;
}

// Get place objects.
function fetchPlaces (users = {}, a = []) {
  a = JSON.stringify({'amenities': a});
  $.ajax({
    url: 'http://localhost:5001/api/v1/places_search/',
    data: a,
    method: 'POST',
    contentType: 'application/json',
    success: function (data) {
      let places = [];
      $(data).each(function (i) {
        places.push("<article class=\"articles\"><div class=\"price_by_night\">" + data[i].price_by_night + "</div>" +
		    "<h2>" + data[i].name + "</h2><div class=\"informations\">" +
		    "<div class=\"max_guest\">" + data[i].max_guest + " Guests</div>" +
		    "<div class=\"number_rooms\">" + data[i].number_rooms + " Rooms</div>" +
		    "<div class=\"number_bathrooms\">" + data[i].number_bathrooms + " Bathrooms</div>" +
		    "</div><div class=\"user\"><b>Owner</b>: " + users[data[i].user_id] + "</div>" +
		    "<div class=\"description\">" + data[i].description + "</div></article>");
      });
      const e = document.getElementById('places');
      $('.articles').remove();
      e.insertAdjacentHTML('beforeEnd', places.join(""));
    }
  });
}
