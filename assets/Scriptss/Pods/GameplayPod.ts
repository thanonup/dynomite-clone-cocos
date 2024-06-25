import { EventTarget } from 'cc'
import { GameplayState } from '../States/GameplayState'
import { EggBean } from '../Bean/EggBean'

export class GameplayPod {
    public score: number = 0
    public gameSpeed: number = 0
    public beanEggDataList: Array<EggBean> = []
    public beanEggDataSpawnerList: Array<EggBean> = []
    public beanEggDataSlingList: Array<EggBean> = []
    public gameState: GameplayState = GameplayState.PreStart
    public nextEggSpawnBean: EggBean

    public gameplayPodEventTarget = new EventTarget()
    public firstLoad: boolean = false

    public startSpeed: number = 0

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

        this.gameplayPodEventTarget.on(
            'score',
            (score: number) => {
                this.score = score
            },
            this
        )

        this.gameplayPodEventTarget.on(
            'nextEggSpawn',
            (eggBean: EggBean) => {
                this.nextEggSpawnBean = eggBean
            },
            this
        )
    }

    public updateScore(score: number) {
        const scoreUpdate = this.score + score
        this.gameplayPodEventTarget.emit('score', scoreUpdate)
    }

    public restartGame() {
        this.gameplayPodEventTarget.emit('score', 0)
        this.gameplayPodEventTarget.emit('gameSpeed', this.startSpeed)

        this.nextEggSpawnBean = undefined

        this.beanEggDataSpawnerList = [this.beanEggDataList[0], this.beanEggDataList[1], this.beanEggDataList[2]]

        this.beanEggDataSlingList = [this.beanEggDataList[0], this.beanEggDataList[1], this.beanEggDataList[2]]
    }
}
