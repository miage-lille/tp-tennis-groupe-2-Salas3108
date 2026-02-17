import { describe, expect, test } from '@jest/globals';
import {
  otherPlayer,
  playerToString,
  scoreWhenPoint,
  scoreWhenDeuce,
  scoreWhenAdvantage,
  scoreWhenForty,
  advantage,
  deuce,
  game,
  forty,
  points,
  pointToString,
  scoreToString,
} from '..';
import type { Player } from '../types/player';
import type { PointsData } from '../types/score';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });

  test('pointToString returns expected labels', () => {
    expect(pointToString(0 as any)).toBe('Love');
    expect(pointToString(15 as any)).toBe('15');
    expect(pointToString(30 as any)).toBe('30');
    expect(pointToString(40 as any)).toBe('40');
  });

  test('scoreToString formats scores correctly', () => {
    expect(scoreToString(points(0 as any, 0 as any))).toBe('Love - Love');
    expect(scoreToString(points(15 as any, 30 as any))).toBe('15 - 30');
    expect(scoreToString(deuce())).toBe('Deuce');
    expect(scoreToString(advantage('PLAYER_ONE'))).toBe('Advantage Player 1');
    expect(scoreToString(game('PLAYER_TWO'))).toBe('Game Player 2');
    expect(scoreToString(forty('PLAYER_ONE', 15 as any))).toBe('40 (Player 1) - 15');
  });

  test('Given deuce when scoreToString is called, it returns "Deuce"', () => {
    const result = scoreToString(deuce());
    expect(result).toBe('Deuce');
  });

  test('Given advantage for PLAYER_ONE when scoreToString is called, it returns "Advantage Player 1"', () => {
    const result = scoreToString(advantage('PLAYER_ONE'));
    expect(result).toBe('Advantage Player 1');
  });

  test('Given game for PLAYER_TWO when scoreToString is called, it returns "Game Player 2"', () => {
    const result = scoreToString(game('PLAYER_TWO'));
    expect(result).toBe('Game Player 2');
  });
});

describe('Tests for transition functions', () => {
  test('Given deuce, score is advantage to winner', () => {
    (['PLAYER_ONE', 'PLAYER_TWO'] as const).forEach((w) => {
      const winner = w;
      const score = scoreWhenDeuce(winner as any);
      const expected = advantage(winner as any);
      expect(score).toStrictEqual(expected);
    });
  });

  test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
    (['PLAYER_ONE', 'PLAYER_TWO'] as const).forEach((adv) => {
      const advantagedPlayer = adv as any;
      const winner = advantagedPlayer;
      const score = scoreWhenAdvantage(advantagedPlayer, winner);
      const expected = game(winner);
      expect(score).toStrictEqual(expected);
    });
  });

  test('Given advantage when otherPlayer wins, score is Deuce', () => {
    (['PLAYER_ONE', 'PLAYER_TWO'] as const).forEach((adv) => {
      const advantagedPlayer = adv as any;
      const winner = otherPlayer(advantagedPlayer as any);
      const score = scoreWhenAdvantage(advantagedPlayer, winner as any);
      const expected = deuce();
      expect(score).toStrictEqual(expected);
    });
  });

  test('Given a player at 40 when the same player wins, score is Game for this player', () => {
    (['PLAYER_ONE', 'PLAYER_TWO'] as const).forEach((w) => {
      const winner = w as any;
      const fortyData = { player: winner, otherPoint: 30 } as any;
      const score = scoreWhenForty(fortyData, winner);
      const expected = game(winner as any);
      expect(score).toStrictEqual(expected);
    });
  });

  test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
    (['PLAYER_ONE', 'PLAYER_TWO'] as const).forEach((w) => {
      const winner = w as any;
      const fortyData = { player: otherPlayer(winner), otherPoint: 30 } as any;
      const score = scoreWhenForty(fortyData, winner);
      const expected = deuce();
      expect(score).toStrictEqual(expected);
    });
  });

  test('Given player at 40 and other at 15 when other wins, score is 40 - 30', () => {
    (['PLAYER_ONE', 'PLAYER_TWO'] as const).forEach((w) => {
      const winner = w as any;
      const fortyData = { player: otherPlayer(winner), otherPoint: 15 } as any;
      const score = scoreWhenForty(fortyData, winner);
      const expected = forty(fortyData.player, 30 as any);
      expect(score).toStrictEqual(expected);
    });
  });
  // -------------------------TESTS POINTS-------------------------- //
  test('Given players at 0 or 15 points score kind is still POINTS', () => {
    (['PLAYER_ONE', 'PLAYER_TWO'] as const).forEach((winner: Player) => {
      // both at 0
      const start0: PointsData = { PLAYER_ONE: 0, PLAYER_TWO: 0 };
      const s0 = scoreWhenPoint(start0, winner);
      expect(s0.kind).toStrictEqual('POINTS');

      // winner at 15, other at 0
      const start15 =
        winner === 'PLAYER_ONE'
          ? { PLAYER_ONE: 15, PLAYER_TWO: 0 }
          : { PLAYER_ONE: 0, PLAYER_TWO: 15 };
      const s15 = scoreWhenPoint(start15, winner);
      expect(s15.kind).toStrictEqual('POINTS');
    });
  });

  test('Given one player at 30 and win, score kind is forty', () => {
    (['PLAYER_ONE', 'PLAYER_TWO'] as const).forEach((winner: Player) => {
      const other = otherPlayer(winner);
      const start: PointsData =
        winner === 'PLAYER_ONE'
          ? { PLAYER_ONE: 30, PLAYER_TWO: 15 }
          : { PLAYER_ONE: 15, PLAYER_TWO: 30 };

      const score = scoreWhenPoint(start, winner);
      expect(score.kind).toStrictEqual('FORTY');

      
      if (score.kind !== 'FORTY') {
        throw new Error(`Expected FORTY, got ${score.kind}`);
      }

      expect(score.fortyData.player).toStrictEqual(winner);
      expect(score.fortyData.otherPoint).toStrictEqual(start[other]);
    });
  });
});
