export const UNCALCULABLE_SCORE_SYMBOL = Symbol("?");

export enum Emotion {
	Happiness = "Happiness",
	Sadness = "Sadness",
	Anxiety = "Anxiety",
	Longing = "Longing"
}

export enum ScoreEffect {
	DoubleAllNonHappinessMemories = "Double all memories that don't require happiness",
	DoubleGraduationDayMemory = "Double value of Graduation Day",
	DoubleFirstDayOfSchoolMemory = "Double value of First Day of School",
	StargazingAndDaydreamingBecomeSixPoints = "Make Stargazing and Daydreaming worth 6 points each",
	CountAllEmotionsInHand = "Count all emotions in hand",
	CountAllMemories = "Count all memories"
}

export interface MemoryCard {
	name: string;
	points?: number;
	scoreEffect?: ScoreEffect;
	emotionsNeeded: Emotion[];
}

export interface Player {
	name: string;
	memories: Set<MemoryCard>;
	numberOfEmotionsInHand: number | null;
	cardFilter: string;
	score: number | typeof UNCALCULABLE_SCORE_SYMBOL | null;
}
