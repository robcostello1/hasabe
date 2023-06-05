import TaskUi from "./components/TaskUi";
import Theme from "../../components/Theme";
import { useEffect, useState } from "react";
import { DBContext, DBContextValue } from "./utils/context";

const UserAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    // Is user authenticated?
    (async () => {
      const userResponse = await fetch(`http://localhost:5984/_session`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        redirect: "follow",
        credentials: "include",
      }).then((res) => res.json());

      if (userResponse.userCtx.name === null) {
        const userPostResponse = await fetch(`http://localhost:5984/_session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          redirect: "follow",
          credentials: "include",
          body: JSON.stringify({ name: "rob", password: "1234" }),
        }).then((res) => res.json());

        if (userPostResponse.userCtx.name !== null) {
          setLoggedIn(true);
        }
      } else {
        setLoggedIn(true);
      }
    })();
  }, []);

  return null;
};

const App = () => {
  return (
    <Theme>
      <UserAuth />
      <DBContext.Provider value={DBContextValue}>
        <TaskUi />
      </DBContext.Provider>
    </Theme>
  );
};

export default App;
