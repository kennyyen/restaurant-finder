# Restaurant Finder

## Introduction

An application with services for the hungry hardworking office workers

### Services the application provides

This application provides a service to display the top 60 nearby restaurants around the office. \
It also is capable to suggest a random restaurant among these nearby restaurants. \
Search for a specific restaurant that is not displayed is also avaiable.

### Technologies used

React - "react": "^18.1.0" \
Typescript - "typescript": "^4.6.4" \
Redux - "react-redux": "^8.0.1", "@reduxjs/toolkit": "^1.8.1" \
Google Map - "@react-google-maps/api": "^2.11.8" \
Google Places - "use-places-autocomplete": "^3.0.0" \
Combobox - "@reach/combobox": "^0.17.0"

### Challenges

- Time constrain is one of the most challenging item faced during the completion of this project. \
  A lot of things needs to be picked up during the development (e.g. Google Map Places API)
  - Left out test cases
  - Left out styling details
  * Thorough error case handle is also not handled in UI/UX design

* Google Map `onLoad` triggered twice messing up the restaurants preloading. \
  Added a listener for map 'Idle' event for a complete map load.

* Latest `@react-google-maps/api` library is not fully compateble with latest React, will constantly \
  throws deprecated function errors in the console.

* Typescript typing API data, and management and manage Redux states cost quite some overheads and time consuming

### Interesting features for future enhancement

- Switch the office center, allow user to input location for center, \
  or get user current

- Add direction service, allow user to connect the center with user's destination \
  and draw a trip line

* Allow user to save some restaurants for the suggestion service to randomly pick from

- UI/UX enhancement, better information display page

### Technoloy choices

- #### Redux vs useContext/useProvider hooks:

  - Redux was chosen over React hooks for global state management is because \
    it is more scalable in the future and the template comes with a redux pre-setup. \
    Redux is also one of the technoloty mentioned and used in Cogent's techstack, \
    which will allow a better ability demonstration. \

  - Tradeoffs: the light weight implementation and readability of React native hooks.

* #### Google Places vs Foursquare Places Api:

  - Google Places was chosen over Foursquare Places Api is because \
    Google Maps is the map that I chosed to use, so having Api both comes in from Google \
    I supposed will be easier to manage. Google Places Api also have a hudge community \
    with tons of examples and supports available compare to Foursquare.

  - Tradeoffs: Foursquare serves a different focus of places api, which might give \
    better search results than Google Places Api. Also, Foursquare Places Api might \
    have a lower pricing which will be really important business factor.

* #### Typescript:

  - Typescript provide a significant scalling ability to the application, supports typing \
    better reability and compile time error catching.

  - Tradeoffs: Typescript will require a lot more codes when developing, and type management of \
    external data will be challenging.

### File Structures

    .
    │   .env
    │   .gitignore
    │   package-lock.json
    │   package.json
    │   README.md
    │   tsconfig.json
    │
    ├───public
    │   │   favicon.ico
    │   │   index.html
    │   │   logo192.png
    │   │   logo512.png
    │   │   manifest.json
    │   │   robots.txt
    │   │
    │   └───images
    │           food-location.svg
    │
    └───src
        │   App.css
        │   App.test.tsx
        │   App.tsx
        │   index.css
        │   index.tsx
        │   react-app-env.d.ts
        │   reportWebVitals.ts
        │   setupTests.ts
        │
        ├───app
        │       hooks.ts
        │       store.ts
        │
        └───components
            └───map
                │   Map.module.css
                │   Map.tsx
                │   mapSlice.ts
                │
                └───leftPanel
                    │   LeftPanel.module.css
                    │   LeftPanel.tsx
                    │
                    └───infoPanel
                            InfoPanel.module.css
                            InfoPanel.tsx

## Note

The `.env` file is not supposed to be commited, but kept in here for demo purpose. \
Please get a free Google Map API key and place it in this `.env` for the application \
to run properly. (usually `.gitignore` will include this `.env` file)

## Powered by Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) TS template.

## How to install and run

Recommanded to use React 18 and above, with NodeJS 8.5.5

1. Run command `npm install` or `npm i`
2. Rum command `npm run start` or `npm start`
3. Open a browser, go to [http://localhost:3000](http://localhost:3000) to see the application running

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Links

[Kenny Yen - LinkedIn Profile](https://www.linkedin.com/in/kenny-yen-22887451/).
