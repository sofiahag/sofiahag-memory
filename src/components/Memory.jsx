import { useEffect, useState } from "react"

import { pics } from "../assets/cards/cards"
import lightBackCard from "../assets/uni-back-light.png"
import darkBackCard from "../assets/uni-back-dark.png"
import lightToggle from "../assets/day.png";
import darkToggle from "../assets/night.png";

//TODO Add confetti on complete

function Game() {

    const [theme, setTheme] = useState('light');
    const [picsArray, setpicsArray] = useState([])
    const [cardsPicked, setCardsPicked] = useState([])
    const [cardsPickedIds, setCardsPickedIds] = useState([])
    const [creds, setCreds] = useState(0)
    const [flippedCards, setFlippedCards] = useState([])

    const toggleTheme = () => {
        if (theme === 'light') {
          setTheme('dark');
        } else {
          setTheme('light');
        }
    };

    function flipPic(pic, index) {

        if (cardsPickedIds?.length === 1 && cardsPickedIds[0] === index) {
            return
        }

        if (cardsPicked?.length < 2) {

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
        setCardsPickedIds([])
        setCardsPicked([])
        setCreds(0)
        setFlippedCards([])
    }

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    useEffect(() => {
        function createCardBoard() {
            const picsGenerated = pics?.concat(...pics)
            const shuffledArray = shuffleArray(picsGenerated)
            setpicsArray(shuffledArray)
        }
        createCardBoard()
    }, [])

    return (
        <div className="md:h-screen md:flex md:items-center md:justify-center">
            <div className="columns-1 lg:ml-12 lg:mr-5 md:ml-6 md:mr-1 max-sm:columns-2 max-sm:justify-center max-sm:my-5 max-sm:flex 
                max-sm:items-center max-sm:ml-0 max-sm:mr-0">
                <h3 className="mb-4 lg:ml-5 md:ml-5 font-sofia text-lg dark:text-white max-sm:ml-0 max-sm:mr-2 max-sm:mt-4 max-sm:text-base">
                    Creds: {creds}
                </h3>
                <button className="font-sofia bg-gradient-to-r from-teal-400 via-cyan-600 to-cyan-400
                  dark:from-pink-300 dark:via-yellow-200 dark:to-pink-200 dark:border-yellow-200 py-3 px-5
                  border-cyan-600 border-2 rounded-full text-base text-white font-bold dark:text-black
                  max-sm:py-1 max-sm:px-3" onClick={startOver}>Start over
                </button>
            </div>
            <div className="grid lg:grid-cols-6 gap-4 lg:m-12 md:grid-cols-4 md:m-6 max-sm:grid-cols-4 max-sm:gap-2 max-sm:m-5 
                max-sm:mt-3">
            <h2 className="flex items-center justify-center font-mooli lg:text-2xl md:text-sm max-sm:text-xs gradient-text">
                Unicorn<br></br>Memory
            </h2>
            {picsArray?.map((pic, index) => {
                return (
                    <div key={index} onClick={() => flipPic(pic, index)}>
                        <img src={isCardPicked(pic, index) ? pic : theme === "light" ? lightBackCard : darkBackCard} 
                            alt="mem_card" className={`rounded-lg`} 
                        />
                    </div>
                )
            })}
             <button className="toggle text-xs dark:text-white" onClick={() => toggleTheme()}>
                <img src={theme === "light" ? lightToggle : darkToggle } alt="toggle" />
            </button>
            </div>
        </div>
    )
}

export default Game;
