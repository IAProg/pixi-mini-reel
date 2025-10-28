export function quadToLinearLerp(a: number, b: number, t: number, tC: number): number {
    const dist = b - a;

    // Compute base acceleration and cruise velocity
    const accel = 1 / (tC * (2 - tC));  // normalized (we'll scale later)
    const vC = accel * tC;
    const xC = 0.5 * accel * tC * tC;

    let xNorm: number;

    if (t < tC) {
        xNorm = 0.5 * accel * t * t;
    } else {
        xNorm = xC + vC * (t - tC);
    }

    // Renormalize so that xNorm(1) == 1 exactly
    const total = xC + vC * (1 - tC);
    xNorm /= total;

    return a + dist * xNorm;
}