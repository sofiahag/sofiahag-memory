import React, { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { pics } from "../assets/cards/cards";
import darkBackCard from "../assets/uni-back-dark.png";

function Game() {
    const [gameState, setGameState] = useState({
        picsArray: [],
        cardsPicked: [],
        cardsPickedIds: [],
        creds: 0,
        flippedCards: [],
        time: 0,
        isRunning: false,
        showMsg: false,
        darkness: 'brightness-100',
        clickEnabled: true
    });

    const {
        picsArray,
        cardsPicked,
        cardsPickedIds,
        creds,
        flippedCards,
        time,
        isRunning,
        showMsg,
        darkness,
    } = gameState;

    const { force, duration, particleCount, width } = {
        force: 0.5,
        duration: 4500,
        particleCount: 2000,
        width: 4000,
    };

    const confettiConfig = {
        force,
        duration,
        particleCount,
        width,
    };

    const timeVariables = {
        hours: Math.floor(time / 360000),
        minutes: Math.floor((time % 360000) / 6000),
        seconds: Math.floor((time % 6000) / 100),
        milliseconds: time % 100,
    };

    const { hours, minutes, seconds, milliseconds } = timeVariables;

    const flipPic = async (pic, index) => {
        if (!gameState.clickEnabled || (cardsPickedIds.length === 1 && cardsPickedIds[0] === index)) return;

        setGameState((prevState) => ({
            ...prevState,
            clickEnabled: false,

            isRunning: true,
            cardsPicked: [...cardsPicked, pic],
            cardsPickedIds: [...cardsPickedIds, index],
        }));

        if (cardsPicked.length === 1) {
            if (cardsPicked[0] === pic) {
                setGameState((prevState) => ({
                    ...prevState,
                    creds: prevState.creds + 2,
                    flippedCards: [...prevState.flippedCards, cardsPicked[0], pic],
                }));
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));

            setGameState((prevState) => ({
                ...prevState,
                cardsPickedIds: [],
                cardsPicked: [],
                clickEnabled: true,
            }));
        } else {
            setGameState((prevState) => ({
                ...prevState,
                clickEnabled: true,
            }));
        }
    };

    const isCardPicked = (pic, index) => cardsPickedIds.includes(index) || flippedCards.includes(pic);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const startOver = () => {
        setGameState((prevState) => ({
            ...prevState,
            cardsPickedIds: [],
            cardsPicked: [],
            creds: 0,
            flippedCards: [],
            isRunning: false,
            time: 0,
            darkness: 'brightness-100',
        }));
    };

    useEffect(() => {
        const createCardBoard = () => {
            const picsGenerated = pics.concat(...pics);
            const shuffledArray = shuffleArray(picsGenerated);
            setGameState((prevState) => ({
                ...prevState,
                picsArray: shuffledArray,
            }));
        };
        createCardBoard();
    }, []);

    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => setGameState((prevState) => ({ ...prevState, time: time + 1 })), 10);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, time]);

    useEffect(() => {
        if (creds === 20) {
            setGameState((prevState) => ({
                ...prevState,
                isRunning: false,
                showMsg: true,
                darkness: 'brightness-50',
            }));
            setTimeout(() => setGameState((prevState) => ({ ...prevState, showMsg: false })), 10000);
        }
    }, [creds]);

    return (
        <div className="md:h-screen md:flex md:items-center md:justify-center">
            {showMsg && (
                <h2 className={`absolute z-50 font-bold font-bubblegum bg-gradient-to-r from-yellow-300 via-yellow-300
                    to-yellow-300 inline-block text-transparent bg-clip-text drop-shadow-2xl font-outline-2 mt-5 lg:text-10xl 
                    md:text-8xl max-sm:text-5xl max-sm:mt-20 max-sm:ml-15 lg:ml-20`}
                >
                    {time < 6000 ? "Great job!" : "You can do better!"}
                </h2>
            )}
            <div className="h-full justify-center fixed">{creds === 20 && <ConfettiExplosion config={confettiConfig} />}</div>
            <div className="columns-1 lg:ml-12 lg:mr-5 md:ml-6 md:mr-1 max-sm:columns-3 max-sm:justify-center max-sm:my-5 max-sm:flex 
                max-sm:items-center max-sm:ml-0 max-sm:mr-0">
                <h3 className="mb-4 lg:ml-5 md:ml-5 font-sofia text-lg text-white max-sm:ml-0 max-sm:mr-3 max-sm:mt-4 max-sm:text-base">
                    Creds: {creds}
                </h3>
                <button className="font-sofia bg-gradient-to-r from-pink-300 via-yellow-200 to-pink-200 border-yellow-200 py-3 px-5
                border-2 rounded-full text-base text-black font-bold max-sm:py-1 max-sm:px-3" onClick={startOver}>
                    Start over
                </button>
                <div className="stopwatch-container lg:mt-5 md:mt-5 max-sm:ml-1 max-sm:w-15">
                    <p className="text-white text-center">
                        {hours}:{minutes.toString().padStart(2, "0")}:
                        {seconds.toString().padStart(2, "0")}:
                        {milliseconds.toString().padStart(2, "0")}
                    </p>
                </div>
            </div>
            <div className={`grid lg:grid-cols-7 gap-4 lg:m-12 md:grid-cols-4 md:m-6 max-sm:grid-cols-4 max-sm:gap-3 max-sm:m-5 
                max-sm:mt-3 ${darkness}`}>
                <h2 className="flex items-center justify-center font-mooli lg:text-2xl md:text-sm max-sm:text-xs gradient-text">
                    Unicorn<br></br>Memory
                </h2>
                {picsArray.map((pic, index) => (
                    <div key={index} onClick={() => flipPic(pic, index)}>
                        <img
                            src={isCardPicked(pic, index) ? pic : darkBackCard}
                            alt="mem_card"
                            className="rounded-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Game;
