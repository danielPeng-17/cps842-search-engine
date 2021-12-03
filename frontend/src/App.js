import './App.css';
import SearchPage from './pages/search-page';
import ResultsPage from './pages/results-page';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {
  
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<SearchPage />}  />
          <Route path="/result" element={<ResultsPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
