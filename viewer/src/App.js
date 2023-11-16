import React, { useState } from 'react';
import quranText from '../src/assets/quran.json';
import quranText_tr from '../src/assets/quran_tr.json';
import surahData from '../src/assets/surah.json';
import './App.css';

function App() {
  const besmele = quranText["1"];
  const namesOfGod = "الله | لله | TANRI | Allah | Yaratıcı";
  const [expandedSurahs, setExpandedSurahs] = useState({});
  const [selectedTranslations, setSelectedTranslations] = useState({});

  let godWordOccurrence = 0;
  Object.values(quranText_tr).forEach(ayahText => {
    godWordOccurrence += (ayahText.match(new RegExp(namesOfGod, "g")) || []).length;
  });


  // Additionally, count "الله" in unnumbered besmeles for each surah except for surahs 1 and 9
  Object.keys(surahData).forEach(surahNumber => {
    if (surahNumber !== "1" && surahNumber !== "9") {
      godWordOccurrence += (besmele.match(new RegExp(namesOfGod, "g")) || []).length;
    }
  });

  const toggleSurah = (surahNumber) => {
    setExpandedSurahs(prevState => ({
      ...prevState,
      [surahNumber]: !prevState[surahNumber]
    }));
  };

  const toggleTranslation = (ayahNumber) => {
    setSelectedTranslations((prevState) => ({
      ...prevState,
      [ayahNumber]: !prevState[ayahNumber],
    }));
  };

  const ayahsBySurah = Object.entries(surahData).reduce((acc, [surahNumber, { start, end }]) => {
    acc[surahNumber] = Object.entries(quranText).slice(start - 1, end);
    return acc;
  }, {});

  let besmeleCount = 0;

  const highlight = (text, rtleft) => {
    const split = text.split(new RegExp(`(${namesOfGod})`, 'g'));
    let parts = [];
    if (rtleft) {
      parts = split.reverse();
      return parts.map((part, index) =>
        part.match(new RegExp(namesOfGod)) ? <span key={index} className="text-white mx-1" dir="rtl">{part}</span> : <span key={index} dir="rtl">{part}</span>
      )
    } else {
      parts = split;
      return parts.map((part, index) =>
        part.match(new RegExp(namesOfGod)) ? <span key={index} className="text-white mx-1" >{part}</span> : <span key={index}>{part}</span>
      )
    }
  };

  const renderAyah = (ayahNumber, ayahText) => {
    const showTranslation = selectedTranslations[ayahNumber];
    const text = showTranslation ? quranText_tr[ayahNumber] : ayahText;

    return (
      <div className={`w-full flex p-4 ${showTranslation ? "justify-start" : "justify-end"}`}>
        <div className={`${showTranslation ? "text-left" : "text-right"}`}>
          {highlight(text, !showTranslation)}
        </div>
        {ayahText.includes(besmele) && (
          <div className="flex p-4 items-center text-blue-500">
            {`${++besmeleCount}`}
          </div>)}
      </div>
    );
  };

  return (
    <div className="App select-none">
      <header className="App-header">
        <div className="bg-green-300 p-4 rounded shadow-md text-lg text-green-700 mb-2">
          Count of "الله" in the Quran: {godWordOccurrence}
        </div>
        <ul className="quran-text-list flex-col space-y-2 w-2/3">
          {Object.entries(ayahsBySurah).map(([surahNumber, ayahs]) => {
            const surah = surahData[surahNumber];
            const isSurahExpanded = expandedSurahs[surahNumber];
            if (Number(surahNumber) !== 1 && Number(surahNumber) !== 9) {
              besmeleCount += 1;
            }
            return (
              <li key={surah.name} className="text-neutral-700 text-lg">
                <div
                  className="flex w-full bg-neutral-900 rounded shadow-black justify-between mb-2 text-neutral-300 cursor-pointer"
                  onClick={() => toggleSurah(surahNumber)}
                >
                  <div className="flex w-32 justify-end items-center p-4">{`${surahNumber}`}</div>
                  <div className="w-full flex justify-end p-4">{surah.name}</div>
                </div>

                {isSurahExpanded && (Number(surahNumber) !== 1 && Number(surahNumber) !== 9) && (
                  <div className="flex w-full bg-blue-300 rounded shadow-black justify-end mb-2 ">
                    <div className="w-full flex justify-end p-4">{besmele}</div>
                    <div className="flex p-4 items-center text-blue-500">
                      {`${besmeleCount}`}
                    </div>
                  </div>)}

                {isSurahExpanded && ayahs.map(([ayahNumber, ayahText]) => (
                  <div key={ayahNumber} onClick={() => toggleTranslation(ayahNumber)}
                    className={`flex w-full rounded shadow-black justify-between mb-2 cursor-pointer ${(ayahText.includes(besmele)) ? "bg-blue-300" : "bg-orange-300"} `}>
                    <div className="flex w-32 justify-end items-center p-4">{ayahNumber}</div>

                    {renderAyah(ayahNumber, ayahText)}

                  </div>
                ))}
              </li>
            );
          })}
        </ul>
      </header>
    </div>
  );
}

export default App;
