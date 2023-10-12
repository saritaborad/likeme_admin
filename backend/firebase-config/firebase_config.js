const { initializeApp } = require("firebase/app");

const admin = require("firebase-admin");

var serviceAccount = require("./deshcamdemo-firebase-adminsdk-rsn45-3ada56d123.json");

const firebaseConfig = {
 apiKey: "AIzaSyCvMmD5XylYk6x_ZOGcgZCvkoevbmOn_xQ",
 authDomain: "deshcamdemo.firebaseapp.com",
 private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNdrzOah6HkNy+\nd6ywqM9b7oxEBE2Y1oEGLtCif4vaPDwyAKuZLcID+Yrx4IQACV++UaBzljZbPrLi\nb/j/6Wer1P98MtdKSCVn9b5WEFrhzmh4XaG+5smiWR6FOAPf9D2Lr/ItDGnx2o7L\n8QO/CrIV8iafe5+Mb/9sPdrle69UbUms7KL1GT2WP6NHmHWCG4/6xXke+iFZD2wK\nSeCVBiBDaAKgcTgj1UUcOvwBblH6WImFiAgpG9WnTk9lraJ5u/dszmSzaWjPRt/4\n0fKWAvUHXTiZiXD2ozRGIHa0/3rIewI1VDgfxmaw6EjFwAptgTHdZT3/E90gntQ5\n9w1slTCZAgMBAAECggEAAPN5Jj+NCVpN2dxWxxEdO6QWGPPj67VMe0HzPBtkV+AI\nvwH1i3OL4IiXVKYWL+IljCg7hemT22Zh04R0zOz5VMn2BwR/APbBQYHZXveyRKUj\nL0o5aCG5mJ31IqtLfeChWTzNq/nrvgtRFhvL1+CAyhhUYXSHGKC8MAASbX367DLq\nDfWknj3d1qaw6INNTaiR4zms36vkfjPcqSEMROAU5gQjkqIUdn6eM4svazHy7V9X\nYyT7X1P7lSyCGp7qKOFXpUMwsMX3kmnPWjSbhrH9vJsxf0giUY3lCTMDnp5o3nZK\nODskde8wmKrRYwTSngNTrXNg9F44vmQpJIj/oXSTjQKBgQDuYSikMM4m7GPHRonN\nnsXZd+MKr8Z6pDFPsgozKQuiK98DONIDmSRWYEhHCaOQTC0lBkATWDdafeTdYiR5\nzWu6usBjbI0fCx0VODjH+iYAUVbnegaNbIY2U/gNoOcHGldgz/IsXr08dyiaPJJT\neY5Ndqwc6Z8DQgEdxrEZjvtmPQKBgQDcpreCfOrP/pv0MgrUZtdTCflGfIwO1L6D\nRxRdeZ699AibLRa6z7K07bI8mWBPxaOtXj3/1nrCVkIBOjcdNXfpUnmSDWfETcKI\nlWrrKHZd7eicxBzIrRHbZapBJBPENVMG07MkGbFGKrMNjFRiTXsJlVOxSW/3OK9Z\n1wmSKjR1jQKBgQDnZVbvMxUagYNF0Ho6KDKELDUvjXtMV5AqfXgbO2+4h3+fAAwV\nRBYa5rGii3/Dtb5o301ZudtZszVzlS41MiuuAlR47sl6Ze5gR8gOjwtOaabDYhd0\nNvF9UTtL93Hr2i0RpCm/2mM1i7HVLpEYCLoTBeyC0GDz56Fvxwzo83ukPQKBgCW9\nGfvmc57ZdEEC4hlL8Z4RQaJNoQLUXjVDzfbi20Sv3Vz1DEMtTOpnESoOLYvXSNRZ\nHw+H1n0wlZ9yHoUPZQ/x/Dr/sfTAO/pyW9QWmpAcJcHSRP4Jo9k7fTAhBIR1flrX\nkHcnMcvHd9JkYvZhPB76fFMBNXY6KruZ7NgkAc7tAoGAaHvfTwplt/VLaW3ZxXm7\nqoc2bMg47tQSTgob6WZoypKmAvXU3p+xVTZsHoviy0I+3m4EDN3sOO1iKd6fL5pS\nduZeC5nBJ2d4AV+SDv2t4oDw1RhSVWLbFgnatNPHomTgNuevAh1U1OgXBSxFx/FD\niFBC5ldyx56g5rNa6Pvcjlc=\n-----END PRIVATE KEY-----\n",
 projectId: "deshcamdemo",
 storageBucket: "deshcamdemo.appspot.com",
 messagingSenderId: "121880797254",
 appId: "1:121880797254:web:9228cfbc128f4ab6f62a47",
 measurementId: "G-03634VKK3G",
 client_email: "firebase-adminsdk-rsn45@deshcamdemo.iam.gserviceaccount.com",
};

// initializeApp(firebaseConfig);
const adminApp = admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 projectId: "deshcamdemo",
});

module.exports = adminApp;
