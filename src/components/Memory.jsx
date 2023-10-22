import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

import { pics } from "../assets/cards/cards";
import darkBackCard from "../assets/uni-back-dark.png";


function Game() {

    const [picsArray, setpicsArray] = useState([]);
    const [cardsPicked, setCardsPicked] = useState([]);
    const [cardsPickedIds, setCardsPickedIds] = useState([]);
    const [creds, setCreds] = useState(0);
    const [flippedCards, setFlippedCards] = useState([]);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [showMsg, setShowMsg] = useState(false);

    const hours = Math.floor(time / 360000);
    const minutes = Math.floor((time % 360000) / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const milliseconds = time % 100;

    const confetti = {
        force: 0.5,
        duration: 4500,
        particleCount: 2000,
        width: 4000,
    };

    function flipPic(pic, index) {

        if (cardsPickedIds?.length === 1 && cardsPickedIds[0] === index) {
            return
        }

        if (cardsPicked?.length < 2) {

            setIsRunning(true);
            setCardsPicked(cardsPicked => cardsPicked?.concat(pic))
            setCardsPickedIds(cardsPickedIds => cardsPickedIds?.concat(index))

            if (cardsPicked?.length === 1) {
                
                if (cardsPicked[0] === pic) {
                    setCreds(creds => creds + 2)
                    setFlippedCards(flippedCards => flippedCards?.concat([cardsPicked[0], pic]))
                }
                setTimeout(() => {
                    setCardsPickedIds([])
                    setCardsPicked([])
                }, 2000)
                
            } 
        }
    }

    function isCardPicked(pic, index) {
        return cardsPickedIds?.includes(index) || flippedCards?.includes(pic)
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    function startOver() {
        setCardsPickedIds([]);
        setCardsPicked([]);
        setCreds(0);
        setFlippedCards([]);
        setIsRunning(false);
        setTime(0);
    }

    useEffect(() => {
        function createCardBoard() {
            const picsGenerated = pics?.concat(...pics)
            const shuffledArray = shuffleArray(picsGenerated)
            setpicsArray(shuffledArray)
        }
        createCardBoard()
    }, [])

    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => setTime(time + 1), 10);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, time]);

    useEffect(() => { 
        if (creds === 20) {
            setIsRunning(false);
        }
    }, [creds])

    useEffect(() => {
        if (creds === 20) {
            setShowMsg(true);
        }
        setTimeout(() => {
            setShowMsg(false);
        }, 5000);
    }, [creds])
    

    return (
        <div className="md:h-screen md:flex md:items-center md:justify-center">
            {(time < 6000 && showMsg) ? (
                <h2 className="absolute z-100 font-bold font-bubblegum bg-gradient-to-r from-yellow-300 via-yellow-300
                to-yellow-300 inline-block text-transparent bg-clip-text drop-shadow-2xl font-outline-2 mt-5 lg:text-10xl 
                md:text-8xl max-sm:text-5xl max-sm:mt-20 max-sm:ml-15 lg:ml-20">Great job!</h2>
            ) : ("")}
            {(time > 6000 && showMsg) ? (
                <h2 className="absolute z-100 font-bold font-bubblegum bg-gradient-to-r from-yellow-300 via-yellow-300
                to-yellow-300 inline-block text-transparent bg-clip-text drop-shadow-2xl font-outline-2 mt-5 lg:text-10xl 
                md:text-8xl max-sm:text-5xl max-sm:mt-20 max-sm:ml-4 lg:ml-20">You can do better!</h2>
            ) : ("")}
            <div className="h-full justify-center fixed">{creds === 20 && <ConfettiExplosion config={confetti} />}</div>
            <div className="columns-1 lg:ml-12 lg:mr-5 md:ml-6 md:mr-1 max-sm:columns-2 max-sm:justify-center max-sm:my-5 max-sm:flex 
                max-sm:items-center max-sm:ml-0 max-sm:mr-0">
                <h3 className="mb-4 lg:ml-5 md:ml-5 font-sofia text-lg text-white max-sm:ml-0 max-sm:mr-2 max-sm:mt-4 max-sm:text-base">
                    Creds: {creds}
                </h3>
                <button className="font-sofia bg-gradient-to-r from-pink-300 via-yellow-200 to-pink-200 border-yellow-200 py-3 px-5
                border-2 rounded-full text-base text-black font-bold max-sm:py-1 max-sm:px-3" onClick={startOver}>Start over
                </button>
                <div className="stopwatch-container lg:mt-5 md:mt-5 max-sm:ml-1">
                    <p className="text-white text-center">
                        {hours}:{minutes.toString().padStart(2, "0")}:
                        {seconds.toString().padStart(2, "0")}:
                        {milliseconds.toString().padStart(2, "0")}
                    </p>
                </div>
            </div>
            <div className="grid lg:grid-cols-7 gap-4 lg:m-12 md:grid-cols-4 md:m-6 max-sm:grid-cols-4 max-sm:gap-3 max-sm:m-5 
                max-sm:mt-3">
            <h2 className="flex items-center justify-center font-mooli lg:text-2xl md:text-sm max-sm:text-xs gradient-text">
                Unicorn<br></br>Memory
            </h2>
            {picsArray?.map((pic, index) => {
                return (
                    <div key={index} onClick={() => flipPic(pic, index)} >
                        <img src={isCardPicked(pic, index) ? pic : darkBackCard} 
                            alt="mem_card" className={`rounded-lg`} 
                        />
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default Game;
