import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const LandingPage = () => {

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Auth Starter</h1>
      <div className="flex gap-4">
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">Login</Link>
        <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded">Sign Up</Link>
      </div>
    </div>
  );
};
