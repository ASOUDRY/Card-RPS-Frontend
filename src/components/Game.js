import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import king from '../images/king.webp'
import knight from '../images/knight.webp'
import dragon from '../images/dragon.png'
import back from '../images/card_back.jpeg'
import "./Game.css"

function Game({socket, game}) {
    const [gameState, setGameState] = useState({
        selectedCard: null,
        boxes: {
            A: [],
            B: []
        }
    });

    const [yourhand, setYourHand] = useState({
        hand:[ 
            {
                name: "King",
                image: king
            },
            {
                name: "Knight",
                image: knight
            },
            {
                name: "Dragon",
                image: dragon
            }
        ]
    }
    )

    const [enemyhand, setEnemyhand] = useState({ hand: [] })
    const [state, setState] = useState(false);


    // useEffect(() => {
    //     console.log(game);
    //     // Set up socket event listener
    //     if (socket) {
    //         socket.on('someEvent', (data) => {
    //             // Handle received data here
    //             console.log('Received data from server:', data);
    //             // Update component state if necessary
    //         });
    //     }
    
    //     // Clean up the event listener when the component unmounts
    //     return () => {
    //         if (socket) {
    //             socket.off('someEvent');
    //         }
    //     };
    // }, []); // Empty dependency array ensures this effect runs only once, when the component mounts
    
    

    useEffect(() => {
        console.log(game);
        setEnemyhand(prevState => {
            return { hand: [1, 2, 3] };
        });
            if (socket) {
                socket.emit('newGameState', { 
                    gameState, 
                    yourhand,
                    enemyhand });
            }
    }, [gameState.boxes]);

      // Function to select a card
      function selectCard(card, image, name, index) {
        if (gameState.selectedCard) {
            gameState.selectedCard.element.classList.remove("dance");
        }
        else {
            card.classList.add("dance");
        }
        // Apply dance animation to the clicked card
        setGameState(prevState => ({
            ...prevState,
            selectedCard: {
                element: card,
                image : image,
                cardname: name,
                index: index
            }
        }));
    }

     // Function to move a selected card to a box
     function moveCard(box) {
        const { selectedCard, boxes } = gameState;
        if (selectedCard) {
            const updatedBoxes = { ...boxes };
            updatedBoxes[box].push({
              image: selectedCard.image, 
              name: selectedCard.cardname
            });

            gameState.selectedCard.element.classList.remove("dance");
            // find it's index than splice by it.
            const newHand = yourhand.hand.splice(gameState.selectedCard.index, 1)
            setYourHand(prevState => ({
                ...prevState, newHand
            }))

            setGameState(prevState => ({
                ...prevState,
                selectedCard: null,
                boxes: updatedBoxes
            }));
        }
    }

    return (
        <div className="field">
            {/* <!-- Opponent's cards --> */}
            <div className="player">
                    {
                        enemyhand.hand.map((card, index) => (
                            <div key={index}>
                                <Card className="bg-dark text-white">
                                    <Card.Img src={back} alt="Card image" />
                                </Card>
                            </div>
                        ))
                    }
            </div>
            {/* <!-- Battleground --> */}
            <div className="player">
                <div className="box" id="A" onClick={() => moveCard('A')}>
                    {
                        gameState.boxes.A.map((card, index) => (
                            <div key={index} className='card-wrapper'>
                                {console.log(card)}
                                <Card className="bg-dark text-white">
                                    <Card.Img src={card.image} alt="Card image" />
                                    <Card.ImgOverlay>
                                        <Card.Title>{card.name}</Card.Title>
                                    </Card.ImgOverlay>
                                </Card>
                            </div>
                        ))
                    }
                </div>
                <div className="box" id="B" onClick={() => moveCard('B')}>
                    {
                        gameState.boxes.B.map((card, index) => (
                            <div key={index}>
                                <Card className="bg-dark text-white">
                                    <Card.Img src={card.image} alt="Card image" />
                                    <Card.ImgOverlay>
                                        <Card.Title>{card.name}</Card.Title>
                                    </Card.ImgOverlay>
                                </Card>
                            </div>
                        ))
                    }
                </div>
            </div>
            {/* Player hand */}
            <div>
            <div className="player">
                {yourhand.hand.map((card, index) => (
                    <div key={index} onClick={(event) => selectCard(event.currentTarget, card.image, card.name, index)}> {/* Add onClick handler to the wrapping div */}
                        <Card className="bg-dark text-white">
                            <div> {/* Wrapping div for the clickable area */}
                                <Card.Img src={card.image} alt="Card image" />
                            </div>
                            <Card.ImgOverlay>
                                <Card.Title>{card.name}</Card.Title>
                            </Card.ImgOverlay>
                        </Card>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}

export default Game;