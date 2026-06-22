export type ExposureBet = {
  type: string;
  outcome: string;
  odds: number;
  stake: number;
};

export function calculateExposure(
  bets: ExposureBet[],
  possibleOutcomes: string[],
): { netPnl: Record<string, number>; exposure: number } {
  const netPnl: Record<string, number> = {};
  const totalStake = bets.reduce((total, bet) => total + bet.stake, 0);

  for (const outcome of possibleOutcomes) {
    const lowerOutcome = outcome.toLowerCase();
    let winningStake = 0;

    for (const bet of bets) {
      const betOutcome = bet.outcome.toLowerCase();

      if (bet.type === "back" || bet.type === "BACK") {
        if (betOutcome === lowerOutcome) {
          winningStake += bet.stake;
        }

        // Previous P/L based exposure logic:
        // net +=
        //   betOutcome === lowerOutcome
        //     ? (bet.odds - 1) * bet.stake
        //     : -bet.stake;
      }
    }

    const losingStake = totalStake - winningStake;
    netPnl[outcome] = Number((winningStake - losingStake).toFixed(2));
  }

  const minPnl = Math.min(...Object.values(netPnl));
  const exposure = Math.max(0, -minPnl);

  return { netPnl, exposure };
}
