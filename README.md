# System Architecture Test

This is a repo for testing different folder structures and supporting libraries. Play around with things to see where what should go, and what we should do with things like testing and code structure.

# Instructions for install this repo

1. Clone git repo
2. CouchDB:
	- Install and run CouchDB (For MacOS: `brew install couchdb`)
	- Configure CouchDB:
	    1. Create admin user
	    2. Configuration -> CORS -> Enable Cors
	    3. Navigate to Configuration -> Main Config
	    4. Set couch_httpd_auth.require_valid_user = true
	    5. Set couch_peruser.enable = true
3. Ionic
	- Install ionic CLI (`npm install -g ionic`)
	- Run `ionic serve` in the directory

You finished, **Yay!**

# Instructions for creating setup


2. Ionic: Install ionic CLI (npm install -g ionic)
3. Create project (ionic start architecture-test blank --type=react)
4. Setup gitignore
5. Install Jest, PouchDB and PouchDB Authentication

# Credits

Matthew Bromley, Nathan Chan, Leanne Weaver, Ethan Wong
