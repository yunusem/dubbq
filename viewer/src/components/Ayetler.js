import React, { useState, useEffect, useRef } from 'react';
import quranText from '../assets/quran.json';
import quranText_tr from '../assets/quran_tr.json';
import surahData from '../assets/surah.json';
import titlesData from '../assets/titles.json';

const Ayetler = ({ selectedSurah, searchTerm, ayahs }) => {
    const [loadedAyahs, setLoadedAyahs] = useState([]);
    const observer = useRef();
    const lastAyahElementRef = useRef();
    const batchSize = 19;
    const [showOriginal, setShowOriginal] = useState({});
    const besmele = quranText["1"];
    const namesOfGod = "الله|لله|والله|بالله|لله|ولله|تالله|فالله|فلله|ءالله|ابالله|وتالله";
    const namesOfGod_tr = "TANRI"

    let besmeleCounter = 0;

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
                part.match(new RegExp(namesOfGod)) ? <span key={index} className="text-neutral-300 mx-1" dir="rtl">{part}</span> : <span key={index} dir="rtl">{part}</span>
            )
        } else {
            parts = text.split(new RegExp(`(${namesOfGod_tr})`, 'g'));
            return parts.map((part, index) =>
                part.match(new RegExp(namesOfGod_tr)) ? <span key={index} className="text-neutral-300" >{part}</span> : <span key={index}>{" " + part}</span>
            )
        }
    };

    const highlightsearch = (text, rtleft) => {
        let parts = [];
        if (rtleft) {
            parts = text.split(new RegExp(`(${searchTerm})`, 'g')).reverse();
            return parts.map((part, index) =>
                part.match(new RegExp(searchTerm)) ? <span key={index} className="text-rose-700 font-bold mx-1" dir="rtl">{part}</span> : <span key={index} dir="rtl">{part}</span>
            )
        } else {
            parts = text.split(new RegExp(`(${searchTerm})`, 'g'));
            return parts.map((part, index) =>
                part.match(new RegExp(searchTerm)) ? <span key={index} className="text-rose-700 font-bold " >{part}</span> : <span key={index}>{" " + part}</span>
            )
        }
    };

    const getSurahSpecificAyahNumber = (globalAyahNumber) => {
        const surahNumber = Object.keys(surahData).find(surah => {
            const { start, end } = surahData[surah];
            return globalAyahNumber >= start && globalAyahNumber <= end;
        });
        return globalAyahNumber - surahData[surahNumber].start + 1;
    };

    const isSurahWithInitials = (globalAyahNumber) => {
        const surahNumber = Object.keys(surahData).find(surah => {
            const { start, end } = surahData[surah];
            return globalAyahNumber >= start && globalAyahNumber <= end;
        });
        return surahData[surahNumber]?.type === "wi";
    };

    const separateInitials = (ayahNumber) => {
        const isInitialAyah = isSurahWithInitials(ayahNumber) &&
            getSurahSpecificAyahNumber(ayahNumber) === 1;

        if (isInitialAyah) {
            const ayahText = quranText[ayahNumber];
            // Split the ayah text into individual letters
            return ayahText.split('').filter(letter => letter.trim() !== '');
        }
        return null;
    };


    const countInitialsInSurah = (initials, surahNumber) => {
        const counts = {};
        initials.forEach(initial => {
            counts[initial] = 0;
        });

        // Count occurrences of each initial in the surah
        const { start, end } = surahData[surahNumber];
        for (let ayahNumber = start; ayahNumber <= end; ayahNumber++) {
            const ayahText = quranText[ayahNumber];
            initials.forEach(initial => {
                const count = (ayahText.match(new RegExp(initial, "g")) || []).length;
                counts[initial] += count;
            });
        }
        return counts;
    };


    const renderAyah = (globalAyahNumber, ayahText) => {
        // Determine whether to show the original text or translation
        const showOriginalText = showOriginal[globalAyahNumber];
        const text = showOriginalText ? ayahText : quranText_tr[globalAyahNumber];

        const surahHasInitials = isSurahWithInitials(globalAyahNumber) && Number(getSurahSpecificAyahNumber(globalAyahNumber)) === 1;
        const initials = separateInitials(globalAyahNumber);
        let initialsCounts = {};

        const surahNumber = Object.keys(surahData).find(surah => {
            const { start, end } = surahData[surah];
            return globalAyahNumber >= start && globalAyahNumber <= end;
        });

        if (surahHasInitials && initials) {
            initialsCounts = countInitialsInSurah(initials, surahNumber);
        }

        // Extract the first word (assumed to be the initials)
        const firstWord = ayahText.split(/\s+/)[0];
        // The rest of the ayah text
        const restOfAyah = ayahText.substring(firstWord.length);

        return (
            surahHasInitials ?
                (
                    <div className="w-full flex justify-between py-2 mr-1 px-1 ">
                        <div className={`flex w-full justify-start `}>
                            <p className={`text-left`}>
                                {quranText_tr[globalAyahNumber]}
                            </p>

                            {ayahText.includes(besmele) && (<div className="flex ml-2 text-sky-200"> {`${++besmeleCounter}`} </div>)}
                        </div>
                        <div className={`w-full`}>
                            <p className={`text-right`}>
                                <span dir="rtl">

                                    {showOriginalText && firstWord.split('').map((letter, index) => (
                                        letter.trim() !== '' && (
                                            <span key={index} dir="rtl" className="initial-letter text-sky-400">
                                                {letter} <span className="text-[11px] sm:text-sm">({initialsCounts[letter]})</span>
                                            </span>
                                        )

                                    ))
                                    }
                                    {showOriginalText && (<span>{restOfAyah}</span>)}


                                    {!showOriginalText && quranText[globalAyahNumber]}
                                </span>
                            </p>
                            {ayahText.includes(besmele) && (
                                <div className="flex ml-2 text-sky-200">{`${++besmeleCounter}`}</div>
                            )}
                        </div>

                    </div>)
                : (<div className={`w-full flex p-4 ${showOriginalText ? "justify-end" : "justify-start"}`}>
                    {searchTerm ?
                        (<p className={`w-full ${showOriginalText ? "text-right" : "text-left"}`}>
                            {highlightsearch(text, showOriginalText)}
                        </p>) :
                        (<p className={`w-full ${showOriginalText ? "text-right" : "text-left"}`}>
                            {highlight(text, showOriginalText)}
                        </p>)
                    }
                    {ayahText.includes(besmele) && (<div className="flex ml-2 text-sky-200"> {`${++besmeleCounter}`} </div>)}
                </div>)

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

    const groupLoadedAyahs = () => {
        let groups = [];
        let currentGroup = [];
        let currentTitle = null;

        loadedAyahs.forEach(([ayahNumber, ayahText], index) => {
            const surahSpecificAyahNumber = getSurahSpecificAyahNumber(ayahNumber);
            const title = titlesData[selectedSurah]?.[surahSpecificAyahNumber];

            if (title && currentGroup.length > 0) {
                groups.push({ title: currentTitle, ayahs: currentGroup });
                currentGroup = [[ayahNumber, ayahText]];
                currentTitle = title;
            } else {
                currentGroup.push([ayahNumber, ayahText]);
            }

            if (index === loadedAyahs.length - 1) {
                groups.push({ title: currentTitle, ayahs: currentGroup });
            }
        });

        return groups;
    };

    const loadedAyahGroups = groupLoadedAyahs();

    return (
        <div className="matching-ayah-list flex-col w-full p-1 overflow-auto bg-neutral-700">
            <div className="w-full">
                <ul className="quran-text-list flex-col space-y-2 mr-1">
                    <li key={selectedSurah + ":0"} className="text-neutral-700 text-lg m-0.5 w-full">
                        {(selectedSurah && (Number(selectedSurah) !== 1 && Number(selectedSurah) !== 9) && !searchTerm) && (
                            <div className="w-full p-0.5">
                                <div className="flex w-full bg-sky-500 rounded shadow-lg justify-end  ">
                                    <div className="w-full flex justify-end py-4">
                                        {highlight(besmele, true)}
                                    </div>
                                    <div className="flex py-4 px-2 items-center text-sky-200">
                                        {`${++besmeleCounter}`}
                                    </div>
                                </div>
                            </div>
                        )}
                        {loadedAyahGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="relative group-container px-1 mb-12 border-2 border-neutral-300/25 rounded-lg">
                                {group.title && <div className="title-container text-neutral-300 p-1.5 h-12"></div>}
                                {group.title && <div className="absolute bg-neutral-700 text-neutral-300 -top-5 left-2 p-1 w-fit">{group.title}</div>}
                                {group.ayahs.map(([ayahNumber, ayahText], index) => (
                                    <div
                                        key={ayahNumber}
                                        ref={index === group.ayahs.length - 1 && groupIndex === loadedAyahGroups.length - 1 ? lastAyahElementRef : null}
                                        onClick={() => toggleOriginalText(ayahNumber)}
                                        className={`ayah-container rounded shadow-lg justify-between mt-1 mb-1 cursor-pointer ${(ayahText.includes(besmele)) ? "bg-sky-500" : "bg-emerald-500"} `}
                                    >
                                        <div className={`w-full flex ${isSurahWithInitials(ayahNumber) && Number(getSurahSpecificAyahNumber(ayahNumber)) === 1 ? "bg-sky-700 rounded text-neutral-300" : "text-neutral-700"}`}>
                                            {renderAyahNumbers(ayahNumber)}
                                            {renderAyah(ayahNumber, ayahText)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </li>
                </ul>
            </div>
        </div>
    );

};

export default Ayetler;
