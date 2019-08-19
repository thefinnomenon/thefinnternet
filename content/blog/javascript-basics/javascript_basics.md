---
title: JavaScript Basics
date: "2019-08-19"
description: A brief overview of some important JavaScript concepts.
---

# What is Javascript?
JavaScript is a high level, dynamically typed language that started off as a way to add functionality to an HTML page and now finds itself in just about everything from databases and servers on the backend to browsers, mobile devices, and even TV's on the frontend.

# Important Concepts
## Functions
In Javascript there are two ways to define a function,

```javascript
function foo(param) {
  doSomethingAmazing(param);
} 

foo("bar");
```

and (more succinctly) as an Arrow Function

```javascript
const foo = (param) => doSomethingAmazing(param);

// If only one param, you can drop the parenthesis
const foo = param => doSomethingAmazing(param);

foo("bar");
```

> Arrow functions inherit the this object from the context at the time of calling.

Functions can also have Default parameters which are overriden if arguments are passed in.

```javascript
function foo(param = 0) {
  ...
}

const foo = (param = 0) => ...
```

## Async
### Callbacks
The original way to make asynchronous calls in JavaScript (e.g. retrieving items from a database) is with callbacks. A callback is a function that you pass as a parameter (usually the last) to another function which calls the callback function upon completion.

```javascript
funcA(dataA => {
  funcB(dataB => {
    funcC(dataC => {
      ...
    })
  })
});
```

This nesting can get pretty insane, if you don't trust me just google "Callback Hell". To remedy this Promises were introduced to the language.

### Promises
Promises were added to JavaScript to eliminate the callback hell.

A promise has three possible states, pending, fulfilled, or rejected. When a promise is fulfilled it resolves (using resolve(val)) to a value and when it is rejected (using reject(val)) it returns a reason it did not resolve. When resolved, the promise triggers the then clause and when rejected, it triggers the catch clause.

```javascript
  new Promise((resolve, reject) => {
    // resolve('Resolved');
    // reject('Rejected');
  })
  .then(value => {
    console.log(value);
  })
  .catch(err => {
    console.log(err);
  });
```

It might sound a bit confusing but it should become clear after seeing a few examples.

```javascript
const wait = time => new Promise((resolve) => setTimeout(resolve, time));

wait(1000).then(() => console.log('Resolved!'));
```

Here is an example of using the Fetch API which returns a promise and asynchrounously handles an HTTP request. As you can see, you can chain promises together to form a chain. Often times, a `catch` is added at the end to capture any errors that occur in the chain.

```javascript
fetch(url)
  .then(response => {
    return response.json();
  })
  .then(myJson => {
    console.log(JSON.stringify(myJson));
  })
  .catch(err => {
  	throw new Error(err);
  }
```

### Async/Await
A newest and best approach is to use async/await.

Async functions enable you to write promise based code as if it were synchronous. An async function always returns a promise (A value returned that isn't a promise is automatically wrapped in a resolved promise with the original return value).

```javascript
async function foo() {
  return "Async!";
}

foo().then(value => console.log(value));
```

The await operator is used to wait for a Promise. It is important to note that this can only be used inside an Async function.

```javascript
async function foo() {
    let promise = new Promise((res, rej) => {
        setTimeout(() => res("Resolved"), 2000)
    });

    // wait here for promise to resolve...
    let result = await promise; 
  
    console.log(result); 
};

foo();
```

## Variables
Javascript variables come in three flavors

- var: function scoped
- let: block scoped
- const: block scoped and immutable (cannot be changed once set)

```javascript
function foo() {
	var a = "A";
	let b = "B";
	
	if(true) {
		console.log(a); // A
		console.log(b); // B
		
		var c = "C";
		// Scoped to the if block
		let d = "D";
	}
	
	console.log(c) // C
	console.log(d) // d is not defined here!
	
	const e = "E";
	e = "F" // Error! Cannot re-assign const
}
```

## Classes
Javascript classes are similar to their class counterpart in traditional object orientated languages.

```javascript
class Vehicle {
	// Class constructor (initialized with new Vehicle(...))
	constructor(model, make, year) {
		this.model = model;
		this.make = make;
		this.year = year;
	}
	
	// Getter
	get makeAndModel() {
		return `${make} ${model}`;
	}
	
	// Setter
	set year(year) {
		this.year = year;
	}
	
	// Class function
	getDescription() {
		return `A ${year} ${make} ${model}`;
	}
}

class CoolVehicle extends Vehicle {
	getDesciption() {
		return `A cool ${year} ${make} ${model}`;
	}
}
```

> In a class constructor you may see `super(...)` which is used to reference the parent class.

## Import/Export
Export a module or code using `export ...`

```javascript
export const foo = "Foo";
export function bar() { ... };
export default function defaultFunc() { ... };
const myConst = "hey";
export myConst as Hey;
```

Import a module or code using `import ... from ...`

```javascript
// Import all exports from module
import * from 'module'; 
// Import all exports from module addressable as myModule.foo
import * as myModule from 'module';
// Import default export
import foo from 'module';
// Import named exports
import { foo, bar } from 'module';
```

## Temporal Literals
```javascript
const firstName = "Michael";
const lastName = "Scott";
// Using temporal literals to create a string from the variables
const fullName = `${firstName} ${lastName}`; // Michael Scott
```

## Spread Operator
You can expand an array, object, or string using the spread operator `...`.

```javascript
const arr = ['a', 'b', 'c'];
const arr2 = [...arr, 'd']   // ['a', 'b', 'c', 'd']

const obj = { firstName: 'Michael', lastName: 'Scott' };
// firstName key overwrites spreaded one because it comes after it
const obj2 = { ...obj, firstName: 'Mikey' };  // Mikey Scott
```

## Destructuring Assignments
Destructure an array or object using a destructuring assignment.

```javascript
[a, b, ...rest] = [10, 20, 30, 40, 50];
console.log(a); // 10
console.log(b); // 20
console.log(rest); // [30, 40, 50]

{a, b, ...rest} = {a: 10, b: 20, c: 30, d: 40};
console.log(a); // 10
console.log(b); // 20
console.log(rest); // {c: 30, d: 40}
```

## Null vs Undefined
**null** is an empty or non-existent value and must be assigned.

```javascript
let foo = null;
console.log(foo); // null
```

**undefined** usually means a variable is declared but has not been defined.

```javascript
let foo;
console.log(foo); // undefined
```
