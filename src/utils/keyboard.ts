class Keyboard {
    private keys: { [key: string]: boolean } = {};
    private _eventQueue: Array<KeyboardEvent> = [];

    constructor() {
        window.addEventListener("keydown", (event) => this.handleKeyDown(event));
        window.addEventListener("keyup", (event) => this.handleKeyUp(event));
    }

    private handleKeyDown(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        if (!this.keys[key]) {
            this.keys[key] = true;
            this._eventQueue.push(event);
        }
    }

    private handleKeyUp(event: KeyboardEvent) {
        const key = event.key.toLowerCase();
        this.keys[key] = false;
        this._eventQueue.push(event);
    }

    public isHeld(key: string): boolean {
        return !!this.keys[key.toLowerCase()];
    }

    public getEvents(): Array<KeyboardEvent> {
        const queue = this._eventQueue;
        this._eventQueue = [];
        return queue;
    }
}

export const keyboard = new Keyboard();
