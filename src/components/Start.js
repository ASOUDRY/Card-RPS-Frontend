import React, {useState, useEffect} from 'react';

function Start({socket, switching}) {
  const [formData, setFormData] = useState({input: '' })

  const [session, setSession] = useState(false)

  useEffect(() => {
    // console.log(socket);
    if (socket != null) {
      socket.on('ready', (session) => {
        console.log(session);
        switching(session);
      })
  
      return () => {
        socket.off('ready');
      };
    }
  },[socket])

  const handleChange = (event) => {
    console.log(formData)
    // const { input, value } = event.target;
    setFormData(prevState => ({
        ...prevState,
        input: event.target.value
    }));
  };

  const handleSubmit = (event) => {
      event.preventDefault();
      console.log("Test");
      joinGame();
  };

  const createGame = async () => {
      try {
        console.log(socket);
        // Emit the 'createSession' event
        socket.emit('createSession');

        // Wait for the 'createdSession' event and set the session
        const arg = await new Promise((resolve, reject) => {
          socket.on('createdSession', (arg) => {
            resolve(arg);
          });
        });

        setSession(arg);
      } catch (error) {
        console.log(error);
      }
    };
  

  const joinGame = async () => {
    try {
      const response = await socket.timeout(5000).emitWithAck('joinSession', formData.input);
      if (response.status === "success") {
          setSession(formData.input);
      }
    } catch (e) {
      console.log("Join Game timed out");
    };
  }

  const randomGame = () => {}

  const checkSession = async () => {
    try {
      const response = await socket.timeout(10000).emitWithAck('c', session);
      if (response.status === "success") {
        if (response.switch === true) {
          console.log("You are ready to play");
        } else {
          console.log("You need two players to play");
        }
      }
      else {
        console.log("You have no session id yet.");
      }
      // switching(response);
    } catch (e) {
      console.log("Socket timed out");
    };
  }

  return (
    <div style={styles.container}>
      { 
        session ? (
          <>
          <p> Waiting to Join game</p>
          <p>Your session id is {session}</p>
          <button onClick={checkSession}> Test </button>
          </>   
        ) : 
          (
              <div>
                  <button onClick={checkSession}> Test </button>
                  <button onClick={createGame}>
                    Create Game
                  </button>
                  <form onSubmit={handleSubmit}>
                    <input type="text" value={formData.input} onChange={handleChange} />
                    <button type="submit">Join Existing Game</button>
                  </form>
                  <button onClick={randomGame}>
                    Join Random Game
                  </button>
              </div>
          )
      }
    </div>
  );
}

export default Start;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Adjust as per your requirement
  },
};