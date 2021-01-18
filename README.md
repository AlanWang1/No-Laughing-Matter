# No Laughing Matter

## Inspiration

In the midst of COVID-19, party game platforms such as Jackbox allows people to have fun with their family and friends while being remotely apart. That said, many of those game platforms fail to mimic an interactive party environment, and it is sometimes hard to feel the existence of other players over the internet. Thus, we see a need to create a real time party game where players can easily interact with each other.


## What it does

Players are brought to home screen where they can enter a name and a room code. They are then redirected to that room where they are in live video chat with all other people in the room. One person choose to start the game and are given a prompt. The goal is for that person to make jokes around the prompt to keep the others laughing. At the bottom of the video call screen there is a "laugh-o-meter" that is constantly ticking down. If people in the call laugh it fills up by a little. Once the laugh-o-meter reaches zero the round is over and it is the next person turn. The end of the rounds when everyone has gone, winners are announced based on both laughing intensity of others, and how long they lasted before the laugh-o-meter hit zero.

## How we built it

The app is a simple express app with a server and 3 main views - home page, the room page, and the results page. For live video chat, we used Socket.io for managing rooms and Peerjs (wrapper for webRTC) to stream video between clients. For analyzing laughing we leveraged the face-api library built on top of TensorFlow.js. It measures for sentiment, and movement of various parts of the face. We took this data and implemented our own algorithm to calculate "laugh intensity".


## Challenges we ran into

The main difficulty was learning Socket.io and how to coordinate data between the server and the clients. Setting up PeerJS and the video streaming was also quite difficult in terms of transferring the video streams and extracting them from various browser apis. Lastly, calculating the laugh intensity was very difficult both because of lack of documentation of the face-api library and weighing and combining the various factors around sentiment analysis and facial movement.


## Accomplishments that we're proud of
* Getting socket.io rooms working, and app data transferred between clients
* Making an accurate algorithm to determine intensity
* Getting peerJs and webRTC working
* Deploying the app and making a polished UI

## What we learned
* How to set up a basic video chat with peerJS and webRTC
* How to deploy to Heroku
* Using a tensorflow.JS library

## What's next for No Laughing Matter
* In addition to visual data on audience reactions, add audio data to detect laughter. 
* Add AR filters
* More in game interactions

