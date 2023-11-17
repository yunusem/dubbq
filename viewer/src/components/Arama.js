import React from 'react';

const Arama = ({ hitCount, searchTerm, setSearchTerm }) => {
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
      </div>
      <div className="w-full flex rounded p-2.5 m-0.5 space-x-2">
        <div>{searchTerm}</div>
        <div>{hitCount}</div>
      </div>
    </div>
  );
};

export default Arama;
