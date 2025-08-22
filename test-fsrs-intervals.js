// Test script to check FSRS intervals
const {
  createEmptyCard,
  generatorParameters,
  fsrs,
  Rating,
  formatDate
} = require('ts-fsrs');

// Test FSRS intervals
console.log('Testing FSRS intervals...');

const now = new Date();

// Test different parameter configurations
console.log('=== Testing with enable_short_term: true ===');
const params1 = generatorParameters({
  enable_fuzz: true,
  enable_short_term: true,
  maximum_interval: 365,
});

const f1 = fsrs(params1);
const card1 = createEmptyCard();
const scheduling_cards1 = f1.repeat(card1, now);

for (const item of scheduling_cards1) {
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

  console.log(`${Rating[grade]}: ${timeString}`);
}

console.log('\n=== Testing with enable_short_term: false ===');
const params2 = generatorParameters({
  enable_fuzz: true,
  enable_short_term: false,
  maximum_interval: 365,
});

const f2 = fsrs(params2);
const card2 = createEmptyCard();
const scheduling_cards2 = f2.repeat(card2, now);

for (const item of scheduling_cards2) {
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

  console.log(`${Rating[grade]}: ${timeString}`);
}

console.log('\n=== Testing with custom parameters ===');
const params3 = generatorParameters({
  enable_fuzz: true,
  enable_short_term: true,
  maximum_interval: 365,
  request_retention: 0.9,
  w: [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61]
});

const f3 = fsrs(params3);
const card3 = createEmptyCard();
const scheduling_cards3 = f3.repeat(card3, now);

for (const item of scheduling_cards3) {
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

  console.log(`${Rating[grade]}: ${timeString}`);
}

console.log('Current FSRS parameters:');
console.log('Learning steps:', params.learning_steps);
console.log('Relearning steps:', params.relearning_steps);
console.log('Enable short term:', params.enable_short_term);

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
