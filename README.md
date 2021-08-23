# RestTest
This repository has been created to solve the problem listed in https://resttest.bench.co

## How to Run

- Make sure that your system runs the latest version of node.js
- Run `npm start` to launch the program
- Run `npm test` to run the tests

> Note: The commands must be run from root directory

## Assumptions
It wasn't clear in the instructions how different error scenarios should be handled. To mitigate this, the following assumptions have been made:
- The API does not contain corrupt data
- The API is responsible for setting the correct upper limit for amounts

## Limitations and Trade-offs
- There isn't official support for older node versions since it hasn't been tested
- An additional API call is made at the start to fetch total transaction count. This call has been kept for readability purposes since it makes it easier to understand the code
