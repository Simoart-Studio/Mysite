/** Kolory kostek z logo — jedyne akcenty na ciemnym tle. */
export const DICE = ['#EF5B4C', '#F4B740', '#3DB3A2', '#9B6BD6', '#F58A3A', '#3E7FE0', '#86C24A'] as const;

export const dice = (i: number) => DICE[((i % DICE.length) + DICE.length) % DICE.length]!;
