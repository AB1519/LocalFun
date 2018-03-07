var latitude = -33.8665;
var longitude = 151.1956;
function showResults() {
    var address = document.getElementById('address').value;
  //  var videoSearchData = null;
    //youtubeSearch();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
            var photos = null;
            let imageClass = document.getElementsByClassName('collageImg');
            let videoIframes = document.getElementsByClassName('videoIframe');
            console.log('imageClass', imageClass, 'length', imageClass.length);
            console.log('imageClass', videoIframes, 'length', imageClass.length);
            while (imageClass.length > 0) {
                imageClass[0].parentNode.removeChild(imageClass[0]);
            }
            while(videoIframes && videoIframes.length > 0) {
                videoIframes[0].parentNode.removeChild(videoIframes[0])
            }
            initialize();
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
function initialize() {
    /* Geo Coder */
    geocoder = new google.maps.Geocoder();
    // var pyrmont = new google.maps.LatLng(-33.8665, 151.1956);
    var pyrmont = new google.maps.LatLng(latitude, longitude);
    var map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15,
        scrollwheel: false
    });

    // Specify location, radius and place types for your Places API search.
    var request = {
        location: pyrmont,
        radius: '500',
        types: ['store']
    };

    // Create the PlaceService and send the request.
    // Handle the callback with an anonymous function.
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                // If the request succeeds, draw the place location on
                // the map as a marker, and register an event to handle a
                // click on the marker.
                photos = place.photos;
                var photourl;
                if (photos && photos[0]) {
                    photourl = photos[0].getUrl({ 'maxWidth': 300, 'maxHeight': 300 });
                    // console.log('photourl',photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}))
                }
                if (!photourl) {
                    return;
                }
                let anchorPhoto = document.createElement('img');
                anchorPhoto.setAttribute("src", photourl);
                anchorPhoto.setAttribute("width", "304");
                anchorPhoto.setAttribute("height", "228");
                anchorPhoto.setAttribute("class", "collageImg");
                anchorPhoto.setAttribute("alt", "Image couldnt load");
                document.body.appendChild(anchorPhoto);
                if (!photos) {
                    return;
                }
                // var marker = new google.maps.Marker({
                //     map: map,
                //     position: place.geometry.location,
                //     title: place.name,
                //     icon: photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 })
                // });
            }
        }
    });
}

// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', initialize);
// Called when the search button is clicked in the html code

function youtubeSearch() {
     $.ajax({
        cache: false,
        data: {
            key: 'AIzaSyBGNVv9-klRC6-oqq_ZLZ7aqU19BEa8Vp0',
            q: document.getElementById('address').value,
            part: 'snippet'
        },
        dataType: 'json',
        type: 'GET',
        timeout: 5000,
        url: 'https://www.googleapis.com/youtube/v3/search'
    })
    .done(function(resp){
        console.log('done resp',resp.items);
        videoSearchData = resp.items;
        $.each(videoSearchData,function(index,data){
        //     console.log('index',index,'value',data);
        //    let anchorVideo = document.createElement('img');
        //    anchorVideo.setAttribute("src",data.snippet.thumbnails.high.url)
        //    anchorVideo.setAttribute("width", "360");
        //    anchorVideo.setAttribute("height", "480");
        //    anchorVideo.setAttribute("class", "videoImg");
        //    anchorVideo.setAttribute("alt", "Video image thoumbnail couldnt load");
           $("#hyv-player-api").append('<iframe class="videoIframe" width="50%" height="50%" src="https://www.youtube.com/embed/'+data.id.videoId+'?rel=1&showinfo=1" frameborder="0" allowfullscreen=""></iframe>');
        })
    })
}
