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
    const [onlyWord, setOnlyWord] = useState(false);
    const [hitCount, setHitCount] = useState(0);

    const handleSelectSurah = (surahNumber) => {
        setSelectedSurah(surahNumber);
        setSearchTerm("");
        setHitCount(0);
    };

    const gatherAyahs = async (term, matchWholeWord = true) => {
        return new Promise(resolve => {
            let hitScore = 0;
            const regexPattern = matchWholeWord ? `\\b${term}\\b` : term;
            const regex = new RegExp(regexPattern, 'g');

            const matchedAyahs = Object.entries(quranText).filter(([ayahNumber, ayahText]) => {
                const countInAyahText = (ayahText.match(regex) || []).length;
                const countInTranslatedText = quranText_tr[ayahNumber] ? (quranText_tr[ayahNumber].match(regex) || []).length : 0;

                hitScore += countInAyahText + countInTranslatedText;
                return countInAyahText > 0 || countInTranslatedText > 0;
            });

            resolve({ matchedAyahs, hitScore });
        });
    };

    useEffect(() => {
        if (searchTerm) {
            setSelectedSurah(null);
            gatherAyahs(searchTerm, onlyWord).then(({ matchedAyahs, hitScore }) => {
                setAyahs(matchedAyahs);
                setHitCount(hitScore);
            });
        } else {
            setAyahs([]);
            setHitCount(0);
        }
    }, [searchTerm, onlyWord]);

    useEffect(() => {
        setAyahs(selectedSurah ?
            Object.entries(quranText).slice(
                surahData[selectedSurah].start - 1,
                surahData[selectedSurah].end
            ) : []
        );
    }, [selectedSurah]);

    return (
        <div className="Root select-none bg-neutral-700 flex space-x-1">
            <Sureler onSelectSurah={handleSelectSurah} selectedSurah={selectedSurah} />
            <Arama hitCount={hitCount} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setOnlyWord={setOnlyWord} onlyWord={onlyWord}/>
            <Ayetler selectedSurah={selectedSurah} searchTerm={searchTerm} ayahs={ayahs} />
        </div>
    );
}

export default Root;
