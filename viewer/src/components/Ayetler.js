import React, { useState, useEffect, useRef } from 'react';
import quranText from '../assets/quran.json';
import quranText_tr from '../assets/quran_tr.json';
import surahData from '../assets/surah.json';

const Ayetler = ({ selectedSurah, searchTerm, ayahs }) => {
    const [loadedAyahs, setLoadedAyahs] = useState([]);
    const observer = useRef();
    const lastAyahElementRef = useRef();
    const batchSize = 19;

    useEffect(() => {
        setLoadedAyahs(ayahs.slice(0, batchSize));
    }, [ayahs]);

    useEffect(() => {
        if (loadedAyahs.length === ayahs.length) return;

        if (observer.current) observer.current.disconnect();

        var callback = function (entries) {
            if (entries[0].isIntersecting) {

                const nextAyahs = ayahs.slice(loadedAyahs.length, loadedAyahs.length + batchSize);
                setLoadedAyahs(prevLoadedAyahs => [...prevLoadedAyahs, ...nextAyahs]);

            }
        };

        observer.current = new IntersectionObserver(callback);
        if (lastAyahElementRef.current) {
            observer.current.observe(lastAyahElementRef.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        }
    }, [loadedAyahs, ayahs]);


    const besmele = quranText["1"];
    const namesOfGod = "الله|لله|والله|بالله|لله|ولله|تالله|فالله|فلله|ءالله|ابالله|وتالله";

    
    const namesOfGod_tr = "TANRI"
    const [selectedTranslations, setSelectedTranslations] = useState({});

    let besmeleCounter = 0;

    const toggleTranslation = (ayahNumber) => {
        setSelectedTranslations((prevState) => ({
            ...prevState,
            [ayahNumber]: !prevState[ayahNumber],
        }));
    };

    const highlight = (text, rtleft) => {
        let parts = [];
        if (rtleft) {
            parts = text.split(new RegExp(`(${namesOfGod})`, 'g')).reverse();
            return parts.map((part, index) =>
                part.match(new RegExp(namesOfGod)) ? <span key={index} className="text-white mx-1" dir="rtl">{part}</span> : <span key={index} dir="rtl">{part}</span>
            )
        } else {
            parts = text.split(new RegExp(`(${namesOfGod_tr})`, 'g'));
            return parts.map((part, index) =>
                part.match(new RegExp(namesOfGod_tr)) ? <span key={index} className="text-white" >{part}</span> : <span key={index}>{" " + part}</span>
            )
        }
    };

    const highlightsearch = (text, rtleft) => {
        let parts = [];
        if (rtleft) {
            parts = text.split(new RegExp(`(${searchTerm})`, 'g')).reverse();
            return parts.map((part, index) =>
                part.match(new RegExp(searchTerm)) ? <span key={index} className="text-red-500 mx-1" dir="rtl">{part}</span> : <span key={index} dir="rtl">{part}</span>
            )
        } else {
            parts = text.split(new RegExp(`(${searchTerm})`, 'g'));
            return parts.map((part, index) =>
                part.match(new RegExp(searchTerm)) ? <span key={index} className="text-red-500" >{part}</span> : <span key={index}>{" " + part}</span>
            )
        }
    };


    const renderAyah = (globalAyahNumber, ayahText) => {
        const showTranslation = selectedTranslations[globalAyahNumber];
        const text = showTranslation ? quranText_tr[globalAyahNumber] : ayahText;
        return (
            <div className={`w-full flex p-4 ${showTranslation ? (ayahText.includes(besmele) ? "justify-between" : "justify-start") : "justify-end"}`}>
                <div className={`w-full flex`}>
                    {searchTerm ? (<p className={`w-full ${showTranslation ? "text-left" : "text-right"}`}>
                        {highlightsearch(text, !showTranslation)}
                    </p>) :
                        (<p className={`w-full ${showTranslation ? "text-left" : "text-right"}`}>
                            {highlight(text, !showTranslation)}
                        </p>)}
                </div>
                {ayahText.includes(besmele) && (
                    <div className="flex ml-2 text-blue-200">
                        {`${++besmeleCounter}`}
                    </div>)}
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
            <div className="flex flex-col justify-between items-end  p-1 ">
                <div className="ayah-label text-sm font-bold mr-2 text-neutral-950">{ayahLabel}</div>
                <div className="global-ayah-number text-xs mr-2">{globalAyahNumber}</div>
            </div>
        );
    };

    return (
        <div className="matching-ayah-list flex flex-col w-full h-screen p-1 overflow-auto">
            <div className="w-full">
                <ul className="quran-text-list flex-col space-y-2 mr-3">
                    <li key={selectedSurah + ":0"} className="text-neutral-700 text-lg m-0.5 w-full">
                        {(selectedSurah && (Number(selectedSurah) !== 1 && Number(selectedSurah) !== 9) && !searchTerm) && (
                            <div className="flex w-full bg-blue-400 rounded shadow-black justify-end mb-2 ">
                                <div className="w-full flex justify-end p-4">{highlight(besmele, true)}</div>
                                <div className="flex p-4 items-center text-blue-200">
                                    {`${++besmeleCounter}`}
                                </div>
                            </div>
                        )}

                        {loadedAyahs.map(([ayahNumber, ayahText], index) => (
                            <div
                                ref={index === loadedAyahs.length - 1 ? lastAyahElementRef : null}
                                key={ayahNumber}
                                onClick={() => toggleTranslation(ayahNumber)}
                                className={`flex w-full rounded shadow-black justify-between mb-2 cursor-pointer ${(ayahText.includes(besmele)) ? "bg-blue-400" : "bg-emerald-400"} `}
                            >
                                {renderAyahNumbers(ayahNumber)}
                                {renderAyah(ayahNumber, ayahText)}
                            </div>
                        ))}
                    </li>
                </ul>
            </div>
        </div>
    );

};

export default Ayetler;
