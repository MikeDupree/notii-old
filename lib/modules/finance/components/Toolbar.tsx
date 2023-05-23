import React from "react";

type Props = {
  onLabelClick: (label: string) => void;
};

const Toolbar = ({ onLabelClick }: Props) => {
  const labelClick = (label: string) => {
    onLabelClick?.(label);
  };
  return (
    <div className="sticky top-0 bg-gray-800 z-10">
      <div className="flex items-center space-x-4">
        <div className="relative inline-block">
          <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:bg-gray-700">
            Label
          </button>
        </div>
        <button onClick={() => labelClick('Bill')} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:bg-gray-700">
          Bill Payment
        </button>
        <button onClick={() => labelClick('Home')} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:bg-gray-700">
          Home & Groceries
        </button>
        <button onClick={() => labelClick('Automobile')} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:bg-gray-700">
          Automobile
        </button>
      </div>
    </div>
  );
};

export default Toolbar;

// <ul className="absolute left-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg">
//   <li>
//     <a href="#" className="block px-4 py-2 hover:bg-gray-200">
//       Option 1
//     </a>
//   </li>
//   <li>
//     <a href="#" className="block px-4 py-2 hover:bg-gray-200">
//       Option 2
//     </a>
//   </li>
//   <li>
//     <a href="#" className="block px-4 py-2 hover:bg-gray-200">
//       Option 3
//     </a>
//   </li>
// </ul>;
