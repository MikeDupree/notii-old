import React, { ReactNode } from "react";
import Toolbar from "./Toolbar";
interface LayoutProps {
  title: string;
  leftCol: ReactNode;
  children: ReactNode;
}
const Layout = ({ title, leftCol, children }: LayoutProps) => {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-12 gap-4  p-1">
      <div className="header col-span-12 rounded-lg border border-gray-300 py-8">
        <Toolbar title={title} />
      </div>
      {leftCol && (
        <div className="col-span-12 rounded-lg border border-gray-500 sm:col-span-4">
          {leftCol}
        </div>
      )}
      <div
        className={`col-span-12 rounded-lg border border-gray-400 ${
          leftCol ? "p-32 sm:col-span-8" : ""
        }`}
      >
        {children}
      </div>
      <div className="footer col-span-12 rounded-lg border border-gray-800 p-6"></div>
    </div>
  );
};

export default Layout;
