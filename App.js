// App.js
import React from 'react';
import AppNavigator from './app/navigations/AppNavigator';
import { LogBox } from 'react-native';

// Ignore warning for gesture handler (if any)
LogBox.ignoreLogs(['Warning: ...']);

const App = () => {
  return <AppNavigator />;
};

export default App;
