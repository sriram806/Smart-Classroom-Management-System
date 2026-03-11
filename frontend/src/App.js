import { BrowserRouter as Router } from 'react-router-dom';
import Main from './Components/Main';

function App() {
  return (
    <div className="App">
      <Router>
        <Main />
      </Router>
    </div>
  );
}

export default App;