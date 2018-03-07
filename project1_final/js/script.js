//Event Listeners to Handle the onclick
searchbtn.addEventListener("click",photoResults)
searchbtn.addEventListener("click",videoResults)
searchbtn.addEventListener("click",recent)


// Searchbar Handler
$(function(){
	var searchField = $('#searchtxt');
	var icon = $('#searchbtn');

// Focus Event Handler
	$(searchField).on('focus', function(){
		$(this).animate({
			width:'55%'
		},400);
		$(icon).animate({
			left: '38%'
		}, 400);
	});

// Blur Event Handler
	$(searchField).on('blur', function(){
		if(searchField.val() == ''){
			$(searchField).animate({
				width:'45%'
			},400, function(){});
			$(icon).animate({
				left:'30%'
			},400, function(){});
		}
	});

	$('#search-form').submit(function(e){
		e.preventDefault();
	});
})


//Autocompletetion of activatePlacesSearch
function activatePlacesSearch(){
  var input = document.getElementById('searchtxt');
  var autocomplete = new google.maps.places.Autocomplete(input);
}



//building history output
function recent(){
    $("#history ul").append('<li>'+$("#searchtxt").val()+'</li>');
  }


// Building Photos output

var latitude = -34.397;
var longitude = 150.644;
  function photoResults() {
     $('#imageresults').html('');
      var address = $('#searchtxt').val();
      geocoder.geocode({ 'address': address }, function (results, status) {
          if (status == 'OK') {
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
              var photos = null;
              var imageClass = $('.photoImage');
              imageClass.each(function(){
                $('.'+this.className).eq(0).show();
              })

              initialize();  // calling the initialize function
          }
      });
  }
  function initialize() {
      //Geo Coder
      geocoder = new google.maps.Geocoder();
      var pyrmont = new google.maps.LatLng(latitude, longitude);
      var map = new google.maps.Map(document.getElementById('map'), {
          center: pyrmont,
          zoom: 15,
          scrollwheel: false
      });

      // Specify location, radius and place types for google Places API search.
      var request = {
          location: pyrmont,
          radius: '500',
          types: ['locality']
      };

      // Create the PlaceService and send the request.
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function (results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                  var place = results[i];
                  photos = place.photos;
                  var photourl;
                  if (photos && photos[0]) {
                      photourl = photos[0].getUrl({ 'maxWidth': 400, 'maxHeight': 300 });
                  }
                  var photoresults = document.createElement('img');
                  photoresults.setAttribute("src", photourl);
                  photoresults.setAttribute("width", "300");
                  photoresults.setAttribute("height", "300");
                  photoresults.setAttribute("class", "photoImage");
                  $('#imageresults').append(photoresults);
              }
          }
      });
  }

  // Runs the initialize function when the window has finished loading.
  google.maps.event.addDomListener(window, 'load', initialize);


// Building the video Output

function videoResults(){
  // Clear Results
	$('#results').html('');
	$('#buttons').html('');

	// Get Form Input
	q = $('#searchtxt').val();

	// Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			type:'video',
			key: 'AIzaSyC-cKHcnrP-ebo6Y8LUUB1cMZSyLoUp0ao'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				// Log Data
				console.log(data);

				$.each(data.items, function(i, item){
					// Get Output
					var output = getOutput(item);

					// Display Results
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken);

				// Display Buttons
				$('#buttons').append(buttons);
			}
	);
}

// Next Page Function
function nextPage(){
	var token = $('#next-button').data('token');
	var q = $('#next-button').data('searchtxt');

	// Clear Results
	$('#results').html('');
	$('#buttons').html('');

	// Get Form Input
	q = $('#searchtxt').val();

	// Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			pageToken: token,
			type:'video',
			key: 'AIzaSyC-cKHcnrP-ebo6Y8LUUB1cMZSyLoUp0ao'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				// Log Data
				console.log(data);

				$.each(data.items, function(i, item){
					// Get Output
					var output = getOutput(item);

					// Display Results
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken);

				// Display Buttons
				$('#buttons').append(buttons);
			}
	);
}


// Prev Page Function
function prevPage(){
	var token = $('#prev-button').data('token');
	var q = $('#prev-button').data('searchtxt');

	// Clear Results
	$('#results').html('');
	$('#buttons').html('');

	// Get Form Input
	q = $('#searchtxt').val();

	// Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			pageToken: token,
			type:'video',
			key: 'AIzaSyC-cKHcnrP-ebo6Y8LUUB1cMZSyLoUp0ao'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				// Log Data
				console.log(data);

				$.each(data.items, function(i, item){
					// Get Output
					var output = getOutput(item);

					// Display Results
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken);

				// Display Buttons
				$('#buttons').append(buttons);
			}
	);
}

// Build Output
function getOutput(item){
	var videoId = item.id.videoId;
	var title = item.snippet.title;
	var description = item.snippet.description;
	var thumb = item.snippet.thumbnails.high.url;
	var channelTitle = item.snippet.channelTitle;
	var videoDate = item.snippet.publishedAt;

	// Build Output String
	var output = '<li>' +
	'<div class="list-left">' +
	'<img src="'+thumb+'">' +
	'</div>' +
	'<div class="list-right">' +
	'<h3><a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/'+videoId+'">'+title+'</a></h3>' +
	'<small>By <span class="cTitle">'+channelTitle+'</span> on '+videoDate+'</small>' +
	'<p>'+description+'</p>' +
	'</div>' +
	'</li>' +
	'<div class="clearfix"></div>' +
	'';

	return output;
}

// Build the buttons
function getButtons(prevPageToken, nextPageToken){
	if(!prevPageToken){
		var btnoutput = '<div class="button-container">'+'<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	} else {
		var btnoutput = '<div class="button-container">'+
		'<button id="prev-button" class="paging-button" data-token="'+prevPageToken+'" data-query="'+q+'"' +
		'onclick="prevPage();">Prev Page</button>' +
		'<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	}

	return btnoutput;

}
