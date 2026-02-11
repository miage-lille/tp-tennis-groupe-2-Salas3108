import { describe, expect, test } from '@jest/globals';
import { otherPlayer, playerToString, scoreWhenPoint } from '..';
import type { Player } from '../types/player';
import type { PointsData } from '../types/score';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('Tests for transition functions', () => {
  test('Given deuce, score is advantage to winner', () => {
     console.log('To fill when we will know how represent Deuce');
   });
   test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
     console.log('To fill when we will know how represent Advantage');
   });
   test('Given advantage when otherPlayer wins, score is Deuce', () => {
     console.log('To fill when we will know how represent Advantage');
   });
   test('Given a player at 40 when the same player wins, score is Game for this player', () => {
     console.log('To fill when we will know how represent Forty');
   });
   test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
     console.log('To fill when we will know how represent Forty');
   });
   test('Given player at 40 and other at 15 when other wins, score is 40 - 15', () => {
     console.log('To fill when we will know how represent Forty');
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
