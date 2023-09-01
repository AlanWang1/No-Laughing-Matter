# No Laughing Matter

A Realtime Web Video Chat Game for rating player jokes, powered by facial recognition and analysis!
- Simply join a room with your friends, wait for the joke prompt, and let the fun begin as you compete to make the funniest joke
- No Laughing Matter will automatically detect the funniest joke, based on user laughter, this will make the "laughometer" go up

![image](https://github.com/AlanWang1/No-Laughing-Matter/assets/43789278/671cb756-960d-417f-8d78-8759e6c3fae7)


## Inspiration

In the midst of COVID-19, party game platforms such as Jackbox allows people to have fun with their family and friends while being remotely apart. That said, many of those game platforms fail to mimic an interactive party environment, and it is sometimes hard to feel the existence of other players over the internet. Thus, we see a need to create a real time party game where players can easily interact with each other.


## Tech Stack

- Node.js and Express for backend server
- Socket.IO for managing video chat rooms
- WebRTC for realtime video streaming
- Tensorflow.js library for facial recognition and analysis (to determine laughter/smiling)

Originally Demoed at Hack the North:
https://devpost.com/software/no-laughing-matter


## How we built it

The app is a simple express app with a server and 3 main views - home page, the room page, and the results page. For live video chat, we used Socket.io for managing rooms and Peerjs (wrapper for webRTC) to stream video between clients. For analyzing laughing we leveraged the face-api library built on top of TensorFlow.js. It measures for sentiment, and movement of various parts of the face. We took this data and implemented our own algorithm to calculate "laugh intensity".


## What's next

- In addition to visual data on audience reactions, add audio data to detect laughter.
- Add AR filters
- More in game interactions
