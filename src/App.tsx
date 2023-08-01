import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Hasabe from './apps/hasabe/App';
import PrivacyPolicy from './apps/policies/PrivacyPolicy';
import TermsAndConditions from './apps/policies/TermsAndConditions';

// import Strategies from "./apps/strategies/Strategies";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/privacy">
        <PrivacyPolicy />
      </Route>
      <Route path="/terms">
        <TermsAndConditions />
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
