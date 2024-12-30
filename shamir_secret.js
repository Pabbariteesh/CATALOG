const fs = require('fs');

// Function to decode a value from a given base
const decodeValue = (value, base) => {
    return parseInt(value, base);
};

// Lagrange interpolation to find the constant term
const lagrangeInterpolation = (points) => {
    let constantTerm = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
        const xi = points[i].x;
        const yi = points[i].y;
        let liNumerator = 1;
        let liDenominator = 1;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                liNumerator *= 0 - points[j].x;
                liDenominator *= xi - points[j].x;
            }
        }

        constantTerm += (yi * liNumerator) / liDenominator;
    }

    return Math.round(constantTerm); // Round to nearest integer
};

// Main function to solve the problem
const solveShamirSecret = (filePath) => {
    // Read and parse the JSON input
    const input = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const { n, k } = input.keys;
    const points = [];

    // Decode all points
    for (const key in input) {
        if (key !== 'keys') {
            const x = parseInt(key);
            const base = parseInt(input[key].base);
            const value = input[key].value;
            const y = decodeValue(value, base);

            points.push({ x, y });
        }
    }

    // Sort points by x to ensure order
    points.sort((a, b) => a.x - b.x);

    // Use the first k points to find the polynomial constant
    const selectedPoints = points.slice(0, k);
    const constantTerm = lagrangeInterpolation(selectedPoints);

    return constantTerm;
};

// Test the solution
const testCase1Output = solveShamirSecret('testcase1.json');
const testCase2Output = solveShamirSecret('testcase2.json');

console.log('Test Case 1 Output:', testCase1Output); // Expected: 3
console.log('Test Case 2 Output:', testCase2Output); // Expected: 987654321
