# RUMAR Adoption Website

## Overview

Welcome to the RUMAR Adoption Website project! This web application is designed to connect potential adopters with rescued pets. The project focuses on creating a user-friendly platform with features like sign-up/log-in, detailed pet profiles, pet listings, pet registration, and human profiles.

## Key Features

- **Sign-Up/Log-In:** Create an account or log in to access personalized features and information.
- **Pet Profiles:** Explore detailed profiles of our adorable pets, showcasing their personalities and characteristics.
- **Pet Listings:** Browse through a comprehensive list of pets available for adoption.
- **Pet Registration:** Register your pet to provide essential information and increase visibility for potential adopters.
- **Human Profiles:** Create and manage your profile, making it easier for us to connect with you and understand your preferences.

## Getting Started

1. **Download Node.js**

   Node.js: https://nodejs.org/en

   verify that you have installed Node and npm by opening the comand prompt and type: node -v and npm -v

2. **Clone the Repository:**

   git clone: https://github.com/uprm-inso4101-2023-2024-s2/semester-project-rumaradoptionapp.git
   
Feel free to explore the codebase, contribute to the project, and help make a positive impact on the lives of animals in need!

3. **Run some commands in your respective ide terminal**

   In the terminal write: npm install

4. **Locally run the webpage**

   After everything has finished installing in the terminal run the command: npm run start



## Possible Error with node_modules Fix

   Error:  return process.dlopen(module, path.toNamespacedPath(filename)); 
   
   Fix #1 Run the commands:
      npm cache clean --force
      Remove-Item -Recurse -Force node_modules
      npm install

   Fix #2 Delete the node_modules folder and run npm install

   

   

   Then go to your browser and search: localhost:3000 or 127.0.0.1:3000

   This should redirect you to our RUMAR landing page
Note:
views Folder is everything that the user sees. That is where the landing page is located.

## New Fix: Delete node_modules
   If still encountering problems, delete the whole node_modules file. Once deleted, go to the terminal and put: 
         npm install
      -This will install *you're* node_modules, so when committing changes, make sure you are not committing them.
   
   After it all downloads, put in the terminal:
          npm run start

      -The terminal should show: 
         > semester-project-rumaradoptionapp@1.0.0 start
         > node index.js

         port running;3000


   Once you see this message, go to your browser and copy & paste this to the search bar: 
         localhost:3000


   And there you should see the Home Page c: YAY!
