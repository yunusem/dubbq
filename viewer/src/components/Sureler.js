import React from 'react';
import surahData from '../assets/surah.json';

const Sureler = ({ onSelectSurah, selectedSurah }) => {

    const handleClick = (no) => {
        if (Number(selectedSurah) === Number(no)) {
            onSelectSurah(null);
        } else {
            onSelectSurah(no);
        }
    }

    return (
        <div className="navigation h-screen overflow-auto w-64">
            <ul className="surah-list flex-col space-y-2 mr-3">
                {Object.entries(surahData).map(([surahNumber, surahInfo]) => {
                    return (
                        <li key={surahNumber} className="text-neutral-700 text-lg m-0.5 w-full">
                            <button
                                className="flex w-full bg-neutral-900 rounded shadow-black justify-between mb-2 cursor-pointer duration-100 transform  hover:scale-105"
                                onClick={() => handleClick(surahNumber)}
                            >
                                <div className="flex w-16 justify-end items-center px-4 py-1">{surahNumber}</div>
                                <div className={`w-full flex justify-end px-4 py-1 ${Number(surahNumber) ===  Number(selectedSurah) ? 'text-[#ffd700]' : 'text-neutral-300'}`}>
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
