import { EventTarget } from 'cc'
import { GameplayState } from '../States/GameplayState'

export class GameplayPod {
    public gameState: GameplayState = GameplayState.GamePlay
    public gameStateEventTarget = new EventTarget()

    private static _instance: GameplayPod

    private static getInstance() {
        if (!GameplayPod._instance) {
            GameplayPod._instance = new GameplayPod()
        }

        return GameplayPod._instance
    }

    static get instance(): GameplayPod {
        return this.getInstance()
    }

    constructor() {
        this.gameStateEventTarget.on(
            'gameState',
            (state: GameplayState) => {
                this.gameState = state
            },
            this
        )
    }
}
