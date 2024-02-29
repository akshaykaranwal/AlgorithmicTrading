import React, { useState } from 'react';
import TradingStrategy from './TradingStrategy';

const ParentComponent = () => {
  const [retesting, setRetesting] = useState(false);

  return (
    <TradingStrategy setRetesting={setRetesting} />
  );
};

export default ParentComponent;
