import { useState } from "react";
import FlagLoader from "./components/spinners/flagloader";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import RoutesApp from "./RoutesApp";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [showLoader, setshowLoader] = useState(false);

  if (showLoader)
    return (
      <div className="bg-red-500 h-screen w-full">
        <FlagLoader showLoader={showLoader} />
      </div>
    );

  return (
    <Provider store={store}>
      <AuthProvider>
        <RoutesApp />
      </AuthProvider>
    </Provider>
  );
}

export default App;
