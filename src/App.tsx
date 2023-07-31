import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Hasabe from './apps/hasabe/App';
import PrivacyPolicy from './apps/policies/PrivacyPolicy';

// import Strategies from "./apps/strategies/Strategies";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/privacy">
        <PrivacyPolicy />
      </Route>
      {/* <Route path="/strategies">
        <Strategies />
      </Route> */}
      <Route path="/">
        <Hasabe />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
