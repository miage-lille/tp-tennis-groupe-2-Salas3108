import { Player, stringToPlayer, isSamePlayer } from './types/player';
import {
  Point,
  PointsData,
  Score,
  points,
  forty,
  deuce,
  advantage,
  game,
  FortyData,
} from './types/score';
import { pipe, Option } from 'effect'

// -------- Tooling functions --------- //

export const playerToString = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'Player 1';
    case 'PLAYER_TWO':
      return 'Player 2';
  }
};
export const otherPlayer = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return stringToPlayer('PLAYER_TWO');
    case 'PLAYER_TWO':
      return stringToPlayer('PLAYER_ONE');
  }
};
// Exercice 1 :
export const pointToString = (point: Point): string => {
  // Point is represented as number in this kata (0,15,30,40)
  switch (point) {
    case 0:
      return 'Love';
    case 15:
      return '15';
    case 30:
      return '30';
    case 40:
      return '40';
    default:
      return String(point);
  }
};

export const scoreToString = (score: Score): string => {
  switch (score.kind) {
    case 'POINTS':
      return (
        pointToString(score.pointsData.PLAYER_ONE) +
        ' - ' +
        pointToString(score.pointsData.PLAYER_TWO)
      );
    case 'FORTY':
      return (
        `40 (${playerToString(score.fortyData.player)}) - ` +
        pointToString(score.fortyData.otherPoint)
      );
    case 'DEUCE':
      return 'Deuce';
    case 'ADVANTAGE':
      return `Advantage ${playerToString(score.player)}`;
    case 'GAME':
      return `Game ${playerToString(score.player)}`;
  }
};

export const scoreWhenDeuce = (winner: Player): Score => {
  return advantage(winner);
};

export const scoreWhenAdvantage = (
  advantagedPlayed: Player,
  winner: Player
): Score => {
  if (isSamePlayer(advantagedPlayed, winner)) return game(winner);
  return deuce();
};

export const scoreWhenForty = (
  currentForty: FortyData,
  winner: Player
): Score => {
  if (isSamePlayer(currentForty.player, winner)) return game(winner);

  const incrementPoint = (p: Point) => {
    switch (p) {
      case 0:
        return Option.some(15 as Point);
      case 15:
        return Option.some(30 as Point);
      case 30:
        return Option.none();
      default:
        return Option.none();
    }
  };

  return pipe(
    incrementPoint(currentForty.otherPoint),
    Option.match({
      onNone: () => deuce(),
      onSome: (p) => forty(currentForty.player, p) as Score,
    })
  );
};



// Exercice 2
// Tip: You can use pipe function from Effect to improve readability.
// See scoreWhenForty function above.
export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  const winnerKey = winner;
  const other = otherPlayer(winner);
  const winnerPoints = current[winnerKey];
  const otherPoints = current[other];

  if (winnerPoints === 30) {
    // winner goes to forty
    return forty(winner, otherPoints);
  }

  const nextPoint = winnerPoints === 0 ? 15 : winnerPoints === 15 ? 30 : winnerPoints;

  if (winnerKey === 'PLAYER_ONE') {
    return points(nextPoint, otherPoints);
  }
  return points(otherPoints, nextPoint);
};

// Exercice 3
export const scoreWhenGame = (winner: Player): Score => {
  return game(winner);
};

export const score = (currentScore: Score, winner: Player): Score => {
  switch (currentScore.kind) {
    case 'POINTS':
      return scoreWhenPoint(currentScore.pointsData, winner);
    case 'FORTY':
      return scoreWhenForty(currentScore.fortyData, winner);
    case 'DEUCE':
      return scoreWhenDeuce(winner);
    case 'ADVANTAGE':
      return scoreWhenAdvantage(currentScore.player, winner);
    case 'GAME':
      return scoreWhenGame(currentScore.player);
  }
};
