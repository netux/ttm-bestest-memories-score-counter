import { type MemoryCard, ScoreEffect, Emotion } from "./model";

let firstDayOfSchoolMemoryCard: MemoryCard,
	graduationDayMemoryCard: MemoryCard,
	stargazingMemoryCard: MemoryCard,
	daydreamingMemoryCard: MemoryCard;

export const MEMORY_CARDS: Set<MemoryCard> = new Set([
	{
		name: "Memory Loss",
		points: -3,
		emotionsNeeded: [Emotion.Anxiety, Emotion.Longing]
	},
	{
		name: "Loss of a Loved One",
		points: 0,
		emotionsNeeded: [Emotion.Sadness, Emotion.Anxiety, Emotion.Longing]
	},
	{
		name: "Emotional Music",
		points: 0,
		emotionsNeeded: [
			Emotion.Happiness,
			Emotion.Sadness,
			Emotion.Anxiety,
			Emotion.Longing
		]
	},
	{
		name: "Glitch in the System",
		points: 1,
		emotionsNeeded: []
	},
	{
		name: "Taste Aversion",
		points: 1,
		emotionsNeeded: [Emotion.Sadness, Emotion.Anxiety]
	},
	{
		name: "Hanging with Friends",
		points: 1,
		emotionsNeeded: [Emotion.Happiness, Emotion.Anxiety, Emotion.Longing]
	},
	{
		name: "Movies in the Dark",
		points: 1,
		emotionsNeeded: [
			Emotion.Happiness,
			Emotion.Sadness,
			Emotion.Anxiety,
			Emotion.Longing
		]
	},
	{
		name: "Memento",
		points: 1,
		emotionsNeeded: [Emotion.Happiness, Emotion.Longing]
	},
	{
		name: "Coming Home Late",
		points: 2,
		emotionsNeeded: [Emotion.Anxiety, Emotion.Longing]
	},
	{
		name: "Traveling the World",
		points: 2,
		emotionsNeeded: [Emotion.Happiness, Emotion.Anxiety, Emotion.Longing]
	},
	(stargazingMemoryCard = {
		name: "Stargazing",
		points: 2,
		emotionsNeeded: [Emotion.Happiness, Emotion.Sadness, Emotion.Longing]
	}),
	(daydreamingMemoryCard = {
		name: "Daydreaming",
		points: 2,
		emotionsNeeded: [Emotion.Happiness, Emotion.Sadness, Emotion.Longing]
	}),
	{
		name: "Heartfelt Goodbye",
		points: 2,
		emotionsNeeded: [Emotion.Sadness, Emotion.Longing]
	},
	(firstDayOfSchoolMemoryCard = {
		name: "First Day of School",
		points: 2,
		scoreEffect: ScoreEffect.DoubleGraduationDayMemory,
		emotionsNeeded: [
			Emotion.Happiness,
			Emotion.Sadness,
			Emotion.Anxiety,
			Emotion.Longing
		]
	}),
	(graduationDayMemoryCard = {
		name: "Graduation Day",
		points: 2,
		scoreEffect: ScoreEffect.DoubleFirstDayOfSchoolMemory,
		emotionsNeeded: [
			Emotion.Happiness,
			Emotion.Sadness,
			Emotion.Anxiety,
			Emotion.Longing
		]
	}),
	{
		name: "Magical Moment",
		points: 2,
		scoreEffect: ScoreEffect.StargazingAndDaydreamingBecomeSixPoints,
		emotionsNeeded: [Emotion.Happiness]
	},
	{
		name: "Hospital Visit",
		points: 2,
		emotionsNeeded: [Emotion.Happiness, Emotion.Sadness, Emotion.Anxiety]
	},
	{
		name: "Embarrassing Mistake",
		points: 2,
		emotionsNeeded: [Emotion.Anxiety]
	},
	{
		name: "Playing with Pets",
		points: 2,
		emotionsNeeded: [Emotion.Happiness, Emotion.Sadness, Emotion.Anxiety]
	},
	{
		name: "First Kiss",
		points: 3,
		emotionsNeeded: [Emotion.Happiness, Emotion.Anxiety]
	},
	{
		name: "Loging for the Sky",
		points: 3,
		emotionsNeeded: [Emotion.Longing]
	},
	{
		name: "Family Time",
		points: 3,
		emotionsNeeded: [
			Emotion.Happiness,
			Emotion.Sadness,
			Emotion.Anxiety,
			Emotion.Longing
		]
	},
	{
		name: 'Saying "I Do"',
		points: 3,
		emotionsNeeded: [Emotion.Happiness, Emotion.Anxiety, Emotion.Longing]
	},
	{
		name: "Public Performance",
		points: 3,
		emotionsNeeded: [Emotion.Happiness, Emotion.Anxiety, Emotion.Longing]
	},
	{
		name: "Unrequited Crush",
		points: 4,
		emotionsNeeded: [Emotion.Sadness, Emotion.Anxiety, Emotion.Longing]
	},
	{
		name: "A Terrible Accident",
		points: 4,
		emotionsNeeded: [Emotion.Sadness, Emotion.Longing]
	},
	{
		name: "Romantic Dance",
		points: 5,
		emotionsNeeded: [Emotion.Happiness, Emotion.Longing]
	},
	{
		name: "Ephemeral Childhood",
		points: 5,
		emotionsNeeded: [Emotion.Longing]
	},
	{
		name: "Enduring Regrets",
		points: 6,
		emotionsNeeded: [Emotion.Sadness]
	},
	{
		name: "Wish Granted",
		scoreEffect: ScoreEffect.DoubleAllNonHappinessMemories,
		emotionsNeeded: [Emotion.Happiness, Emotion.Sadness]
	},
	{
		name: "Unforgettable Nightmare",
		scoreEffect: ScoreEffect.CountAllEmotionsInHand,
		emotionsNeeded: [Emotion.Sadness, Emotion.Anxiety]
	},
	{
		name: "Growing Old Together",
		scoreEffect: ScoreEffect.CountAllEmotionsInHand,
		emotionsNeeded: [Emotion.Happiness, Emotion.Sadness]
	},
	{
		name: "Sparks of Inspiration",
		scoreEffect: ScoreEffect.CountAllMemories,
		emotionsNeeded: [Emotion.Happiness]
	},
	{
		name: "New Arrival",
		scoreEffect: ScoreEffect.CountAllMemories,
		emotionsNeeded: [Emotion.Happiness, Emotion.Anxiety]
	}
]);

export const FIRST_DAY_OF_SCHOOL_MEMORY_CARD = firstDayOfSchoolMemoryCard;
export const GRADUATION_DAY_MEMORY_CARD = graduationDayMemoryCard;
export const STARGAZING_MEMORY_CARD = stargazingMemoryCard;
export const DAYDREAMING_MEMORY_CARD = daydreamingMemoryCard;
