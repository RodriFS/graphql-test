import React from 'react';
import './App.css';
import TestComponent from './components/testComponent';

class App extends React.Component {
  render() {
    return (
      <div className="App">
          <TestComponent></TestComponent>
      </div>
    );
  }
}

export default App;
