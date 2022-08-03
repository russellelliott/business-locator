# Business Locator
Headstarter Summer Fellowship Week 3 Project

## Functionality
This program performs 3 main tasks:
1.  Use Google Maps to plot the locations of businesses.
2.  Plot the location of the user in reference to these markers.
3.  Notify users in real time when they are close to a business.

## Setup
Do `npm i` to install the necessary packages to run this app.

Make a new project in Google Cloud Console
Go to Google Maps platform in the search bar

Click “Create Credentials”, then click “Create API Key”
Make a file called `.env.local`. Don't put the file inside of other folders in the project.
Copy the API key and paste it into the `.env.local` file. It should look like this:
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[your api key]`

Make sure API is enabled
- Google Maps Platform->API

APIs to enable:
-   Directions API
	-   Asking for directions between 2 sets go coordinates
-   Geocoding API
	-   Once we get the address, use this API to covert string to coordinates
-   Maps Javascript API
	-   Using the map itself
-   Places API
	-   For Google Places

## Running the app
Type `npm run dev` to run the app. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Interactive Map and Markers
This app plots random points around the user. These points, as well as the map, are centered in Kitchener, Canada.

From there, the user can specify where they are. If the user doesn't, the notifications will issue an error, as the markers are randomly generated based on the user's location. Toastify notifications are used to notify the user where the nearest business is. From there, the user can pan to said business, and click the marker to plot directions.

## Sources
### Interactive Map with Google Maps API
Tutorial: [https://www.youtube.com/watch?v=2po9_CIRW7I](https://www.youtube.com/watch?v=2po9_CIRW7I)

### Timer
Timer you can turn on and off (tsx file)
[https://codesandbox.io/s/kr21ie?module=%2Fsrc%2FApp.tsx](https://codesandbox.io/s/kr21ie?module=%2Fsrc%2FApp.tsx)

usehooks-ts
[https://www.npmjs.com/package/usehooks-ts](https://www.npmjs.com/package/usehooks-ts)

Timer component
[https://codesandbox.io/s/kr21ie?module=/src/App.tsx&file=/src/App.tsx](https://codesandbox.io/s/kr21ie?module=/src/App.tsx&file=/src/App.tsx)

### React Toast Notifications
Display message with toast (tsx)
[https://www.codegrepper.com/code-examples/javascript/react+toastify+toast+typescript](https://www.codegrepper.com/code-examples/javascript/react+toastify+toast+typescript)

Make your own tastily notification
[https://fkhadra.github.io/react-toastify/introduction/](https://fkhadra.github.io/react-toastify/introduction/)

Iterate over objects (used for iterating over the houses to find the closest one)
[https://www.tutorialspoint.com/typescript/typescript_array_foreach.htm](https://www.tutorialspoint.com/typescript/typescript_array_foreach.htm)

Distance of latitude and longitude degrees
[https://www.usgs.gov/faqs/how-much-distance-does-degree-minute-and-second-cover-your-maps](https://www.usgs.gov/faqs/how-much-distance-does-degree-minute-and-second-cover-your-maps)

Max positive number
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)