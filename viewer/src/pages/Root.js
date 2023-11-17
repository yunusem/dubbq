import React, { useState, useEffect } from 'react';
import Sureler from '../components/Sureler';
import Arama from '../components/Arama';
import Ayetler from '../components/Ayetler';

import quranText from '../assets/quran.json';
import quranText_tr from '../assets/quran_tr.json';
import surahData from '../assets/surah.json';

function Root() {
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [ayahs, setAyahs] = useState([]);
    const [hitCount,setHitCount] = useState(0);

    const handleSelectSurah = (surahNumber) => {
        setSelectedSurah(surahNumber);
        setSearchTerm("");
    };

    useEffect(() => {
        if(searchTerm) {
            setSelectedSurah(null);
            const searchResults = Object.entries(quranText).filter(([ayahNumber, ayahText]) => 
                ayahText.includes(searchTerm) ||
                (quranText_tr[ayahNumber] && quranText_tr[ayahNumber].includes(searchTerm))
            );
            setAyahs(searchResults);
            setHitCount(searchResults.length)
        } else {
            setAyahs([]);
        }
    }, [searchTerm]);

    useEffect(() => {
        setAyahs(selectedSurah ? Object.entries(quranText).slice(surahData[selectedSurah].start - 1, surahData[selectedSurah].end) : []);
    }, [selectedSurah]);

    return (
        <div className="Root select-none bg-neutral-700 flex space-x-1">
            <Sureler onSelectSurah={handleSelectSurah} selectedSurah={selectedSurah} />
            <Arama hitCount={hitCount} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Ayetler selectedSurah={selectedSurah} searchTerm={searchTerm} ayahs={ayahs}/>
        </div>
    );
}

export default Root;
