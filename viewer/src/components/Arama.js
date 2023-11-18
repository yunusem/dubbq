import React from 'react';

const Arama = ({ hitCount, searchTerm, setSearchTerm, setOnlyWord, onlyWord }) => {

  const handleCheckboxChange = (e) => {
    setOnlyWord(e.target.checked);
  };

  // Function to format the hit count
  const formatHitCount = (count) => {
    const factor = 19;
    if (count % factor === 0) {
      return `${count} (${factor} x ${count / factor})`;
    }
    return count;
  };

  return (
    <div className="search-area flex flex-col h-screen w-96 space-y-2">
      <div className="w-full bg-neutral-900 rounded shadow p-2.5 m-0.5">
        <input
          type="text"
          id="searchBar"
          placeholder="Ara ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded"
        />
        <div className="mt-4">
          <label className="flex items-center relative cursor-pointer select-none w-full justify-between">
            <span className="text-lg font-bold text-neutral-300 underline">|Sadece Sözcük|</span>
            <input 
              type="checkbox"
              checked={onlyWord}
              onChange={handleCheckboxChange}
              className={`appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full ${onlyWord ? "bg-[#ffd700]" : " bg-neutral-500" }`}
            />
            <span className={`w-7 h-7 ${onlyWord ? 'right-0' : 'right-7'} absolute rounded-full transform transition-transform duration-500 bg-neutral-800`} />
          </label>
        </div>
      </div>
     
      {hitCount !== 0 && (
        <div className="w-full flex justify-between rounded p-4 m-0.5 space-x-2 bg-neutral-800 text-[#ffd700]">
          <div>{searchTerm}</div>
          <div>{formatHitCount(hitCount)}</div>
        </div>)}
    </div>
  );
};

export default Arama;
