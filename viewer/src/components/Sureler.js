import React, { useState, useMemo } from 'react';
import surahData from '../assets/surah.json';

const Sureler = ({ onSelectSurah, selectedSurah }) => {
    const [sortByRevelation, setSortByRevelation] = useState(false);

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

    return (
        <div className="navigation h-screen overflow-auto w-64 ">
            <div className="px-2 py-4">
                <label className="flex items-center relative cursor-pointer select-none w-full justify-between">
                    <span className="text-lg font-bold text-neutral-300 ">Vahiy sırası</span>
                    <input
                        type="checkbox"
                        checked={sortByRevelation}
                        onChange={() => setSortByRevelation(!sortByRevelation)}
                        className={`appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full ${sortByRevelation ? "bg-[#ffd700]" : " bg-neutral-500"}`}
                    />
                    <span className={`w-8 h-8 ${sortByRevelation ? ' -right-1' : 'right-7'} absolute rounded-full transform transition-transform bg-neutral-800`} />
                </label>
            </div>

            <ul className="surah-list flex-col mr-3">
                {sortedSurahs.map(([surahNumber, surahInfo]) => {
                    return (
                        <li key={surahNumber} className="text-neutral-700 text-lg m-0.5 w-full">
                            <button
                                type="button"
                                className="flex w-full  justify-between cursor-pointer bg-neutral-900 active:bg-neutral-700 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                                onClick={() => handleClick(surahNumber)}
                            >
                                <div className="flex w-16 justify-end items-center px-4 py-1">{surahNumber}</div>
                                <div className={`w-full flex justify-end px-4 py-1 ${Number(surahNumber) === Number(selectedSurah) ? 'text-[#ffd700]' : 'text-neutral-300'}`}>
                                    {surahInfo.name}
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Sureler;
