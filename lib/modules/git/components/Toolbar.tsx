import React from "react";

interface ToolbarProps {
  title: string;
}

const Toolbar = ({ title = "Select a repo" }: ToolbarProps) => {
  return (
    <div className="flex items-center justify-between h-16 px-6">
      <div className="font-bold text-lg">{title}</div>
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 rounded">Button 1</button>
        <button className="px-4 py-2 rounded">Button 2</button>
      </div>
    </div>
  );
};

export default Toolbar;
