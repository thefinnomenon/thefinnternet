---
title: React-Native Linting & Testing
date: "2019-11-13"
description: Most people say testing isn't sexy but wait till you see these snapshot tests 😉.
---

# Intro
Okay bear with me on this one. It ended up being longer than I expected but I promise it will be worth it! Testing may not be the most sexy topic but having a good testing setup is key for worry free (or at least minimal worrying) development. The following setup may look like a lot of steps but its pretty quick and once you do it once (or twice if you setup a CI) you are good to go. All that's left is to write the actual tests 🤢.

# Initialize Project
```
npx react-native init lintingAndTesting --template react-native-template-typescript
cd lintingAndTesting
```

Launch emulators

```
react-native run-android
react-native run-ios
```

Setup git

```
git init
git add -A
git commit -m "fresh react-native init"
```

# Linting
## Install Dependencies
```
yarn add --dev @typescript-eslint/eslint-plugin @typescript-eslint/parser cross-env husky lint-staged eslint prettier eslint-config-prettier eslint-plugin-import eslint-plugin-jest eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-native eslint-plugin-detox
```

> This covers most of the default use cases but if you are using other libraries such as styled-components, you should look to see what linting tools there are for those.

## ESLint Config
[ESLint](https://eslint.org/) is a static analysis tool that checks your code for specific programming patterns; usually best practices for a language or tool.
 
### Delete the Current Config
Delete `.eslintrc.js`

### Add New Eslint Config
I prefer to keep my configs in package.json so I can try to reduce the number of files in the directory but you can keep it as it's own config file if you want.

```json
// package.json

{
  ...
  "eslintConfig": {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      }
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier/@typescript-eslint",
      "prettier/react",
      "plugin:react/recommended",
      "plugin:react-native/all",
      "plugin:jsx-a11y/strict",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript",
      "plugin:jest/recommended",
      "@react-native-community"
    ],
    "plugins": [
      "react-hooks",
      "detox"
    ],
    "rules": {
      "react/jsx-filename-extension": [
        1,
        {
          "extensions": [
            ".js",
            ".jsx",
            ".ts",
            ".tsx"
          ]
        }
      ],
      "react/jsx-fragments": [
        1,
        "syntax"
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    },
    "env": {
      "jest": true,
      "detox/detox": true,
      "react-native/react-native": true
    },
    "settings": {
      "react": {
        "version": "detect"
      }
    }
  },
  ...
}
```
> Start with this basic setup & disable rules that you don't want as you encounter them.

## Prettier Config
[Prettier](https://prettier.io/) is a code formatter that keeps your code formatted according to a specific configuration.

### Delete the Current Config
Delete `.prettierrc.js`

### Add New Prettier Config
I prefer to keep my configs in package.json so I can try to reduce the number of files in the directory but you can keep it as it's own config file if you want.

```json
// package.json

{
  ...
  "prettier": {
    "bracketSpacing": true,
    "jsxBracketSameLine": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "all"
  },
  ...
}
```
> This is the prettier config I use but you can customize it as you see fit.

# Testing
## Code Coverage
You can have jest compile a code coverage report which will give you an estimate of how well your tests cover your application and what spots you could use more focus in.

```
// package.json

{
  "scripts": {
    ...
    "test": "jest --coverage",
    ...
  }
}
```

## Snapshot Testing
Snapshot testing is a super easy way to test that your components don't accidently visually change. The idea is that you run the snapshot test & on first run, it will create a snapshot, a JSON file that represents the component's elements, and on subsequent runs it will ensure that the component matches the snapshot. If not, it will fail. If this was an intended change than you simply update the snapshot to match the new output.

```javascript
// __tests__/App.tsx

it('renders correctly', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

```
yarn test

# If you want to update a failing snapshot
# yarn test -u
```

## Detox
[Detox](https://github.com/wix/Detox) is a tool from Wix that allows you to easily write end to end tests for your application.

### Install iOS simulator utilities

```
brew tap wix/brew
brew install applesimutils
```

### Install the Detox cli

```
npm install -g detox-cli
```

### Add Detox to your project

```
yarn add --dev detox
```

### Android Setup
```
// android/settings.gradle

...

include ':detox'
project(':detox').projectDir = new File(rootProject.projectDir, '../node_modules/detox/android/detox')
```

```
// android/build.grade

buildscript {
	ext {
   		...
      	minSdkVersion = 18
      	...
      	kotlinVersion = '1.3.10'
   }
   ...
   dependencies {
   		...
      	classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion"
   }
}
```

```
// android/app/build.gradle

dependencies {
  ...
  implementation "androidx.annotation:annotation:1.1.0"
  androidTestImplementation 'androidx.annotation:annotation:1.0.0'
  androidTestImplementation(project(path: ":detox"))
  androidTestImplementation 'junit:junit:4.12'
}
```

```
// android/app/build.gradle

android {
  ...
  
  defaultConfig {
      ...
      testBuildType System.getProperty('testBuildType', 'debug')  // This will later be used to control the test apk build type
      testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'
  }
}

```

### Add Detox config to package.json
```
// package.json

{
  ...
  "detox": {
    "configurations": {
      "ios.sim.debug": {
        "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/<APP_NAME>.app",
        "build": "xcodebuild -workspace ios/<APP_NAME>.xcworkspace -scheme <APP_NAME> -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
        "type": "ios.simulator",
        "device": {
          "type": "iPhone 11 Pro"
        }
      },
      "ios.sim.release": {
        "binaryPath": "ios/build/Build/Products/Release-iphonesimulator/<APP_NAME>.app",
        "build": "export RCT_NO_LAUNCH_PACKAGER=true && xcodebuild -workspace ios/<APP_NAME>.xcworkspace -UseNewBuildSystem=NO -scheme APP_NAME -configuration Release -sdk iphonesimulator -derivedDataPath ios/build -quiet",
        "type": "ios.simulator",
        "device": {
          "type": "iPhone 11 Pro"
        }
      },
      "android.emu.debug": {
        "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
        "build": "cd android ; ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug ; cd -",
        "type": "android.emulator",
        "device": {
          "avdName": "Pixel_3_API_29"
        }
      },
      "android.emu.release": {
        "binaryPath": "android/app/build/outputs/apk/release/app-release.apk",
        "build": "cd android ; ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release ; cd -",
        "type": "android.emulator",
        "device": {
          "avdName": "Pixel_3_API_29"
        }
      }
    }
  },
  ...
}
```

### Initialize for Jest
```
yarn run detox init -r jest
```

### Add Scripts
```
// package.json

{
  "scripts": {
    ...
    "e2e:ios-debug": "detox build --configuration ios.sim.debug && detox test --configuration ios.sim.debug",
    "e2e:ios-release": "detox build --configuration ios.sim.release && detox test --configuration ios.sim.release",
    "e2e:android-debug": "detox build --configuration android.emu.debug && detox test --configuration android.emu.debug -l verbose",
    "e2e:android-release": "detox build --configuration android.emu.release && detox test --configuration android.emu.release -l verbose"
    ...
  }
}
```

### Add a testID
Add a testID to the "Learn More" Text element.

```
// App.tsx

<Text style={styles.sectionTitle} testID="learnMore">
	Learn More
</Text>
```

### Update Test
Write a test to make sure we can find our Text element.

```javascript
// e2e/firstTest.spec.js

describe('App', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show the learn more message', async () => {
    await expect(element(by.id('learnMore'))).toBeVisible();
  });
});
```

### Modify Jest
E2E tests can take a while so you should set jest to ignore them by default.

```
// package.json

