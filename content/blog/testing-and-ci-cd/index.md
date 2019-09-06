---
title: Testing & CI/CD in JavaScript Projects
date: "2019-09-6"
description: JavaScript testing best practices.
---
> “If you don’t like unit testing your product, most likely your customers won’t like to test it either.” - Anonymous

Few developers get excited over the idea of writing tests for their code. Especially with pressure to finish new features as fast as possible, it is an annoyance to write test code that doesn't directly contribute to the progress of the project. This may seem fine at first when the project is small and you can test the few features manually to make sure everything looks fine but as the project grows, this manual checking is not only horribly inefficient and low quality but basically impossible. 

Investing in testing upfront is one of the best investments you can make on your project. It is what allows you to write a feature, not touch it for weeks, come back, see it is passing all its tests, and have a level of confidence that everything is good in the world. This post will cover some important testing concepts and how to apply them to your JavaScript projects.

# Testing Basics
## Principles
Tests should,

- be simple, short, and easy to understand. A good test is basically as good as documenation when it comes to understanding how to use a library or codebase.
- describe what is being tested, under what scenario, and what the expected result is.
- follow AAA pattern.
  - Arrange: Code needed to setup the scenario the test is aiming to test.
  - Act: Invoke the code you are testing.
  - Assert: Check if the received result matches the expected results.
- use **declarative** assertions as opposed to imperative assertions.
- focus on behavioral tests, meaning tests that verify the behavior as opposed to specific implementation. This essentially boils down to only testing public methods and not the private methods they may use.
- favor stubs and spies over mocks. Mocks focus on the internals of a service and therefore are tightly coupled with the implementation. Spies and stubs on the otherhand focus on monitoring the service use rather than how it is implemented.
- improve input testing using a library like [faker](https://github.com/Marak/Faker.js) which generates random names, phone numbers, etc. and/or a Property-based testing library like [fast-check](https://github.com/dubzzz/fast-check) which generates a huge number of inputs based on the input properties you define.
- Avoid global seeds and text fixtures, instead opting to add needed data on a per-test basis so they stay independent.
- expect errors instead of trying to try/catch them (e.g. expect(foo).to.throw(MyError)).
- be tagged in order to allow things like fast tests to be run on save and slower tests to be run on bigger events like before a push.
- aim for a code coverage of ~80%.
- use a mutation testing library like [Stryker](https://stryker-mutator.io/stryker/) to confirm that the tests that the code coverage report is reporting on are actually effective.
- use test linters like [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest).


# Types
![Test Trophy](./testing-trophy.jpg "Test Trophy")

## Static
Static tests run as you type your code. 

These include,

- Linters
- Type systems
- Vulnerable dependency scanner
- Code complexity analysis
- License checks
- Plagiarism checks

## Unit
A unit test is a test that verifies the behavior of a small unit of code **independent** of the rest of the code. These tests are not about finding bugs but rather about ensuring a small section of code works as expected and continues to even as refactoring (restructuring of code but not functionality) may occur.

These are short, fast, super specific error area, quick to write, and cheap but offer minimal actual overall testing confidence per test and require a lot of them to have good coverage.

## Principles

### F.I.R.S.T.

- **Fast**: A project can have thousands of unit tests so they need to be fast.
- **Independent**: The test must test a section of code independent from the rest of the project.
- **Repeatable**: Each test should yield the same results every time as long as the code being tested hasn't changed. This means it cannot depend on specific elements that may change like the date/time, system run on, or any renadom function output.
- **Self-Validating**: Does not require any manual inspection to determine if the test passed or failed.
- **Thorough**: Should cover every use case scenario, including corner/edge cases, exceptions/errors, bad inputs, etc.

```javascript
// What is being tested
describe('MathJS', () => {
	// Scenario
    describe('Addition (add)', () => {
    	// Expected result
    	test('should add 3 and 4 to get 7', () => {
    		// Arrange
    		const spy = jest.spyOn(mathjs, 'add');
    		
    		// Act
    		const result = mathjs.add(3,4);
    		
    		// Assert
  			expect(result).toBe(7);
    	});
    });
});
```

## Integration
Integration tests verify that several units work properly together. It used to be popular to write a lot of unit tests but the trend seems to be moving to less unit tests and more integration tests since one integration test can test functionality that would take several unit tests to test. Obviously it is sacrificing the ability to have a fine grained knowledge of where a bug is when a test fails but it is important to find a balance between saving time and the amount of specificity you have.

These are usually 4-5x the size of a unit test, still pretty fast, decently small error area, a little more involved to write, not as cheap as unit tests but still reasonable, and offer decent actual overall testing confidence per test and don't require as many tests to have good coverage.

## End to End
End to End tests verify complete user flows by simulating actions as a user would actually do them.

These are large, slow, huge error area, very intensive to write, and expensive to run, but offer very high confidence and don't require many of them.

# Test Driven Development (TDD)
> “More than the act of testing, the act of designing tests is one of the best bug preventers known. The thinking that must be done to create a useful test can discover and eliminate bugs before they are coded.” – Boris Beizer

This software development methodology aims to write more reliable and well designed software by writing failing tests first and then writing code that makes the tests pass. By focusing on only writing the code that is necessary to satisy your tests, your code should stay short and clean. TDD centers around 4 main cycles.

## The Three Laws
1. You must write a failing test before you write any production code.
2. You must not write more of a test than is sufficient to fail, or fail to compile.
3. You must not write more production code than is sufficient to make the currently failing test pass.

These laws are applied second-by-second in TDD.

## Red/Green/Refactor 
1. Create a unit tests that fails
2. Write production code that makes that test pass.
3. Clean up the mess you just made.

These steps are followed minute-by-minute in TDD.

## Specific/Generic
>As the tests get more specific, the code gets more generic.

Every few minutes, you should ensure that the production code you are writing is generic and not specific to your tests. If you find it is becoming specific to your tests, you have to go back and make the code more generic.

## Boundaries
Every hour, you should stop and check to see if you have reached or crossed a significant architectural boundary in your application. This gives you a chance to look at the program at a higher level and plan out where you want to draw the boundaries and appropriately focus your next hour of TDD cycles.

# CI/CD

## Continuous Integration (CI)
Continuous intregation is the software development practice of frequently pushing small changes to your code repository. For every push, automatic formatting and testing should be done. This gives the developer a quick feedback cycle for determining potential conflicts in commits while also allowing to frequently merge new updates to an application.

## Continuous Deployment (CD)
Also called continuous delivery, continuous deployment works in conjunction with CI to take the tested and built application that results from the CI process and deploy (or deliver) it to the intended infrastructure. With CD, teams can push new code to production every day or even hourly.

# Conclusion
Testing is a complex and important concept in the software world that is too often thrown to the side but with newer practices like CI/CD, having solid tests is more crucial than ever. There is no golden rule for how to write perfect tests but using TDD and trying to get ~80% coverage with a combination of unit, integration, and end to end tests should lead to clean, confident code. It takes some time to setup at first but the confidence that automated testing gives you in the end is priceless. Give the concepts from this post a try and I hope it helps relieve some of the stress that developers can feel when programming.
