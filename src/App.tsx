import { BrowserRouter, Route, Switch } from "react-router-dom";
import Hasabe from "./apps/hasabe/App";
import Strategies from "./apps/strategies/Strategies";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/strategies">
        <Strategies />
      </Route>
      <Route path="/">
        <Hasabe />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
