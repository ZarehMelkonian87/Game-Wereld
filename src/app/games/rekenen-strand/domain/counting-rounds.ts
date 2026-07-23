export interface CountingRound {
  amount: number;
  choices: readonly number[];
  skillIds: readonly string[];
  taskId: string;
}

export const countingRounds: readonly CountingRound[] = [
  { amount: 1, choices: [1, 2, 3], skillIds: ["number-quantity-1-5"], taskId: "tel-1" },
  { amount: 3, choices: [2, 3, 4], skillIds: ["number-quantity-1-5"], taskId: "tel-3" },
  { amount: 2, choices: [1, 2, 4], skillIds: ["number-quantity-1-5"], taskId: "tel-2" },
  { amount: 5, choices: [3, 4, 5], skillIds: ["number-quantity-1-5"], taskId: "tel-5" },
  { amount: 4, choices: [2, 4, 5], skillIds: ["number-quantity-1-5"], taskId: "tel-4" },
];

export const isCorrectCountingAnswer = (round: CountingRound, answer: number) =>
  round.amount === answer;
