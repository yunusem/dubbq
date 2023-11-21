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
    <div className="search-area flex flex-col w-full p-0.5">
     <div className="text-[#ffd700] m-1">Uygulama geliştirme aşamasındadır</div>
      <div className="w-full bg-neutral-900 rounded shadow p-2.5">
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
              className={`appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full ${onlyWord ? "bg-[#ffd700]" : "bg-neutral-500"}`}
            />
            <span className={`w-8 h-8 ${onlyWord ? '-right-1' : 'right-7'} absolute rounded-full transform transition-transform duration-150 bg-neutral-800`} />
          </label>
        </div>
      </div>

      {hitCount !== 0 && (
        <div className="w-full flex justify-between rounded p-4 m-0.5 space-x-2 bg-neutral-800 text-[#ffd700]">
          <div>{searchTerm}</div>
          <div>{formatHitCount(hitCount)}</div>
        </div>)}

      {false && (
        <div className="absolute translate-x-12 translate-y-96 ">
          <div className="relative group w-full cursor-pointer">
            <div className="absolute w-48 -inset-1 translate-x-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
            <div className="relative h-48 w-48 p-4 bg-neutral-700 ring-1 ring-neutral-900/5 rounded-full leading-none flex items-top justify-start space-x-6">
              <div className="w-full h-full flex p-4 justify-center text-neutral-800/20 group-hover:text-neutral-800/80 subpixel-antialiased items-center text-9xl font-semibold transition duration-1000 group-hover:duration-100">
              19
              </div>
            </div>
          </div>
        </div>

      )}
    </div>
  );
};

export default Arama;
