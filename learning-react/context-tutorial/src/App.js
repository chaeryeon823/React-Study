import React from 'react';
import ColorBox from './components/ColorBox';
import SelectColor from './components/SelectColors';
import { ColorProvider } from './contexts/color';
const App = () => {
  return (
    <ColorProvider>
      <div>
        <SelectColor />
        <ColorBox />
      </div>
    </ColorProvider>
  );
};

export default App;
