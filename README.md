ScrumPoker
==========

Node.js app for distributed Scrum Poker sessions. 

Setup
-----
Install dependent modules

    npm install
  
Run Server

    node index.js

Clients
-------
Open http://localhost:3000 in your browser, provide a username and wait for the scrum master to fire the 'ready' event.


ScrumMaster
-----------
Open http://localhost:3000/scrummaster in your browser,see when votes are in, reveal votes.
