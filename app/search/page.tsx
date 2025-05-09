"use client";

import React, { useEffect, useState } from 'react';
import RecipeTree from '../../components/RecipeTree'
import AlgorithmSelector from '../../components/AlgorithmSelector';

interface Element {
  name: string;
  recipes: string[][] | null;
  tier: number;
}

interface BackendData {
  elements: Element[];
}

interface SearchResult {
  data: BackendData;
  searchTime: number;
  visitedNodes: number;
}

const FinderPage: React.FC = () => {
  const [data, setData] = useState<BackendData>({ elements: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [algorithm, setAlgorithm] = useState<string>('BFS');
  const [mode, setMode] = useState<string>('shortest');
  const [maxRecipes, setMaxRecipes] = useState<number>(1);

  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<number | null>(null);

  const [targetElement, setTargetElement] = useState<string>('');

  useEffect(() => {
    fetch('/api/elements')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch elements data');
        }
        return res.json();
      })
      .then((jsonData: BackendData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const performSearch = () => {
    if (!targetElement) {
      alert('Please enter an element name to search');
      return;
    }
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append('target', targetElement);
    params.append('algorithm', algorithm);
    params.append('mode', mode);
    if (mode === 'multiple') {
      params.append('maxRecipes', maxRecipes.toString());
    }

    fetch(`/api/search?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Search failed');
        }
        return res.json();
      })
      .then((result: SearchResult) => {
        setData(result.data);
        setSearchTime(result.searchTime);
        setVisitedNodes(result.visitedNodes);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  if (loading) {
    return <div style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh' }}>Error: {error}</div>;
  }

  return (
    <div style={{ backgroundColor: 'white', color: 'black', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{color: 'black'}}>Recipe Tree</h1>
      <AlgorithmSelector
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        mode={mode}
        setMode={setMode}
        maxRecipes={maxRecipes}
        setMaxRecipes={setMaxRecipes}
      />
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'black' }}>
          Target Element:{' '}
          <input
            type="text"
            value={targetElement}
            onChange={(e) => setTargetElement(e.target.value)}
            placeholder="Enter element name"
            style={{
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
              borderRadius: '4px',
              padding: '6px 8px',
              marginLeft: '5px',
            }}
          />
        </label>
        <button onClick={performSearch} style={{ marginLeft: '10px' }}>
          Search
        </button>
      </div>
      <div style={{ width: '100vw', maxWidth: '100vw', overflowX: 'auto' }}>
        <RecipeTree data={data} width="100%" height={600} rootName={targetElement || 'Root'} />
      </div>
      <div style={{ marginTop: '20px' }}>
        {searchTime !== null && <p>Search Time: {searchTime} ms</p>}
        {visitedNodes !== null && <p>Visited Nodes: {visitedNodes}</p>}
      </div>
    </div>
  );
};

export default FinderPage;
