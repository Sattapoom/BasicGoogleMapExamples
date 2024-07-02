import { Routes, Route, Outlet, Link } from "react-router-dom";
import Home from "./exaple/Home";
import { useState } from "react";
import Ex01BasicMap from "./exaple/Ex01BasicMap";
import Ex02Pinning from "./exaple/Ex02Pinning";
import Ex03PlaceSuggest from "./exaple/Ex03PlaceSuggest";
import Ex04Routing from "./exaple/Ex04Routing";
import Ex05Clustering from "./exaple/Ex05Clustering";
import Ex06BestRouteCalculate from "./exaple/Ex06BestRouteCalculate";
import { APIProvider } from "@vis.gl/react-google-maps";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="ex1" element={<Ex01BasicMap />} />
        <Route path="ex2" element={<Ex02Pinning />} />
        <Route path="ex3" element={<Ex03PlaceSuggest />} />
        <Route path="ex4" element={<Ex04Routing />} />
        <Route path="ex5" element={<Ex05Clustering />} />
        <Route path="ex6" element={<Ex06BestRouteCalculate />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  const [sideBarShow, setSideBarShow] = useState(false);

  return (
    <div>
      <div className="bg-gray-100">

        <div className="h-screen flex overflow-hidden bg-gray-200">
          <div className={`absolute z-50 bg-gray-800 text-white w-56 min-h-screen overflow-y-auto transition-transform transform ease-in-out duration-300 ${sideBarShow ? null : "-translate-x-full"}`}
            id="sidebar">
            <div className="p-4 select-none" >
              <h1 className="text-2xl text-amber-800 font-semibold">Examples</h1>
              <ul className="mt-4" onClick={() => setSideBarShow(false)}>
                <li className="mb-2 transition-transform transform origin-left hover:scale-125"><Link to="/">{"< Back to Home page"}</Link></li>
                <li className="mb-2 transition-transform transform origin-left hover:scale-125"><Link to="/ex1">Ex1 Display basic map</Link></li>
                <li className="mb-2 transition-transform transform origin-left hover:scale-125"><Link to="/ex2">Ex2 Pinning</Link></li>
                <li className="mb-2 transition-transform transform origin-left hover:scale-125"><Link to="/ex3">Ex3 Place suggestion</Link></li>
                <li className="mb-2 transition-transform transform origin-left hover:scale-125"><Link to="/ex4">Ex5 Basic routing</Link></li>
                <li className="mb-2 transition-transform transform origin-left hover:scale-125"><Link to="/ex5">Ex6 Clustering</Link></li>
                <li className="mb-2 transition-transform transform origin-left hover:scale-125"><Link to="/ex6">Ex7 Best route calculate</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white shadow">
              <div className="container mx-auto">
                <div className="flex justify-between items-center py-4 px-2">
                  <h1 className="text-xl font-semibold">Learn Google Map By P'Poom</h1>

                  <button className="text-gray-500 hover:text-gray-600" onClick={() => setSideBarShow(!sideBarShow)}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_KEY}>
              <div className="flex-1 overflow-auto p-4">
                <Outlet />
              </div>
            </APIProvider>
          </div>
        </div>
      </div>
    </div>

  );
}

function NoMatch() {
  return (
    <div className="w-screen text-center">
      <h2>Ahh nothing here!</h2>
      <p>
        <span>Go to the <Link to="/"><span className="text-blue-600 hover:text-blue-400 hover:underline">Home page</span></Link></span>
      </p>
    </div>
  );
}