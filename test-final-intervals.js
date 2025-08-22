// Final test of the updated FSRS parameters
const {
  createEmptyCard,
  generatorParameters,
  fsrs,
  Rating,
  formatDate
} = require('ts-fsrs');

// Test the updated FSRS parameters
console.log('Testing final FSRS intervals...');

const params = generatorParameters({
  enable_fuzz: true,
  enable_short_term: true, // Enable short-term for shorter initial intervals like Anki
  maximum_interval: 365,
  request_retention: 0.85, // Balanced retention
  // Slightly modified weights for better Easy interval
  w: [0.35, 0.55, 2.2, 5.0, 4.5, 0.9, 0.8, 0.01, 1.35, 0.12, 0.9, 2.0, 0.045, 0.32, 1.2, 0.27, 2.4]
});

const f = fsrs(params);
const card = createEmptyCard();
const now = new Date();

console.log('Updated FSRS parameters:');
console.log('Enable short term:', params.enable_short_term);
console.log('Request retention:', params.request_retention);
console.log('Maximum interval:', params.maximum_interval);

console.log('\nNew card intervals:');
const scheduling_cards = f.repeat(card, now);

for (const item of scheduling_cards) {
  const grade = item.log.rating;
  const { card: scheduledCard } = item;
  const timeDiff = scheduledCard.due.getTime() - now.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  let timeString;
  if (minutesDiff < 1) timeString = '< 1m';
  else if (minutesDiff < 60) timeString = `${minutesDiff}m`;
  else if (hoursDiff < 24) timeString = `${hoursDiff}h`;
  else timeString = `${daysDiff}d`;

  console.log(`${Rating[grade]}: ${timeString} (due: ${formatDate(scheduledCard.due)})`);
}

console.log('\nTarget intervals (Anki-like):');
console.log('Again: <1m');
console.log('Hard: <6m');
console.log('Good: <10m');
console.log('Easy: 3d');
