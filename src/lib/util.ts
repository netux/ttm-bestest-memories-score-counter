import { DAYDREAMING_MEMORY_CARD, FIRST_DAY_OF_SCHOOL_MEMORY_CARD, GRADUATION_DAY_MEMORY_CARD, STARGAZING_MEMORY_CARD } from './constants'
import { type Player, type MemoryCard, Emotion, ScoreEffect, UNCALCULABLE_SCORE_SYMBOL } from './model'

interface CalculateScoreOptions {
	promptEmotionsInHand: () => number | typeof UNCALCULABLE_SCORE_SYMBOL;
}

export function calculateScore(
	player: Player,
	{ promptEmotionsInHand }: CalculateScoreOptions
): number | typeof UNCALCULABLE_SCORE_SYMBOL {
	// SETUP:
	// Wrap each card into a CardCalculatedValue object and save them on a map of card name ↔ calculated value
	// Also keep track of all cards the player has with each score effect.

	interface CardCalculatedValue {
		card: MemoryCard;
		value: number | null;
	}

	const allCardValuesMap: Record<string, CardCalculatedValue> = {};
	const cardValueScoreEffectMap = {} as Record<ScoreEffect, CardCalculatedValue[]>;
	for (const memoryCard of player.memories) {
		const cardValue: CardCalculatedValue = {
			card: memoryCard,
			value: memoryCard.points ?? null
		};

		allCardValuesMap[memoryCard.name] = cardValue;

		if (memoryCard.scoreEffect) {
			cardValueScoreEffectMap[memoryCard.scoreEffect] ??= [];
			cardValueScoreEffectMap[memoryCard.scoreEffect].push(cardValue);
		}
	}

	// EXECUTE:
	// Handle cards' score effects: apply each effect in a specific order, affecting the calculated values of relevant cards.
	let emotionsInHand: number | typeof UNCALCULABLE_SCORE_SYMBOL | null = null;

	const effectApplyingOrder = [
		ScoreEffect.CountAllEmotionsInHand,
		ScoreEffect.CountAllMemories,
		ScoreEffect.StargazingAndDaydreamingBecomeSixPoints,
		ScoreEffect.DoubleFirstDayOfSchoolMemory,
		ScoreEffect.DoubleGraduationDayMemory,
		ScoreEffect.DoubleAllNonHappinessMemories
	];
	for (const scoreEffect of effectApplyingOrder) {
		const calculatedValuesOfCardsWithScoreEffect = cardValueScoreEffectMap[scoreEffect];

		if (!calculatedValuesOfCardsWithScoreEffect) {
			// player doesn't have a card with this score effect - ignore
			continue;
		}

		switch (scoreEffect) {
			// effects that set the calculated value on the card itself
			case ScoreEffect.CountAllEmotionsInHand: {
				emotionsInHand ??= promptEmotionsInHand();

				if (emotionsInHand === UNCALCULABLE_SCORE_SYMBOL) {
					return UNCALCULABLE_SCORE_SYMBOL;
				}

				for (const calculatedValues of calculatedValuesOfCardsWithScoreEffect) {
					calculatedValues.value = emotionsInHand;
				}

				break;
			}
			case ScoreEffect.CountAllMemories: {
				for (const memoryCard of calculatedValuesOfCardsWithScoreEffect) {
					memoryCard.value = player.memories.size;
				}

				break;
			}

			// effects that set the calculated value in other cards
			case ScoreEffect.StargazingAndDaydreamingBecomeSixPoints: {
				if (player.memories.has(STARGAZING_MEMORY_CARD)) {
					allCardValuesMap[STARGAZING_MEMORY_CARD.name].value = 6;
				}

				if (player.memories.has(DAYDREAMING_MEMORY_CARD)) {
					allCardValuesMap[DAYDREAMING_MEMORY_CARD.name].value = 6;
				}

				break;
			}
			case ScoreEffect.DoubleFirstDayOfSchoolMemory: {
				for (let _i = 0; _i < calculatedValuesOfCardsWithScoreEffect.length; _i++) { // as many times as cards with this score effect there are
					if (player.memories.has(FIRST_DAY_OF_SCHOOL_MEMORY_CARD)) {
						allCardValuesMap[FIRST_DAY_OF_SCHOOL_MEMORY_CARD.name].value! *= 2;
					}
				}

				break;
			}
			case ScoreEffect.DoubleGraduationDayMemory: {
				for (let _i = 0; _i < calculatedValuesOfCardsWithScoreEffect.length; _i++) { // as many times as cards with this score effect there are
					if (player.memories.has(GRADUATION_DAY_MEMORY_CARD)) {
						allCardValuesMap[GRADUATION_DAY_MEMORY_CARD.name].value! *= 2;
					}
				}

				break;
			}
			case ScoreEffect.DoubleAllNonHappinessMemories: {
				for (let _i = 0; _i < calculatedValuesOfCardsWithScoreEffect.length; _i++) { // as many times as cards with this score effect there are
					for (const otherCalculatedValues of Object.values(allCardValuesMap)) {
						if (
							otherCalculatedValues.value != null &&
							!otherCalculatedValues.card.emotionsNeeded.includes(Emotion.Happiness)
						) {
							otherCalculatedValues.value *= 2;
						}
					}
				}

				break;
			}
		}
	}

	// WRAP-UP:
	// Sum up all calculated values into a final score
	const score = Object.values(allCardValuesMap)
		.reduce((total, { value }) => {
			return total += value ?? 0;
		}, 0);
	return score;
}

export function cardFullName(card: MemoryCard) {
	return `[${card.points ?? card.scoreEffect ?? '-'}] ${card.name}`;
}

export function dumbLazyMatch(haystack: string, needle: string) {
	const atomizize = (s: string) =>
		s.toLocaleLowerCase().replace(/[^a-z]/g, '');
	return atomizize(haystack).includes(atomizize(needle));
}
