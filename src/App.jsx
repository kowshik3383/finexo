import React, { useState, useEffect } from 'react';
import './App.css';
import FileImportPage from './components/FIleImport';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay for the loading screen (e.g., 2 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <img src="https://finexo.in/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ftb3xbyw3%2Fproduction%2Ff1ae2cc3f9fcdcb2fc581ec6960b60c656fb7a70-700x150.png%3Fw%3D700%26auto%3Dformat&w=640&q=75" alt="" />
      </div>
    );
  }

  return <FileImportPage />;
}

export default App;
