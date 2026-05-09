// e:\Sites\sadaqaSite\js\firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Main config (praynotify)
const mainConfig = {
    apiKey: "AIzaSyCmCecvEhU5Q2SaLzngnAM6AX9qeNOJE98",
    authDomain: "praynotify.firebaseapp.com",
    databaseURL: "https://praynotify-default-rtdb.firebaseio.com/",
    projectId: "praynotify",
    storageBucket: "praynotify.appspot.com",
    messagingSenderId: "825282016133",
    appId: "1:825282016133:web:2c3d64ddf1024ddadc8aec",
    measurementId: "G-DKLRSZDEEY"
};

// Auxiliary config for Prayer Times visits (sadaqagariya)
const auxConfig = {
    apiKey: "AIzaSyB9PAARRx7K8xqqkajFE6b6C7N_3HuzJ4Q",
    authDomain: "sadaqagariya.firebaseapp.com",
    projectId: "sadaqagariya",
    storageBucket: "sadaqagariya.firebasestorage.app",
    messagingSenderId: "194519598844",
    appId: "1:194519598844:web:f7b875b7c98e773596f979",
    measurementId: "G-94EM81171K"
};

// Initialize the main standard app
export const mainApp = initializeApp(mainConfig, "[DEFAULT]");
export const mainDb = getDatabase(mainApp);

// Initialize the second app for specific features (like prayer time visits)
export const auxApp = initializeApp(auxConfig, "auxApp");
export const auxDb = getDatabase(auxApp, "https://sadaqagariya-default-rtdb.firebaseio.com/"); // Need to use full URL for fallback to be safe, though config usually handles it
