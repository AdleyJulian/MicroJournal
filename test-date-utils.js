// Test script to verify date consistency
const { parseDateStringToUTC, formatDateToUTCString, getTodayUTCString } = require('./lib/dateUtils.ts');

console.log('Testing date utilities...');

// Test 1: Today's date should be consistent
const todayString = getTodayUTCString();
console.log('Today string:', todayString);

const todayDate = parseDateStringToUTC(todayString);
console.log('Today date:', todayDate);

const formattedBack = formatDateToUTCString(todayDate);
console.log('Formatted back:', formattedBack);

console.log('Consistency check:', todayString === formattedBack ? 'PASS' : 'FAIL');

// Test 2: Different timezone handling
const testDate = new Date('2024-01-15T12:00:00Z'); // UTC time
console.log('Test date (UTC):', testDate);

const formattedTest = formatDateToUTCString(testDate);
console.log('Formatted test date:', formattedTest);

const parsedTest = parseDateStringToUTC(formattedTest);
console.log('Parsed test date:', parsedTest);

console.log('Test date consistency:', testDate.toISOString().split('T')[0] === formattedTest ? 'PASS' : 'FAIL');

console.log('All tests completed!');
