<!-- TODO(netux): split this into multiple files 🙃 -->

<script lang="ts">
	import { MEMORY_CARDS } from './lib/constants';
	import {
		type MemoryCard,
		type Player,
		UNCALCULABLE_SCORE_SYMBOL
	} from './lib/model';
  import {
    calculateScore,
    cardFullName,
    dumbLazyMatch
  } from './lib/util';

	enum Mode {
		CONFIG = 'config',
		PLAYING = 'playing',
		FINISHED = 'finished'
	}

	let mode = Mode.CONFIG;
	let numberOfPlayers: number = 2;
	let hideScoresWhileGameIsInProgress = true;
	let showCardImages = true;

	let playersPerRow: number;
	let players: Player[];
	let memoryCardsInPlay: Set<MemoryCard>;

	function start() {
    if (numberOfPlayers < 2) {
      numberOfPlayers = 2;
    }

		mode = Mode.PLAYING;

		playersPerRow = Math.ceil(Math.sqrt(numberOfPlayers));
		players = new Array(numberOfPlayers).fill(null).map((_, playerIndex) => ({
			name: `Player ${playerIndex + 1}`,
			memories: new Set(),
			numberOfEmotionsInHand: null,
			cardFilter: '',
			score: hideScoresWhileGameIsInProgress ? null : 0
		}));
		memoryCardsInPlay = new Set(Array.from(MEMORY_CARDS));
	}

	function end() {
		mode = Mode.FINISHED;

		for (const [playerIndex, player] of players.entries()) {
			const score = calculateScore(player, {
				promptEmotionsInHand: () => {
					let emotionsInHand: number | null = null;

					while (emotionsInHand == null) {
						const response = prompt(
							`Emotion cards in hand for ${player.name || `Player ${playerIndex}`}`
						);
						const responseFloat = parseFloat(response || '');
						if (!response || isNaN(responseFloat) || !isFinite(responseFloat)) {
							continue;
						}

						emotionsInHand = Math.floor(responseFloat);
					}

					return emotionsInHand;
				}
			});

			if (score === UNCALCULABLE_SCORE_SYMBOL) {
				throw new Error(
					'Uncalculable score, even though we prompted player for their score'
				);
			}

			player.score = score;
		}

		players = players; // rerender
	}

	function goBackToConfig() {
		mode = Mode.CONFIG;
	}

	function goBackToPlaying() {
		mode = Mode.PLAYING;
	}

  function playerCollectMemory(player: Player, card: MemoryCard) {
    if (!player.memories.has(card)) {
      // Remove card from roster or other player's stash,
      // add to player's stash

      for (const [otherPlayerIndex, otherPlayer] of players.entries()) {
        const otherPlayerAlreadyHasMemoryCard = otherPlayer.memories.has(card);
        if (otherPlayerAlreadyHasMemoryCard) {
          const playerIndex = players.indexOf(player);
          const doContinue = confirm([
            `${otherPlayer.name || `Player ${otherPlayerIndex + 1}`} already has ${cardFullName(card)}.`,
            `Do you want to take the card from them, and give it to ${player.name || `Player ${playerIndex + 1}`}?`
          ].join("\n"));
          if (!doContinue) {
            return;
          }
        }

        otherPlayer.memories.delete(card);

        if (otherPlayerAlreadyHasMemoryCard) {
          if (!hideScoresWhileGameIsInProgress) {
            const score = calculateScore(otherPlayer, {
              promptEmotionsInHand: () => UNCALCULABLE_SCORE_SYMBOL
            });
            otherPlayer.score = score;
          }

          break;
        }
      }

      memoryCardsInPlay.delete(card);

      player.memories.add(card);
    } else {
      // Re-add card to roster, remove from player's stash
      player.memories.delete(card);
      memoryCardsInPlay.add(card);
    }

    if (!hideScoresWhileGameIsInProgress) {
      const score = calculateScore(player, {
        promptEmotionsInHand: () => UNCALCULABLE_SCORE_SYMBOL
      });
      player.score = score;
    }

    memoryCardsInPlay = memoryCardsInPlay; // rerender
    players = players; // rerender
  }
</script>

