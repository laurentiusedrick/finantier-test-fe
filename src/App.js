import React from 'react';
import SearchBar from './components/SearchBar';
import {Switch,Route,BrowserRouter as Router} from 'react-router-dom'
import Overview from './pages/Overview'
import Error from './pages/Error'

function App() {
  return (
    <div className="App">
      <Router>
      <Switch>

        <Route path="/*/*">
          <h1>404 Page not Found</h1>
        </Route>

        <Route path="/">
          <SearchBar />
          <Switch>

            <Route path="/error">
              <Error />
            </Route>

            <Route path="/:symbol">
              <Overview />
            </Route>
            
          </Switch>
        </Route>
        
      </Switch>
      </Router>
    </div>
  );
}

export default App;
