import React from "react";
import { ipcRenderer } from "electron";

const SelectGitRepo = () => {
  const openDialog = () => {
    console.log("Sending git:openDirectory");
    ipcRenderer.send("git:openDirectory");
  };

  return (
    <div className="w-full h-20 bg-gray-200 flex justify-center items-center">
      <button
        className="bg-white rounded-lg p-4 flex items-center hover:bg-gray-100"
        onClick={openDialog}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Select a git repository
      </button>
    </div>
  );
};

export default SelectGitRepo;