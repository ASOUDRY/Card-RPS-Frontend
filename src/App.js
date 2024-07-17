// App.js
import React, { useState, useEffect } from 'react';
import useSocket from './useSocket'; // Import the custom hook
import Start from './components/Start';
import Game from './components/Game';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [game, gamestart] = useState(false);
  const socket = useSocket('ws://localhost:3001');

  useEffect(() => {
    if (socket) {
      socket.on('data', (data) => {
        gamestart(data);
        setIsLoading(false);
      });
    }
  }, [socket]);

  function switchingTime(variable) {
    gamestart(variable);
  }

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {game ? (
            <Game socket={socket} game={game} />
           
          ) : (
            <Start socket={socket} switching={switchingTime} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
