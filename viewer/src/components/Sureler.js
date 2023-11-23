import React, { useState, useMemo, useEffect } from 'react';
import surahData from '../assets/surah.json';
import surahData_tr from '../assets/surah_tr.json';

const Sureler = ({ onSelectSurah, selectedSurah }) => {
    const [sortByRevelation, setSortByRevelation] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        setIsNavOpen(false);
    }, [selectedSurah]);

    const handleClick = (no) => {
        if (Number(selectedSurah) === Number(no)) {
            onSelectSurah(null);
        } else {
            onSelectSurah(no);
        }
    };

    const sortedSurahs = useMemo(() => {
        const surahArray = Object.entries(surahData);
        if (sortByRevelation) {
            return surahArray.sort((a, b) => a[1].revelationOrder - b[1].revelationOrder);
        }
        return surahArray;
    }, [sortByRevelation]);

    const getTranslatedSurahName = (surahNumber) => {
        return surahData_tr[surahNumber]?.name || surahData[surahNumber]?.name;
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between bg-neutral-800 m-1 rounded">
                <button
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    className="text-[#ffd700] p-1 md:p-4 rounded hover:bg-neutral-800 w-full md:text-3xl"
                >
                    {selectedSurah ? getTranslatedSurahName(Number(selectedSurah)) : "Sureler"}


                    {/* If you're using an icon (ensure you have the icon set up correctly) */}
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className={`${isNavOpen ? "md:block  h-96 md:h-fit overflow-auto md:overscroll-none" : "hidden"} `}>
                <div className="relative py-2 px-4 bg-neutral-800 rounded m-1">
                    <label className=" flex items-center justify-between">
                        <span className="text-lg font-bold text-neutral-300">Vahiy sırası</span>
                        <input
                            type="checkbox"
                            checked={sortByRevelation}
                            onChange={() => setSortByRevelation(!sortByRevelation)}
                            className={`appearance-none  transition-colors cursor-pointer w-14 h-7 rounded-full ${sortByRevelation ? "bg-[#ffd700]" : " bg-neutral-500"}`}
                        />
                        <span className={`w-8 h-8 ${sortByRevelation ? ' right-3.5' : 'right-10'} absolute rounded-full transform transition-transform bg-neutral-900`} />
                    </label>
                </div>

                <ul className={`${sortByRevelation ? "flex flex-col space-y-0.5" : "grid grid-cols-3 md:grid-cols-6 gap-0.5"}  px-1 md:bg-neutral-700 `}>
                    {sortedSurahs.map(([surahNumber, surahInfo]) => (
                        <li key={surahNumber} className={` rounded text-lg m-0.5 ${surahInfo.type === "wi" ? "bg-sky-700 text-neutral-800" : "bg-neutral-900 text-neutral-500"}`}>
                            <button
                                type="button"
                                className="flex w-full justify-between cursor-pointer active:bg-neutral-700 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                                onClick={() => handleClick(surahNumber)}
                            >
                                <div className={`flex md:w-12 justify-end items-center px-2 py-1 ${Number(surahNumber) === Number(selectedSurah) ? "text-[#ffd700] font-extrabold" :  "text-neutral-300"}`}>{surahNumber}</div>
                                <div className="block md:hidden text-neutral-300">
                                    <div className={`w-full flex justify-end text-sm p-2 -translate-x-3 md:translate-x-0 ${Number(surahNumber) === Number(selectedSurah) ? 'text-[#ffd700] font-extrabold' : ''}`}>
                                        {getTranslatedSurahName(Number(surahNumber))}
                                    </div>
                                </div>
                                <div className="hidden md:flex md:justify-between md:w-full text-neutral-300">
                                    <div className={`w-full flex justify-start text-sm p-2 -translate-x-3 md:translate-x-0 ${Number(surahNumber) === Number(selectedSurah) ? 'text-[#ffd700]' : ''}`}>
                                        {getTranslatedSurahName(Number(surahNumber))}
                                    </div>
                                    <div className={`w-full flex justify-end text-sm p-2 -translate-x-3 md:translate-x-0 ${Number(surahNumber) === Number(selectedSurah) ? 'text-[#ffd700]' : ''}`}>
                                        {surahInfo.name}
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sureler;
