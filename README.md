6.170 Final Team Project

Pangaea is an application that connects people who speak different languages, and
are interested in learning new language. The idea is that people who want to learn
new languages would be willing to teach their own language in exchange for lessons
in that new language. Our app serves as a platform where users can exchange their
knowledge of a language for another user's knowledge of a language.

To run our project locally:
1. Open a terminal and change directory to the program directory
2. Run 'npm install' to get the appropriate packages
3. Run 'npm start' to run the server
4. Open your favorite web browser and go to http://localhost:3000/
5. Here you can make an account and try to navigate the program
6. Note that to properly test you'll have to make more accounts, otherwise you'll have no one to chat with

URL: http://pangaea-paerhati.rhcloud.com/

Steps
1. create account or login to existing account
2. For full testing functionality, login with a second account in an incognito tab (to avoid negative impact of cookies)
3. Click on "create exchange" with that other user, to initiate a conversation with that user that makes use of offline messaging (the gateway to real-time chat)
4. In the offline messaging page, you can send the other user a message by typing in the message box, and then pressing submit.
5. To enter into a real-time chat between the 2 users, do the following: have one user click the link labeled "LIVE CHAT"; at the point, said user will be waiting alone in the RTC until the other user joins him, by also clicking "LIVE CHAT".

NOTE: the only two users that are allowed into a real-time chat with a given ID X are the two users who are listed in the Exchange with that given ID X.
