import React from 'react';
import SearchPage from './components/SearchPage';
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

        {/* <Route path="/"> */}
          {/* <Switch> */}

        <Route path="/error">
          <Error />
        </Route>

        <Route path="/:symbol">
          <Overview />
        </Route>

        <Route exact path="/">
          <SearchPage />
        </Route>
            
          {/* </Switch> */}
        {/* </Route> */}
        
      </Switch>
      </Router>
    </div>
  );
}

export default App;
