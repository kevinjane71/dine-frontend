import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
      apiKey: "AIzaSyDb1jsqFryH_8dhMRPnB4u5HnZFyZHlKo8",
      authDomain: "messages-d8176.firebaseapp.com",
      projectId: "messages-d8176",
      storageBucket: "messages-d8176.firebasestorage.app",
      messagingSenderId: "882732015360",
      appId: "1:882732015360:web:cd19879eaa970f16ec1de5",
      measurementId: "G-541ST4XD6S"
    };

   const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);

   export { auth };