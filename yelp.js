function initialize () {
}

var myArray = new Array();
var map;
var newlat = 32.75;
var newlong = -97.13;
var zoomsize = 13;
var radius;

function sendRequest () {
   myArray = new Array();
   var xhr = new XMLHttpRequest();
   var searchtext = document.getElementById("search").value;
   xhr.open("GET", "proxy.php?term="+searchtext+"&latitude="+newlat+"&longitude="+newlong+"&radius="+radius+"&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var outputText = document.getElementById("output");
          outputText.innerHTML="";
          var list = document.createElement("OL");
          var length = json.businesses.length;

          for(var i=0;i<length;i++){

            var parag = document.createElement("P");
            var title = JSON.stringify(json.businesses[i].name,undefined,2);
            var poster = json.businesses[i].image_url;
            var temp= document.createTextNode(title);
            var link = json.businesses[i].url;
            var rating = json.businesses[i].rating;
            var lati = json.businesses[i].coordinates.latitude;
            var longi = json.businesses[i].coordinates.longitude;
            var rating = json.businesses[i].rating;
            var listitem = document.createElement("LI");
            var lidiv = document.createElement("div");
            var picdiv = document.createElement("div");
            myArray[i] = [title,lati,longi];

            parag.appendChild(temp);
            var pic = document.createElement("IMG");
            pic.src = poster;
            pic.style.height = '100px';
            pic.style.width = '100px';
            picdiv.appendChild(pic);
            parag.setAttribute("id",link);
            lidiv.appendChild(parag);
            lidiv.appendChild(picdiv);
            lidiv.appendChild(document.createTextNode("Rating: "+rating));

            parag.onclick = function(){
              window.open(this.id);
            }
            listitem.appendChild(lidiv);
            list.appendChild(listitem);
          }
          outputText.appendChild(list);
            myMap();
       }
   };
   xhr.send(null);
}

function myMap() {
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
        center: new google.maps.LatLng(newlat, newlong),
        zoom: zoomsize,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(mapCanvas, mapOptions);

     google.maps.event.addListener(map, 'bounds_changed', function() {
          var center = map.getBounds().getCenter();
          newlat=center.lat();
          newlong=center.lng();
          var corner = map.getBounds().getNorthEast();
          radius = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(center, corner));
          zoomsize = map.getZoom();
          console.log('radius'+radius);
       });

     for(var i=0;i<myArray.length;i++){
       marker = new google.maps.Marker({position: new google.maps.LatLng(myArray[i][1], myArray[i][2]),
       label: i+1+"",
       map: map});
     }
}
