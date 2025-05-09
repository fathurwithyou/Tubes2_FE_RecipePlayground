import React from 'react';

interface AlgorithmSelectorProps {
  algorithm: string;
  setAlgorithm: (value: string) => void;
  mode: string;
  setMode: (value: string) => void;
  maxRecipes: number;
  setMaxRecipes: (value: number) => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithm,
  setAlgorithm,
  mode,
  setMode,
  maxRecipes,
  setMaxRecipes,
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div>
        <label>
          <input
            type="radio"
            name="algorithm"
            value="BFS"
            checked={algorithm === 'BFS'}
            onChange={() => setAlgorithm('BFS')}
          />
          BFS
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            name="algorithm"
            value="DFS"
            checked={algorithm === 'DFS'}
            onChange={() => setAlgorithm('DFS')}
          />
          DFS
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          <input
            type="radio"
            name="mode"
            value="shortest"
            checked={mode === 'shortest'}
            onChange={() => setMode('shortest')}
          />
          Find Shortest Recipe
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            name="mode"
            value="multiple"
            checked={mode === 'multiple'}
            onChange={() => setMode('multiple')}
          />
          Find Multiple Recipes
        </label>
      </div>
      {mode === 'multiple' && (
        <div style={{ marginTop: '10px' }}>
          <label>
            Max Recipes:{' '}
            <input
              type="number"
              min={1}
              max={100}
              value={maxRecipes}
              onChange={(e) => setMaxRecipes(Number(e.target.value))}
              style={{ width: '60px' }}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default AlgorithmSelector;
