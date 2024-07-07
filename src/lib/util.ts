import { DAYDREAMING_MEMORY_CARD, FIRST_DAY_OF_SCHOOL_MEMORY_CARD, GRADUATION_DAY_MEMORY_CARD, STARGAZING_MEMORY_CARD } from './constants'
import { type Player, type MemoryCard, Emotion, ScoreEffect, UNCALCULABLE_SCORE_SYMBOL } from './model'

interface CalculateScoreOptions {
	promptEmotionsInHand: () => number | typeof UNCALCULABLE_SCORE_SYMBOL;
}

export function calculateScore(
	player: Player,
	{ promptEmotionsInHand }: CalculateScoreOptions
): number | typeof UNCALCULABLE_SCORE_SYMBOL {
	let score = 0;
	let emotionsInHand: number | typeof UNCALCULABLE_SCORE_SYMBOL | null = null;

	for (const playerMemoryCard of player.memories) {
		if (playerMemoryCard.points != null) {
			score += playerMemoryCard.points;
		}

		switch (playerMemoryCard.scoreEffect) {
			case ScoreEffect.DoubleAllNonHappinessMemories: {
				for (const playerOtherMemoryCard of player.memories) {
					if (
						playerOtherMemoryCard.points != null &&
						!playerOtherMemoryCard.emotionsNeeded.includes(Emotion.Happiness)
					) {
						score += playerOtherMemoryCard.points;
					}
				}
				break;
			}
			case ScoreEffect.DoubleFirstDayOfSchoolMemory: {
				const hasFirstDayOfSchoolMemory = player.memories.has(FIRST_DAY_OF_SCHOOL_MEMORY_CARD);
				if (hasFirstDayOfSchoolMemory) {
					score += FIRST_DAY_OF_SCHOOL_MEMORY_CARD.points!;
				}
				break;
			}
			case ScoreEffect.DoubleGraduationDayMemory: {
				const hasGraduationDayMemory = player.memories.has(GRADUATION_DAY_MEMORY_CARD);
				if (hasGraduationDayMemory) {
					score += GRADUATION_DAY_MEMORY_CARD.points!;
				}
				break;
			}
			case ScoreEffect.StargazingAndDaydreamingBecomeSixPoints: {
				const hasStargazingMemory = player.memories.has(STARGAZING_MEMORY_CARD);
				const hasDaydreamingMemory = player.memories.has(DAYDREAMING_MEMORY_CARD);
				if (hasStargazingMemory) {
					score += 6 - STARGAZING_MEMORY_CARD.points!;
				}
				if (hasDaydreamingMemory) {
					score += 6 - DAYDREAMING_MEMORY_CARD.points!;
				}
				break;
			}
			case ScoreEffect.CountAllEmotionsInHand: {
				emotionsInHand ??= promptEmotionsInHand();

				if (emotionsInHand === UNCALCULABLE_SCORE_SYMBOL) {
					return UNCALCULABLE_SCORE_SYMBOL;
				}

				score += emotionsInHand;
				break;
			}
			case ScoreEffect.CountAllMemories: {
				score += player.memories.size;
				break;
			}
		}
	}

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
