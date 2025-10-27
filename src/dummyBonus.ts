import { IBonusData } from "./types";
import { createRepeatingRange, randomInt } from "./utils";

function createLanding(): Array<number> {
    const landing = createRepeatingRange(15, 1, 2);
    landing[12] = randomInt(1,3);
    landing[13] = randomInt(1,3);
    landing[14] = randomInt(1,3);

    return landing;
}

export function getDummyBonus(): Array<IBonusData> {
    return new Array(randomInt(20, 40)).fill(0).map(() => {
        return {
            win: 0,
            remainingSpins: 0,
            showBigWin: Math.random() > 0.6,
            showAnticipation: Math.random() > 0.6,
            landing: createLanding()
        }
    } );
}