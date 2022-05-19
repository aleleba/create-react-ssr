# Create React SSR

This project aims to have a starter kit for creating a new React app with Server Side Rendering and tools that generally go along with it.

It is not a project like create-react-app, create-react-app is used as a starter kit that handles all your scripts underneath, this is a project for developers who want more control over their application.

Tech(Library or Framework) | Version |
--- | --- |
React (Render Library) | 18.1.0
Redux (Global State Management) | 4.2.0
React Router DOM (Routing) | 6.3.0
Jest (Testing) | 28.1.0
Typescript | 4.6.4

## Setup
To create a new project run in the terminal:
```
npx @aleleba/create-react-ssr app-name
```
Then run:
```
cd app-name
```
You will need to create a new .env file at the root of the project for global config.
This is an exaple of config.
```
#Environment
ENV=development #Default production
#App Port
PORT=3000 #Default 80
#PUBLIC URL
#PUBLIC_URL= #Default /
```
The default environment is production, the app port defauld is 80 and the defauld public url is "/".

### For Development
In the terminal run:
```
npm run start:dev
```
The ENV enviroment variable should be "development" and choose the port of your preference with the enviroment variable PORT.

You will find the root component on:
```
scr/frontend/components/App.tsx
```
You will find the Initial Component on:
```
scr/frontend/components/InitialComponent.tsx
```

The manage of the routes you should find on:
```
scr/routes
```
It is using "useRoutes" hook for working, more information for this here: (https://reactrouter.com/docs/en/v6/api#useroutes)

This will start the app in development mode, also it have Hot Reloading!
Enjoy coding!

### For Production
In the terminal run:
```
npm run build
```
It will create a build folder and run:
```
npm start
```
This will start the app.

## Cheers
Hope you enjoy this proyect! Sincerely Alejandro Lembke Barrientos.
