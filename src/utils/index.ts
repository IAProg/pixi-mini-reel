import { IPointData, Point } from "pixi.js";

export function transformPoints(points: Array<IPointData>, scale: number, rot: number): Array<Point> {
    const cosTheta = Math.cos(rot);
    const sinTheta = Math.sin(rot);

    return points.map(( point ) => {
        const scaledX = point.x * scale;
        const scaledY = point.y * scale;
        const transformedX = scaledX * cosTheta - scaledY * sinTheta;
        const transformedY = scaledX * sinTheta + scaledY * cosTheta;
        return new Point(transformedX, transformedY);
    });
}

export class SelectionList<T>{
    private _sourceList: Array<T>
    private _index: number = 0;

    constructor( array: Array<T> ){
        this._sourceList = array;
    }

    public cycle(): void{
        this._index++;
    }

    public get currentValue(): T {
        return this._sourceList[this._index % this._sourceList.length];
    }
}

export function drawRoundedRectangle(width: number, height: number, radius: number, rotation: number, zoom: number): Array<Point> {       
    const points: Point[] = [];
    const segments = 16; 
  
    // generate points along arc to form corners 
    function generateArcPoints(cx: number, cy: number, startAngle: number, endAngle: number) {
        for (let i = 0; i <= segments; i++) {
            const angle = startAngle + (i / segments) * (endAngle - startAngle);
            const x = cx + radius * Math.cos(angle) - width * 0.5;
            const y = cy + radius * Math.sin(angle) - height * 0.5;
            points.push(new Point(x, y));
        }
    }
  
    generateArcPoints(radius, radius, -Math.PI, -Math.PI / 2); // Top-left
    generateArcPoints(width - radius, radius, -Math.PI / 2, 0); // Top-right
    generateArcPoints(width - radius, height - radius, 0, Math.PI / 2); // Bottom-right
    generateArcPoints(radius, height - radius, Math.PI / 2, Math.PI); // Bottom-left
    return transformPoints(points, zoom, rotation);
}


/**
 * promise timeout wrapper function
 */
export const delay = (ms: number) => new Promise<void>(
    (resolve) => setTimeout(resolve, ms)
);

/**
 * create array of numbers with range and count
 */
export function createRepeatingRange(count, min, max) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return result;
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
