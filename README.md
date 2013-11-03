ScrumPoker
==========

Node.js app for distributed Scrum Poker sessions. Scrum Master can reset the voting at which point team members can cast their votes.
Votes remain hidden until the scrum master reveals the results.

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
