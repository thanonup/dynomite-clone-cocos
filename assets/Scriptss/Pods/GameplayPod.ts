import { EventTarget } from 'cc'
import { GameplayState } from '../States/GameplayState'
import { EggBean } from '../Bean/EggBean'

export class GameplayPod {
    public gameSpeed: number = 0
    public beanEggDataList: Array<EggBean> = []
    public gameState: GameplayState = GameplayState.GamePlay
    public gameplayPodEventTarget = new EventTarget()
    public firstLoad: boolean = false

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
        this.gameplayPodEventTarget.on(
            'gameState',
            (state: GameplayState) => {
                this.gameState = state
            },
            this
        )

        this.gameplayPodEventTarget.on(
            'gameSpeed',
            (speed: number) => {
                this.gameSpeed = speed
            },
            this
        )
    }
}
