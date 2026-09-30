const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

console.log("Start");
await wait(5000); // Pauses for 1 second
console.log("Done");
