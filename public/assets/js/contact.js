function initializeMap(){0!=latContact&&0!=lngContact&&setMapPosition(latContact,lngContact)}function setMapPosition(a,n){var o=new google.maps.Map(document.getElementById("map_canvas"),{center:new google.maps.LatLng(a,n),zoom:15,mapTypeId:google.maps.MapTypeId.ROADMAP}),t=new google.maps.LatLng(a,n);new google.maps.Marker({position:t,map:o,draggable:!0,icon:"/marker.png"})}