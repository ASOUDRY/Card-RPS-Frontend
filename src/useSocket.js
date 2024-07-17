import { useState, useEffect } from 'react';
import io from 'socket.io-client';

function useSocket(url) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Clean up the socket connection on component unmount
    };
  }, [url]);

  return socket;
}

export default useSocket;