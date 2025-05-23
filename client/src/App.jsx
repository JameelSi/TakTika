import React from 'react';
import { useSession } from './providers/SessionProvider';
import LoadingScreen from './components/LoadingScreen';
import 'bootstrap/dist/css/bootstrap.min.css';


function App({ children }) {

  const { sessionReady } = useSession();

  if (!sessionReady) return <LoadingScreen/>;

  return children;
}

export default App;