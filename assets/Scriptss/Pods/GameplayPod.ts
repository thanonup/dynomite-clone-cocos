import { EventTarget, UITransform } from 'cc'
import { GameplayState } from '../States/GameplayState'
import { EggBean } from '../Bean/EggBean'
import { EggView } from '../Gameobject/EggView'

export class GameplayPod {
    public score: number = 0
    public gameSpeed: number = 0
    public beanEggDataList: Array<EggBean> = []
    public beanEggDataSpawnerList: Array<EggBean> = []
    public beanEggDataSlingList: Array<EggBean> = []
    public gameState: GameplayState = GameplayState.PreStart
    public nextEggSpawnBean: EggBean

    public eggInScene: EggView[] = []

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

    public removeEggInScene(eggView: EggView) {
        var index = this.eggInScene.indexOf(eggView, 0)
        if (index > -1) this.eggInScene.splice(index, 1)
    }

    public updateCollision() {
        this.eggInScene.sort((a, b) => b.node.position.y - a.node.position.y)
        this.eggInScene.forEach((x) => x.eggPod.resetPod())
        this.eggInScene.forEach((x) => x.updateCollision())
        this.eggInScene.forEach((x) => (x.canFall = true))
        this.eggInScene.forEach((x) => x.checkFalling())

        let count = this.eggInScene.length

        for (let i = 0; i < count; i++) {
            if (this.eggInScene[i] != undefined) this.eggInScene[i].getFalling()
        }
    }

    public restartGame() {
        this.gameplayPodEventTarget.emit('score', 0)
        this.gameplayPodEventTarget.emit('gameSpeed', this.startSpeed)
        this.eggInScene = []

        this.nextEggSpawnBean = undefined

        this.beanEggDataSpawnerList = [this.beanEggDataList[0], this.beanEggDataList[1], this.beanEggDataList[2]]

        this.beanEggDataSlingList = [this.beanEggDataList[0], this.beanEggDataList[1], this.beanEggDataList[2]]
    }
}
