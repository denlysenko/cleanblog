# blog on sails.js

Backend is made on Sails.js using Socket.IO. Layout is taken from here

Members are divided into two categories - administrators with the right to control the rest of the users, the ability to change the design of the site as well as content management (add, delete, and modify), and regular users - only content management.

As an editor WISIWYG there is used CKEditor.

The application uses Socket.io to alert any user activity in real time (authorization, the addition or removal of posts, users, the list of users online).
