// a null function (placeholder) similar to "const name = ''""; or "const age = 0" or "const person = {};""
export const noOp = val => val;

/**
 * CURRY: Builds a curried function
 * @param {function} fn a function to curry
 * @param {any} args arguments for the function
 * @returns {any} If all arguments to the original function are provided, it will
 * return the result of running the original function, otherwise it will return a
 * function that is waiting to be called with the missing arguments.
 * @example
 * 
 * const add_2_numbers = curry((first, second) => first + second);
 *
 * const add_5_to_a_number = add_2_numbers(5)
 *
 * console.log(add_5_to_a_number(10))
 */
export const curry = (fn, ...args) =>
    fn.length <= args.length ? fn(...args) : (...more) => curry(fn, ...args, ...more);

// COMPOSE: Builds a composite function which executes the provided functions in 'right-to-left' order
export const compose = (...functions_to_compose) => {
    if (functions_to_compose.length === 0) return noOp;
    if (functions_to_compose.length === 1) return functions_to_compose[0];

    return functions_to_compose.reduce((a, b) => (...args) => a(b(...args)));
};

// PIPE: Builds a composite function which executes provided functions in 'left-to-right' order
export const pipe = (...functions_to_compose) => compose(...functions_to_compose.reverse());

// TAP: Perform an action against a `target` returning the target once the action has been performed,
// can be used in pipelines when target is deferred
export const tap = curry((visitor, target) => {
    visitor(target);
    return target;
});

// INSPECT: Useful for inspecting values as they are going through a pipeline
const create_message_builder = title => val => {
    console.log(`***INSPECT: ${title}`);
    console.log(val);
};

export const inspect = curry((title, val) => tap(create_message_builder(title), val));

// IIF: Runs callback functions automatically depending on a condition

export const iif = curry(({ trueFunc, falseFunc }, condition) => (condition ? trueFunc : falseFunc));

// let bankAccount = 5000;
// let vacationTime = 14;
// const dailyBurn = 600;
// const tripLength = 10;

// const goToMexico = ((bankAccount > (dailyBurn * tripLength)) && (vacationTime > tripLength)) ? true : false;

// const arrangeTrip = (tripLength, dailyBurn) => {
//   console.log(`I'm going to Mexico for ${tripLength} days!`);
//   bankAccount -= (tripLength * dailyBurn);
//   vacationTime -= tripLength;
// };

// const stayHome = (tripLength, dailyBurn) => {
//   console.log(`I'm not going to Mexico for ${tripLength} days. I will save ${tripLength * dailyBurn} dollars!`);
// };

// const mexicoTrip = iif({ trueFunc: arrangeTrip, falseFunc: stayHome });

// const result = mexicoTrip(goToMexico);

// result(tripLength, dailyBurn);

// console.log("Bank balance: ",bankAccount)
// console.log("Vacation time: ",vacationTime)