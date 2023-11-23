import React, { useState, useRef, useEffect } from 'react';
import quranText from '../assets/quran.json';
import quranText_tr from '../assets/quran_tr.json';
import surahData from '../assets/surah.json';
import tevbe_1 from '../assets/Tevbe-1.wav';
import tevbe_2 from '../assets/Tevbe-2.wav';
import tevbe_3 from '../assets/Tevbe-3.wav';

const Tevbe123 = () => {
    const [showOriginal, setShowOriginal] = useState({});
    const namesOfGod = "الله|لله|والله|بالله|لله|ولله|تالله|فالله|فلله|ءالله|ابالله|وتالله";
    const namesOfGod_tr = "TANRI";
    const [ayahs] = useState([1236, 1237, 1238]);
    const audioFiles = [tevbe_1, tevbe_2, tevbe_3];
    const audioRefs = useRef(audioFiles.map(file => new Audio(file)));
    const audioContextRef = useRef();
    const audioCircleRef = useRef(null);
    const analyzerRef = useRef();
    const animationFrameId = useRef();

    // Function to play audio files in sequence
    const playAudiosInSequence = async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const analyzer = audioContextRef.current.createAnalyser();
            analyzerRef.current = analyzer;

            audioRefs.current.forEach(audio => {
                const source = audioContextRef.current.createMediaElementSource(audio);
                source.connect(analyzer);
            });
            analyzer.connect(audioContextRef.current.destination);
        }

        startVisualization();

        for (const audio of audioRefs.current) {
            await playAudio(audio);
        }

        stopVisualization();
    };

    // Function to play an individual audio file
    const playAudio = (audio) => {
        return new Promise(resolve => {
            audio.play();
            audio.onended = resolve;
        });
    };

    const startVisualization = () => {
        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
    
        const draw = () => {
            analyzerRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    
            // Update circle style based on `average`
            const glowIntensity = Math.min(20, average / 5); // Example calculation
            if (audioCircleRef.current) {
                audioCircleRef.current.style.boxShadow = `0 0 ${glowIntensity}px #ffd700`;
            }
    
            animationFrameId.current = requestAnimationFrame(draw);
        };
        draw();
    };
    
    const stopVisualization = () => {
        cancelAnimationFrame(animationFrameId.current);
    };

    const toggleOriginalText = (ayahNumber) => {
        setShowOriginal((prevState) => ({
            ...prevState,
            [ayahNumber]: !prevState[ayahNumber],
        }));
    };

    const highlight = (text, rtleft) => {
        let parts = [];
        if (rtleft) {
            parts = text.split(new RegExp(`(${namesOfGod})`, 'g')).reverse();
            return parts.map((part, index) =>
                part.match(new RegExp(namesOfGod)) ? <span key={index} className="text-neutral-100 mx-1" dir="rtl">{part}</span> : <span key={index} dir="rtl">{part}</span>
            )
        } else {
            parts = text.split(new RegExp(`(${namesOfGod_tr})`, 'g'));
            return parts.map((part, index) =>
                part.match(new RegExp(namesOfGod_tr)) ? <span key={index} className="text-neutral-100" >{part}</span> : <span key={index}>{" " + part}</span>
            )
        }
    };


    const renderAyah = (globalAyahNumber, ayahText) => {
        const showOriginalText = showOriginal[globalAyahNumber];
        const text = showOriginalText ? ayahText : quranText_tr[globalAyahNumber];

        return (
            <div className={`w-full flex p-3 text-sm md:text-lg ${showOriginalText ? "justify-end" : "justify-start"}`}>
                <p className={`w-full ${showOriginalText ? "text-right" : "text-left"}`}>
                    {highlight(text, showOriginalText)}
                </p>
            </div>
        );
    };

    const renderAyahNumbers = (globalAyahNumber) => {
        // Find the Surah number for the current global Ayah number
        const surahNumber = Object.keys(surahData).find(surah => {
            const { start, end } = surahData[surah];
            return globalAyahNumber >= start && globalAyahNumber <= end;
        });

        // Calculate Surah specific Ayah number
        const surahStartIndex = surahData[surahNumber].start;
        const ayahNumberSurahSpecific = globalAyahNumber - surahStartIndex + 1;
        const ayahLabel = `${surahNumber}:${ayahNumberSurahSpecific}`;

        return (
            <div className="flex flex-col justify-between items-end  p-1 text-neutral-950">
                <div className="ayah-label text-sm font-bold mr-2 ">{ayahLabel}</div>
                <div className="global-ayah-number text-xs mr-2">{globalAyahNumber}</div>
            </div>
        );
    };

    useEffect(() => {
        // Cleanup function
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return (
        <div className="matching-ayah-list flex-col w-full p-1 overflow-auto bg-neutral-700">
            <div className="w-full">
                <ul className="tevbe-1-2-3 flex-col space-y-2 mr-1">
                    {ayahs.map((ayahNumber, index) => (
                        <li key={index} className="text-neutral-700 text-lg m-0.5 w-full">
                            <div
                                className="ayah-container w-full flex rounded shadow-lg justify-between mt-1 mb-1 cursor-pointer bg-violet-300"
                                onClick={() => toggleOriginalText(ayahNumber)}>
                                {renderAyahNumbers(ayahNumber)}
                                {renderAyah(ayahNumber, quranText[ayahNumber])}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full flex flex-1  items-center justify-center mt-4">
                <div
                    ref={audioCircleRef}
                    className="h-24 w-24 rounded-full bg-black"
                    onClick={playAudiosInSequence}>
                </div>
            </div>
        </div>
    );

};

export default Tevbe123;
