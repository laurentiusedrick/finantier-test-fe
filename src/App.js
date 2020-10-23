import React from 'react';
import SearchBar from './components/SearchBar';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import Overview from './pages/Overview'
import PageNotFound from './pages/PageNotFound'
import Error from './pages/Error'
import Home from './pages/Home'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>

          <Route path="/*/*">
            <PageNotFound />
          </Route>

          <Route path="/">
            <SearchBar />
            <Switch>

              <Route exact path="/">
                <Home />
              </Route>

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
