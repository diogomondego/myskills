import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { StatusBar } from 'expo-status-bar';
import { Home } from './src/screens/Home';

function App() {
  return (
    <>
      <StatusBar
        style="light"
        translucent
        backgroundColor="transparent"
      />
      <Home />
      <Toast />
    </>
  );
}

export default gestureHandlerRootHOC(App);