"jest": {
    ...
    "testPathIgnorePatterns": [
      "<rootDir>/e2e"
    ],
    ...
}
```

### Run End to End Tests
```
yarn e2e:ios-debug
# yarn e2e:android-debug
```
> There is currently an issue with Detox not connecting to the Android emulator so the Android tests won't work. Some people have had luck by lowering the target sdk but for now it is an open issue and I will edit this post when I find a solution.

# Git Hook
To ensure all your committed code is tested and formatted properly, we use husky and lint-staged to check everything pre-commit.

```json
// package.json

{
  "scripts": {
    	...
    	"ts-compile-check": "tsc -p tsconfig.json --noEmit"
  	},
	...
	"husky": {
   		"hooks": {
      		"pre-commit": "yarn audit && yarn run ts-compile-check && lint-staged"
    	}
  	},
 	"lint-staged": {
    	"*.{js,jsx,ts,tsx}": [
      		"eslint --fix",
      		"prettier --fix",
      		"cross-env NODE_ENV=test jest --bail --findRelatedTests",
      		"git add"
    	]
  	}
  	...
}
```
> You could also trigger your E2E tests with this hook but I think it is better to manually trigger them at certain points or, ideally, have your CI run them on every push.

# Conclusion
With this setup, you have a solid testing foundation to build your app off of. Your linters will enforce best coding practices and consistent formatting. Jest and react-test-renderer for unit and integration testing. Last but not least, you can write simple end to end tests with Detox. As you add libraries and your app complexities go you will most likely have to start mocking some functionality here and there as well as striving to keep a high code coverage. 

This setup works great for your local development but if your team grows beyond just yourself or you want to offload the more intense tests (like the end to end ones), a good improvement would be setting the same thing up in a CI that is triggered on every push to your git repository. 

[Checkout This Project’s Code On Github](https://github.com/thefinnomenon/react-native-testing)