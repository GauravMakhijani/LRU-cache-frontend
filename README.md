## LRU Cache

### How to run the code:
1. Clone the repository
2. clone backend repository from [lrucache-backend](https://github.com/GauravMakhijani/lrucache)
3. start the backend server by running the command mentioned in the README.md of the backend repository
4. Run the following command to start the frontend server:
```
npm install
npm start
```
5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Features:
1. Add key-value pair to the cache with a time to live
2. Get value of a key
3. Delete a key
4. Clear the cache
5. Set max size of the cache
6. Websocket connection to get real-time updates of the cache

### steps to use the application:
1. Set the max size of the cache
2. Add key-value pair to the cache; set the time to live in seconds, it should be greater than current time
3. Get value of a key
4. Delete a key
5. Clear the cache
6. The list of key value pairs will be displayed on the screen with the time to live
7. This list will be updated in real-time using websocket connection

