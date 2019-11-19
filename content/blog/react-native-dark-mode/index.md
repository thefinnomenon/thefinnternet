# Introduction
In this post we will be implementing light and dark mode in our React-Native app using styled-components, context, and react-native-appearance. By the end of the post our app will default to the OS theme on start, update on OS theme change, and toggle light and dark based off of the switch. If a picture says a thousand words than a GIF says like a million or something so just look this GIF of what we will be making.

![Project Demo](demo.gif "Project Demo")

# Initialize Project
```
npx react-native init lightSwitch --template react-native-template-typescript
cd lightSwitch
```

```
git init
git add -A
git commit -m "react-native init"
```

# Add Styled-Components
```
yarn add styled-components
yarn add --dev @types/styled-components
```

# Theming
## Handle System Mode
Currently React-Native doesn't have an API for checking if the device is set to dark mode so we need this library.

```
yarn add react-native-appearance
```

### iOS
```
cd ios/
pod install
cd ..
```

### Android
Add the uiMode flag

```
// android/app/src/main/AndroidManifest.xml

<activity
...
android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode">
Implement the onConfigurationChanged method in MainActivity.java:
```

Implement the onConfigurationChanged method

```
// android/app/src/main/java/com/<PROJECT_NAME>/MainActivity.java

import android.content.Intent; // <--- import
import android.content.res.Configuration; // <--- import

public class MainActivity extends ReactActivity {
  ......

  // copy these lines
  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    sendBroadcast(intent);
  }

  ......
}
```

## Define Types
```javascript
// types.ts

export type ThemeMode = 'light' | 'dark';

export interface ThemeContext {
  mode: ThemeMode;
  toggle(): void;
}
```

## Create Context
The ManageThemeContext is where all the magic happens. Here we create a new context, get the current OS mode, pass the theme into the styled-component's ThemeProvider, register for OS mode changes, and set the status bar color appropriately.

```javascript
// contexts/ManageThemeContext.tsx

import React, {createContext, useState, FC, useEffect} from 'react';
import {ThemeMode, ThemeContext} from '../types';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
// @ts-ignore
import {Appearance, AppearanceProvider} from 'react-native-appearance';
import lightTheme from '../themes/light';
import darkTheme from '../themes/dark';

// Get OS default mode or default to 'light'
const defaultMode = Appearance.getColorScheme() || 'light';

// Create ManageThemeContext which will hold the current mode and a function to change it
const ManageThemeContext = createContext<ThemeContext>({
  mode: defaultMode,
  setMode: mode => console.log(mode),
});

// Export a helper function to easily use the Context
export const useTheme = () => React.useContext(ManageThemeContext);

// Create  the Provider
const ManageThemeProvider: FC = ({children}) => {
  const [themeState, setThemeState] = useState(defaultMode);

  const setMode = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  // Subscribe to OS mode changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({colorScheme}: {colorScheme: ThemeMode}) => {
        setThemeState(colorScheme);
      },
    );
    return () => subscription.remove();
  }, []);

  // Return a component which wraps its children in a styled-component ThemeProvider,
  // sets the status bar color, and injects the current mode and a function to change it
  return (
    <ManageThemeContext.Provider
      value={{mode: themeState as ThemeMode, setMode}}>
      <ThemeProvider
        theme={themeState === 'dark' ? darkTheme.theme : lightTheme.theme}>
        <>
          <StatusBar
            barStyle={themeState === 'dark' ? 'light-content' : 'dark-content'}
          />
          {children}
        </>
      </ThemeProvider>
    </ManageThemeContext.Provider>
  );
};

// This wrapper is needed to add the ability to subscribe to OS mode changes
const ManageThemeProviderWrapper: FC = ({children}) => (
  <AppearanceProvider>
    <ManageThemeProvider>{children}</ManageThemeProvider>
  </AppearanceProvider>
);

export default ManageThemeProviderWrapper;
```

## Example Usage
This is the example code behind the GIF at the top of this post. 

```
import React from 'react';
import {Theme} from './types';
import styled from 'styled-components/native';
import ThemeManager, { useTheme } from './contexts/ManageThemeContext';
import { Switch } from 'react-native';

const Home = () => {
  // Helper function => useContext(ManageThemeContext)
  const theme = useTheme();
  return (
    <Container>
      <Switch
        value={theme.mode === 'dark'}
        onValueChange={value => theme.setMode(value ? 'dark' : 'light')}
      />
    </Container>
  );
};

// Get the background color from the theme object
const Container = styled.View<Theme>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.background};
`;

// Wrap Home in the ThemeManager so it can access the current theme and
// the function to update it
const App = () => (
  <ThemeManager>
    <Home />
  </ThemeManager>
);

export default App;
```

# Conclusion
Adding a light and dark mode to your app is pretty simple and adds a cool dynamic. It is also the hot, new thing to do so get to it!

[Checkout This Project’s Code On Github](https://thefinnternet.com/react-native-dark-mode)