# System Architecture Test

This is a repo for testing different folder structures and supporting libraries. Play around with things to see where what should go, and what we should do with things like testing and code structure.

# Instructions for install this repo

1. Clone git repo
2. FirebaseDB:
	- Navigate to [Firebase](https://firebase.google.com) and login
	- Click "Go to console"
	- Access TimeScape
	- Configure DB with Application
		1. Register App
		2. Run the following script:
		```
		<!-- The core Firebase JS SDK is always required and must be listed first -->
		<script src="https://www.gstatic.com/firebasejs/7.5.2/firebase-app.js"></script>

		<!-- TODO: Add SDKs for Firebase products that you want to use
   		  https://firebase.google.com/docs/web/setup#available-libraries -->

		<script>
  		// Your web app's Firebase configuration
  		var firebaseConfig = {
    		apiKey: "AIzaSyBXAeYJUl12zFhTfWw0UQQUZWlesKqQDwU",
    		authDomain: "timescape-4e406.firebaseapp.com",
    		databaseURL: "https://timescape-4e406.firebaseio.com",
    		projectId: "timescape-4e406",
    		storageBucket: "timescape-4e406.appspot.com",
    		messagingSenderId: "68263258318",
    		appId: "1:68263258318:web:2050374e6821c93215889f"
  		};
  		// Initialize Firebase
  		firebase.initializeApp(firebaseConfig);
		</script>
		
		```

You finished, **Yay!**

# Instructions for creating setup


2. Ionic: Install ionic CLI (npm install -g ionic)
3. Create project (ionic start architecture-test blank --type=react)
4. Setup gitignore
5. Install Jest, PouchDB and PouchDB Authentication
