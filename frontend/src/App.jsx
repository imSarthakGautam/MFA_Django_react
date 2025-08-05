import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

export default function App() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">
          Hello, Tailwind + Vite!
        </h1>
        <p className="text-gray-500 mt-4">
          This is your frontend ready to connect with Django.
        </p>
      </div>
    </div>
  );
}