{#if mode === Mode.CONFIG}
	<div>
		<label for="numberOfPlayers">Number of players</label>
		<input
      name="numberOfPlayers"
      type="number"
      min="2"
      bind:value={numberOfPlayers}
    />
	</div>
	<div>
		<label for="hideScoresWhileGameIsInProgress">
      <input
        name="hideScoresWhileGameIsInProgress"
        type="checkbox"
        bind:checked={hideScoresWhileGameIsInProgress}
      />
      Hide scores while game is in progress
    </label>
	</div>
	<div>
		<label for="showCardImages">
		  <input
        name="showCardImages"
        type="checkbox"
        bind:checked={showCardImages}
      />
      Show card images (laggier the more players there are)
    </label>
	</div>
	<footer>
		<button class="start-game-btn" on:click={start}>Start Game</button>
	</footer>
{:else if mode === Mode.PLAYING}
	<div class="player-grid" style:--playersPerRow={playersPerRow}>
		{#each players as player, playerIndex}
			<div class="player player-grid__item">
				<header class="player__header">
					<input
						class="player__name"
						placeholder={`Player ${playerIndex + 1}`}
						bind:value={player.name}
					/>
					{#if !hideScoresWhileGameIsInProgress}
						<div
              class="player__score"
              class:player__score--uncalculable={player.score === UNCALCULABLE_SCORE_SYMBOL}
            >
              {#if player.score === UNCALCULABLE_SCORE_SYMBOL}
                <span title="Score will depend on how many emotion cards this player has at the end of the game">?</span>
              {:else}
                {player.score}
              {/if}
            </div>
					{/if}
				</header>

				<div class="player__card-filter card-filter">
					<label for={`player-${playerIndex}-card-search`}>Search for card:</label>
					<input
						name={`player-${playerIndex}-card-search`}
						bind:value={player.cardFilter}
					/>
          <button class="card-filter__clear-btn" on:click={() => player.cardFilter = ''}>clear</button>
				</div>

				<div class="player__card-picker">
					{#each MEMORY_CARDS as card, cardIndex}
						{#if dumbLazyMatch(card.name, player.cardFilter)}
							<button
								class="card"
								class:card--in-hand={player.memories.has(card)}
								class:card--unavailable={!player.memories.has(card) &&
									!memoryCardsInPlay.has(card)}
								aria-checked={player.memories.has(card)}
								role="switch"
								tabindex={cardIndex}
								on:click={() => playerCollectMemory(player, card)}
							>
								{#if showCardImages}
									<img
										class="card__image"
										title={cardFullName(card)}
										alt={`MemoryCard '${cardFullName(card)}'`}
										src={`./card-images/${card.name}.jpeg`}
									/>
								{:else}
									{cardFullName(card)}
								{/if}
							</button>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<footer>
		<button on:click={goBackToConfig}>Reset</button>
		<button on:click={end}>End Game</button>
	</footer>
{:else if mode === Mode.FINISHED}
  <h3>Final scores</h3>

	{#each players as player, index}
		<p>{player.name || `Player ${index + 1}`}: {player.score}</p>
	{/each}

	<footer>
		<button on:click={goBackToPlaying}>Go back</button>
	</footer>
{/if}

<style lang="scss">
	.player-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		height: 100%;

		&__item {
			width: calc(100% / var(--playersPerRow));
			border: 3px solid white;

			@media (max-width: 1200px) {
				min-width: 50%;
			}

			@media (max-width: 750px) {
				width: 100%;
				min-width: initial;
			}
		}
	}

	.player {
    &__header {
			margin-bottom: 0.5rem;
			font-size: 2rem;
      display: flex;
    }

		&__name {
      font-size: inherit;
			text-align: center;
			border: none;
			flex-grow: 1;
		}

    &__score {
      margin: 0 0.5rem;
      font-family: monospace;
      flex-grow: 0;
      flex-shrink: 1;

      &--uncalculable {
        cursor: help;
        text-decoration: underline dashed;
      }
    }

		&__card-picker {
			margin: 0.25rem;
			display: flex;
			flex-wrap: wrap;
			gap: 0.25rem;
			justify-content: center;
		}
	}

  .card-filter {
    margin: 0 0.5rem;

    &__clear-btn {
      font-size: 1rem;
      padding-block: 0;
    }
  }

	.card {
		padding: 0;
		aspect-ratio: 377 / 512;
		height: 128px;
		opacity: 0.3;
		border: none;

		&--unavailable {
			position: relative;

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(red, 0.5);
			}
		}

		&--in-hand {
			opacity: 1;
		}

		&__image {
			height: 100%;
			user-select: none;
			display: inline-block;
		}
	}

	footer {
		padding: 0.5rem;
		width: 100%;
		display: flex;
		place-content: center;
    gap: 1rem;

		button {
			font-size: 2rem;
		}
	}
</style>
