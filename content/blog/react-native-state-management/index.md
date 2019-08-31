---
title: React-Native State Management
date: "2019-08-31"
description: How to manage state in your React-Native app.
---
As your application grows, as does its complexity. Sharing state between components quickly becomes convoluted if you don't use an appropriate state management solution. There are an endless amount of libraries, patterns, and solutions that have popped up over the years to address state management in React and this post will cover the most popular four; Component State, Context API, and Redux.

# Component State
For simple apps Component state is a great solution. 

For class based components this means using `setState`.

```javascript
class Counter extends Component {
  state = { count: 0 }

  render() {
    return (
      <View>
        <Text>{this.state.count}</Text>
        <Button
          onPress={() => this.setState({ count: this.state.count + 1 })}
          title="+"
        />
        <Button
          onPress={() => this.setState({ count: this.state.count - 1 })}
          title="-"
        />
      </View>
    )
  }
}
```

For functional components, use `useState`.

```javascript
const Counter = props => {
  const [count, setCount] = useState(0)

  return (
    <View>
      <Text>{count}</Text>
      <Button onPress={() => setCount(count + 1)} title="+" />
      <Button onPress={() => setCount(count - 1)} title="-" />
    </View>
  )
}
```

> For more complex local state management in a functional component, you can use `useReducer()` which makes it easier to handle a lot of changing state in a predicatable way.

## Pros
- Simple for encapsulated state
- Native React solution

## Cons
- Sharing state between components can be complicated
- Not well suited for a complex app

# Context API
The Context API helps remedy the issue of "prop drilling", passing props down through multiple levels of components to get it to where it is needed. Using the Context API, you can share values between components without having to pass props. It is recommended by the React team to use it to “share data that can be considered “global” for a tree of React components, such as the current authenticated user, theme, or preferred language”.

Using the Context API consists of three parts,

- Call `React.createContext(OptionalInitialValue)` to create a context. It returns an object with a `Provider` and a `Consumer`.
- Use the `<Provider value={anything}>` component higher up in the tree to wrap any component trees that you want to have access to `value`.
- Use the `<Consumer>` component anywhere below the `Provider` in the tree to give a component access to the value prop in the `Provider`. There are two ways to use the `Consumer`, "render props" style or with a hook.

```javascript
// Initialize a Context
const MyContext = React.createContext({name: ''});

const MyComponent = () => (
	// Wrap a part of the component tree in the Provider
	<MyContext.Provider value={{name: 'Alice'}}>
		<MySubComponent />
		<MyOtherSubComponent />
	</MyContext.Provider>
);

const MySubComponent = () => (
	// Wrap a component in the Consumer to access the value prop "render props" style
	<MyContext.Consumer>
		{ value => (
			<Text>{value.name}</Text>
		)}
	</MyContext.Consumer>
);

const MyOtherSubComponent = () => {
	// Use the useContext hook to get the value
	const value = useContext(MyContext);
	
	return <Text>{value.name}</Text>;
};
```
>A component calling useContext will always re-render when the context value changes. If re-rendering the component is expensive, you can optimize it by using memoization.

## Pros
- Great for when you have a few pieces of global state you want to make available to a lot of components (e.g. themes, internationalization, user info).
- No prop drilling
- Native React solution
- Easy implementation, simply wrapping components in a Provider and Consumer component.

## Cons
- Not the best choice when you have a lot of global state and would end up with a lot of Contexts to wrap your app in.
- The "render props" style of Consumer can introduce too much nesting and descrease readability.
- May need to consider unnecessary re-renders when using useContext and the context value changes.

# Redux
Redux is probably the most popular of all the third party state management solutions. Although it gets a bad wrap as being complicated for beginners and overused (this is true in some cases), Redux is actually rather simple and definitely has its use in a bigger app. Inspired by Flux and Elm, Redux uses the concept of uni-directional data flow.

- The app has a central state
- A state change triggers UI updates
- Special functions handle state change
- User interaction triggers these special state changing functions
- Only one change happens at a time

![Redux Architecture](./redux_flow.png "Redux Architecture")

## Important Pieces
### Root store
The single source of truth for the application.

```javascript
import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(reducer);
```

### Actions
Plain JavaScript objects that describe an action in your application. Usually has a type and a payload.

```javascript
const action = {
	type: 'LOGIN',
	payload: { email: scott@dunder.com, password: 'thatswhatshesaid' },
}
```

It is good practice to make a file of all your action types since they will have to be used in multiple places in your application & you don't want to risk mispelling them. Another good practice is to create action creators which you then import into your component and use.

```javascript
// ./actions.js

// Action type
export const LOGIN = 'LOGIN';

// Action creator
export const login = (email, password) => {
	return { type: LOGIN, payload: { email, password} };
}
```

```javascript
import { login } from './actions';

<Button onPress(() => dispatch(login(email,password)))>
	Login
</Button>
```

### Reducers
Pure functions which take in the current state and an action, and return the new state. In order to keep the size of reducers manageable, you can split them into separate files.

```javascript
import { LOGIN } from '../constants/actionTypes';

const initialState = {
  user: ''
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
  	case LOGIN:
   		return { ...state, user: action.payload };
   	default:
   		return state;
  }
};

export default rootReducer;
```

