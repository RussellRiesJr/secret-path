# the secret path
Using Google Maps Directions API with HTML5 geolocation to create secret directions that are only available at a particular time and place.

![Alt text](http://i.imgur.com/5YhHoWn.png)

Required Dependencies: Angular (1.5.6), Angular-Route (1.5.6), Firebase (3.0.4), Bootstrap (3.3.6)

# Installation
First, fork the project...

Next, bower init...

Then bower install, which will add the following dependencies...
* Angular
* Angular-Route
* Firebase
* Bootstrap

You will also need to install a CORS plugin and set it to intercept ```https://maps.googleapis.com/*``` I recommend [Allow-Control-Allow-Origin:*](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)

# Use
Users can get directions with Google Maps Directions API, next they set an Access Time & Self-Destruct Time. Once satisfied, they can set everything & it gets sent to Firebase, to be accessed when & where specified. The app will then generate a unique URL to be shared with anyone who might access the map. The access location will be the starting address from the directions.
 ![Alt text](http://i.imgur.com/HFzJhKM.png)
 Once a user (using the unque URL) is at the right place at the right time, the results are returned as both a map and as written directions.
 ![Alt text](http://i.imgur.com/6R1NzDY.png)
The Firebase information will be erased at the predetermined "Self-Destruct Time" and no longer be available to anyone.
![Alt text](http://i.imgur.com/Hwvz5Co.png)


