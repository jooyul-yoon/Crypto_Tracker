import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "./Components/Coin";
import Coins from "./Components/Coins";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:cId">
          <Coin />
        </Route>
        <Route path="/">
          <Coins />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