> The line `{ ...state, user: action.payload }` is important to understand. It is creating a **brand new state** object with the whole old state, overwritten with the new user value. This adheres to the Redux principle of not modifying the state.

### dispatch(action)
Dispatch is a Redux store function that is used for dispatching an action to the store.

```javascript
// Dispatch an action object
dispatch({ type: INCREMENT, payload: 1 });

// Dispatch an action creator
dispatch(increment)
```

### mapStateToProps(state, ownProps?)
This function is defined in a component that wants to access Redux state and is used to select the part of the state from the store that the component needs.

```javascript
function mapStateToProps(state) {
  return {
    count: state.count
  };
}
```

> Optionally takes a second argument called ownProps which holds the props for the component.

### mapDispatchToProps
This is an optional function that you can define for a component that wants to use the Redux store and it is used to create functions that dispatch when called and pass those functions as props to the component.

> By default, a connected component has the `dispatch` function as a prop.

There are a few ways to define this mapping but the simplest is to use define it as an object.

```javascript
// Import the action creators
import { increment, decrement, reset } from './actions';

const mapDispatchToProps = {
	increment,
	decrement,
	reset
};
```

### connect(mapStateToProps, mapDispatchToProps?, mergeProps?, options?)(Component)
This function wraps your Component and connects it to the Redux store.

```javascript
// Export and use this for your Component instead of normal Component export
export default connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
```
> mergeProps and options are not commonly used.

### useSelector()
The `useSelector` hook allows you to extract state from the Redux store. This function essentially replaces `mapStateToProps` for functional components.

```javascript
export const Counter= () => {
  const count = useSelector(state => state.count);
  
  return <Text>{count}</Text>;
}
```

### useDispatch()
The `useDispatch` hook returns a reference to the `dispatch` function from the Redux store. This hook replaces the need to use `connect` to inject `dispatch`.

```javascript
export const Counter= () => {
  const dispatch = useDispatch();
  
  return (
  	<Button onPress=(() => dispatch(increment))>
  		Increment
  	</Button>
  );
}
```

## Main Principles
### Single Source of Truth
The state of your whole application is stored in one object within a single store. This makes your state easier to work with, the application easier to reason about, and debugging less painful.

### Read Only State
State cannot be modified directly, only through emitting an action describing the change. This means that Views do not directly modify state. Instead, user interactions in Views can dispatch an action that tells a function to update the state. This function **replaces** the old state with the updated state and the UI updates accordingly.

### Reducers are Pure Functions
Reducers are simple and special functions, taking current state and an action, and returning a new, updated state.

>**The state is replaced not mutated**

Reducers are also pure functions, meaning they always return the same output for the same set of inputs.

```javascript
// Impure
const impure = function(n) {
  return Math.random() * n;
}

impure(3)	// 1.2
impure(3)	// 1.8
impure(3)	// 0.9

// Pure
const pure = function(a) {
  return 1 + a;
}

pure(3)	// 4
pure(3)	// 4
pure(3)	// 4
```

As you can see, the first function is impure, if you were to input the same value for `n` multiple times, you would get varying results do to the `Math.random()`. The second function on the other hand, is pure since it will always be the input + 1.

## Using Redux
`yarn add redux react-redux`

Under the hood, Redux utilizes the Context API covered earlier, so it requires wrapping your application in a `Provider` and passing in the `root store`.

```javascript
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer)

const App = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
```
Then, there are two ways to access the state from the store.

```javascript
import { connect } from 'react-redux';
import { increment } from '../actions';

class Counter extends Component {
  increment = () => {
  	 // Dispatch increment action
    this.props.increment();
  }

  render() {
    return (
      <View>
	      // Access count variable that is available from props
	      <Text>{this.props.count}</Text>
	      <Button onPress={this.increment}>+</Button>
      </View>
    )
  }
}

// This function is used to pullout the state needed by this
// component and mapping it to the component's props
// (e.g. count -> this.props.count)
function mapStateToProps(state) {
  return {
    count: state.count
  };
}

// An object of action creators to add to the props
const mapDispatchToProps = {
	increment,
};

// Wrapping your component in connect puts the results of
// mapStateToProps, mapDispatchToProps and the dispatch 
// function into the components props
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

The newer way utilizes hooks so it can only be done in functional components.

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../actions';

const App = props => {
	// Get counter from the state store
	const counter = useSelector(state => state.counter);
	// Get the dispatch function
	const dispatch = useDispatch();

  return (
    <View>
        { counter }
        <Button onPress={ () => dispatch(increment) }>
        	increase
        </Button>
    </View>
  );
}
```

## Pros
- Methodical and well structured state management
- Easily testable/
- Enables hot reloading
- Powerful debugging; Time travel debugging

## Cons
- Slight learning curve
- Lots of boilerplate code
- Requires middleware to better handle advanced cases like async

# Conclusion
It may seem like a daunting task to choose how to manage your state in your application but I suggest you start with local state and switch some of it to Context API as you find it is required in multiple places. If you find yourself with too many Contexts then you should consider moving **just** your global state over to Redux.