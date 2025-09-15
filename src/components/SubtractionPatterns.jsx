import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Container } from './ui/reused-ui/Container.jsx'
import './SubtractionPatterns.css'

const SubtractionPatterns = () => {
    // State Management
    const [equations, setEquations] = useState([]);
    const [inputX, setInputX] = useState(1);
    const [inputY, setInputY] = useState(1);
    const [inputAnswer, setInputAnswer] = useState(1);
    const [isShaking, setIsShaking] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [inputPosition, setInputPosition] = useState(0);
    const [removedEquation, setRemovedEquation] = useState([]);

    // Variable Management
    const messages = [
        'Great Job!',
        'Awesome!',
        'Fantastic Job!',
        'That\'s correct!',
        'Great Work!',
        'That\'s right!',
        'You got it!'
    ]

    // Functions
    const generateEquations = () => {
        // Generate random rules for x and y changes (between -3 and +3, excluding 0)
        const xRule = Math.floor(Math.random() * 6) - 3; // -3 to +2
        const xChange = xRule === 0 ? (Math.random() < 0.5 ? 1 : -1) : xRule; // exclude 0
        
        const yRule = Math.floor(Math.random() * 6) - 3; // -3 to +2  
        const yChange = yRule === 0 ? (Math.random() < 0.5 ? 1 : -1) : yRule; // exclude 0
        
        // Calculate what initial y should be to ensure it stays positive for 4 equations
        // y after 4 steps = initial_y + (yChange * 3)
        // We need: initial_y + (yChange * 3) >= 1
        // So: initial_y >= 1 - (yChange * 3)
        const minInitialY = Math.max(1, 1 - (yChange * 3));
        
        // Start with values that ensure all values stay within 1-20 range
        let x = Math.floor(Math.random() * 8) + 8; // 8-15 (lower to stay within bounds)
        let y = Math.floor(Math.random() * 3) + Math.max(minInitialY, 2); // Start appropriately
        
        // Ensure all equations in the sequence will have valid results (1-20 range)
        let attempts = 0;
        while (attempts < 100) {
            let testX = x;
            let testY = y;
            let allValid = true;
            
            // Test all 4 equations in the sequence
            for (let i = 0; i < 4; i++) {
                const z = testX - testY;
                // Check if all values are within 1-20 range
                if (testX < 1 || testX > 20 || testY < 1 || testY > 20 || z < 1 || z > 20) {
                    allValid = false;
                    break;
                }
                testX += xChange;
                testY += yChange;
            }
            
            if (allValid) break;
            
            // Try again with new values
            x = Math.floor(Math.random() * 8) + 8; // 8-15
            y = Math.floor(Math.random() * 3) + Math.max(minInitialY, 2);
            attempts++;
        }
        
        const newEquations = [];
        
        // Generate 4 equations following the pattern
        for (let i = 0; i < 4; i++) {
            const z = x - y;
            newEquations.push(`${x} - ${y} = ${z}`);
            
            // Apply the rules for next equation
            x += xChange;
            y += yChange;
        }
        
        setEquations(newEquations);
        
        // Set random position for input section (0-3)
        const randomPosition = Math.floor(Math.random() * 4);
        setInputPosition(randomPosition);
        setRemovedEquation(newEquations[randomPosition]);
        
        // Reset success message state
        setShowAnswer(false);
        setIsShaking(false);
    }

    useEffect(() => {
        generateEquations();
    }, []);

    const checkAnswer = () => {
        const userEquation = `${inputX} - ${inputY} = ${inputAnswer}`;
        if (userEquation === removedEquation) {
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.5 } });
            setShowAnswer(true);
            
            // Generate new equations after 4 seconds
            setTimeout(() => {
                generateEquations();
            }, 4000);
        } else {
            // Shake the check button for wrong answer
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    }

	return (
        <div>
            <Container
                text="Subtraction Patterns"
                showResetButton={false}
                borderColor="#FF7B00"
                showSoundButton={true}
            >
                {/* Intro Text */}
                <div className='text-center text-sm text-gray-500 p-5 pb-2 flex-start'>
                    Find the pattern in the subtraction equations to fill in the missing equation!
                </div>

                {/* Equations Container */}
                <div className='flex flex-col w-[80%] mx-auto justify-center items-center bg-gray-50 rounded-lg border-2 border-gray-300 shadow-sm py-2 mt-2'>
                    {equations.map((equation, index) => (
                        <div key={index} className={`w-full flex justify-center ${index < equations.length - 1 ? 'border-b border-gray-300 pb-2 mb-2' : ''}`}>
                            {index === inputPosition ? (
                                showAnswer ? (
                                    /* Show completed equation in green when answer is correct */
                                    <div className='text-2xl font-bold text-green-600 min-w-[200px] text-center'>
                                        {removedEquation}
                                    </div>
                                ) : (
                                    /* Input Section */
                                    <div className='flex flex-row justify-center items-center min-w-[200px]'>
                                        <div className='w-[30%] flex flex-col justify-center items-center gap-1'>
                                            <button 
                                                className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                                                onClick={() => setInputX(Math.min(inputX + 1, 20))}
                                                aria-label='Increase X'
                                                >
                                                ▲
                                            </button>
                                            <input 
                                                type="text" 
                                                readOnly
                                                tabIndex={-1}
                                                value={inputX}
                                                className='w-[40px] text-center border-2 border-gray-800 rounded-lg p-2 focus:outline-none shadow-sm select-none pointer-events-none text-gray-800 bg-white' 
                                                />
                                            <button 
                                                className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                                                onClick={() => setInputX(Math.max(inputX - 1, 1))}
                                                aria-label='Decrease X'
                                            >
                                                ▼
                                            </button>
                                        </div>
                                        <div className='text-xl font-bold'>
                                            -
                                        </div>
                                        <div className='w-[30%] flex flex-col justify-center items-center gap-1'>
                                            <button 
                                                className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                                                onClick={() => setInputY(Math.min(inputY + 1, 20))}
                                                aria-label='Increase Y'
                                            >
                                                ▲
                                            </button>
                                            <input 
                                                type="text" 
                                                readOnly
                                                tabIndex={-1}
                                                value={inputY}
                                                className='w-[40px] text-center border-2 border-gray-800 rounded-lg p-2 focus:outline-none shadow-sm select-none pointer-events-none text-gray-800 bg-white' 
                                            />
                                            <button 
                                                className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                                                onClick={() => setInputY(Math.max(inputY - 1, 1))}
                                                aria-label='Decrease Y'
                                            >
                                                ▼
                                            </button>
                                        </div>
                                        <div className='text-xl font-bold'>
                                            =
                                        </div>
                                        <div className='w-[30%] flex flex-col justify-center items-center gap-1'>
                                            <button 
                                                className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                                                onClick={() => setInputAnswer(Math.min(inputAnswer + 1, 20))}
                                                aria-label='Increase Answer'
                                            >
                                                ▲
                                            </button>
                                            <input 
                                                type="text" 
                                                readOnly
                                                tabIndex={-1}
                                                value={inputAnswer}
                                                className='w-[40px] text-center border-2 border-gray-800 rounded-lg p-2 focus:outline-none shadow-sm select-none pointer-events-none text-gray-800 bg-white' 
                                            />
                                            <button 
                                                className='w-6 h-6 flex items-center justify-center rounded-md bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 shadow-sm'
                                                onClick={() => setInputAnswer(Math.max(inputAnswer - 1, 1))}
                                                aria-label='Decrease Answer'
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className='text-2xl font-bold text-gray-800 min-w-[200px] text-center'>
                                    {equation}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Check Answer Button / Success Message */}
                <div className='flex flex-grow p-2 flex justify-center items-center w-full transition-opacity'>
                    {showAnswer ? (
                        <div className='text-2xl font-bold text-green-600'>
                            {messages[Math.floor(Math.random() * messages.length)]}
                        </div>
                    ) : (
                        <button
                            className={`w-[100px] h-[40px] text-center border-2 border-green-400 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg p-1 focus:outline-none shadow-sm placeholder-black transition-transform duration-100 ${isShaking ? 'button-shake' : ''}`}
                            onClick={checkAnswer}
                            >
                            Check!
                        </button>
                    )}
                </div>
            </Container>
        </div>
)
};


export default SubtractionPatterns;