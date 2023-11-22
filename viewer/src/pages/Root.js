import React, { useState, useEffect, useCallback } from 'react';
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

    const escapeRegExp = useCallback((string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }, []);

    const isWholeWordMatch = useCallback((text, matchIndex, termLength) => {
        const charBefore = matchIndex > 0 ? text[matchIndex - 1] : ' ';
        const charAfter = matchIndex + termLength < text.length ? text[matchIndex + termLength] : ' ';

        return !charBefore.match(/\w/) && !charAfter.match(/\w/);
    }, []);

    const gatherAyahs = useCallback(async (term, matchWholeWord = true) => {
        return new Promise(resolve => {
            let hitScore = 0;
            const escapedTerm = escapeRegExp(term);
            const regex = new RegExp(escapedTerm, 'g');

            const matchedAyahs = Object.entries(quranText).filter(([ayahNumber, ayahText]) => {
                const matchesInAyahText = [...ayahText.matchAll(regex)];
                const matchesInTranslatedText = quranText_tr[ayahNumber] ? [...quranText_tr[ayahNumber].matchAll(regex)] : [];

                const countInAyahText = matchWholeWord ?
                    matchesInAyahText.filter(match => isWholeWordMatch(ayahText, match.index, escapedTerm.length)).length :
                    matchesInAyahText.length;
                const countInTranslatedText = matchWholeWord ?
                    matchesInTranslatedText.filter(match => isWholeWordMatch(quranText_tr[ayahNumber], match.index, escapedTerm.length)).length :
                    matchesInTranslatedText.length;

                hitScore += countInAyahText + countInTranslatedText;
                return countInAyahText > 0 || countInTranslatedText > 0;
            });

            resolve({ matchedAyahs, hitScore });
        });
    }, [escapeRegExp, isWholeWordMatch]);

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
    }, [searchTerm, onlyWord, gatherAyahs]);

    useEffect(() => {
        setAyahs(selectedSurah ?
            Object.entries(quranText).slice(
                surahData[selectedSurah].start - 1,
                surahData[selectedSurah].end
            ) : []
        );
    }, [selectedSurah]);

    return (
        <div className="Root select-none bg-neutral-700 flex flex-col h-screen">
            {!selectedSurah && <Arama hitCount={hitCount} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setOnlyWord={setOnlyWord} onlyWord={onlyWord}/>}
            <Sureler onSelectSurah={handleSelectSurah} selectedSurah={selectedSurah} />
            <Ayetler selectedSurah={selectedSurah} searchTerm={searchTerm} ayahs={ayahs} />
        </div>
    );
}

export default Root;
