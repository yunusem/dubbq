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
    <div className="search-area flex flex-col w-full p-1">
      <div className="text-[#ffd700] m-1">Uygulama geliştirme aşamasındadır</div>
      <div className="relative w-full bg-neutral-800 rounded shadow p-2.5">
        <input
          type="text"
          id="searchBar"
          placeholder="Ara ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded bg-neutral-700 focus:outline-none focus:ring focus:ring-[#ffd700] focus:text-neutral-300"
        />
        <div className="absolute top-2.5 right-2.5">
          <label className="flex items-center justify-center relative cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyWord}
              onChange={handleCheckboxChange}
              className={`appearance-none transition-colors cursor-pointer w-10 h-10`}
            />
            <img
              src="match-whole-word.png"
              alt="W"
              className={`absolute w-10 h-10 object-fill ${onlyWord ? "brightness-150" : "brightness-100 opacity-50"}`}
            >
            </img>
          </label>
        </div>

      </div>

      {hitCount !== 0 && (
        <div className="w-full flex justify-between rounded p-4 mt-1 space-x-2 bg-neutral-800 text-[#ffd700]">
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
