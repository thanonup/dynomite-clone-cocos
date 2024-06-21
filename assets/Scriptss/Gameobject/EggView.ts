import {
    _decorator,
    CCBoolean,
    CircleCollider2D,
    Collider2D,
    Component,
    Contact2DType,
    IPhysics2DContact,
    RigidBody2D,
    Sprite,
    UITransform,
    Vec2,
    Vec3,
    CCFloat,
    ParticleSystem2D,
    math,
    AudioSource,
    AudioClip,
    NodePool,
    Input,
} from 'cc'
import { EggPod } from '../Pods/EggPod'
import { EggBean } from '../Bean/EggBean'
import { AssetManagerManual } from '../Managers/AssetManagerManual'
import { GameplayPod } from '../Pods/GameplayPod'
import { GameConfig } from '../GameConfig'
const { ccclass, property } = _decorator

@ccclass('EggView')
export class EggView extends Component {
    @property
    public rb: RigidBody2D
    @property({ type: CCFloat })
    yOffset: number

    @property({ type: CCBoolean })
    isOnGrid: boolean
    @property({ type: CCBoolean })
    public canFall: boolean = true
    @property({ type: CCBoolean })
    isBullet: boolean

    @property({ type: EggPod })
    public eggPod: EggPod

    @property
    public eggSprite: Sprite
    @property
    public collider: CircleCollider2D

    @property({ type: ParticleSystem2D })
    private particleBomb1: ParticleSystem2D
    @property({ type: ParticleSystem2D })
    private particleBomb2: ParticleSystem2D

    @property({ type: AudioSource })
    private audio: AudioSource

    @property({ type: AudioClip })
    private contactClip
    @property({ type: AudioClip })
    private destroyClip

    private speedMove: number
    private targetPosition: Vec3
    private isCollided: boolean = false
    private isDestroying: boolean = false

    private pool: NodePool

    private gameplayPod: GameplayPod

    uiTransform: UITransform

    public doInit(pool: NodePool) {
        this.gameplayPod = GameplayPod.instance
        this.pool = pool
        this.uiTransform = this.getComponent(UITransform)

        this.eggPod = new EggPod(this)

        this.beanSubscribe()

        this.node.on(Input.EventType.MOUSE_DOWN, this.onClick, this)

        this.gameplayPod.gameplayPodEventTarget.on(
            'updateCollision',
            () => {
                if (this.isDestroying) return
                // if (
                //     this.node.position.y >=
                //     this.node.parent.getComponent(UITransform).height / 2 - this.uiTransform.height
                // )
                //     return

                this.eggPod.resetPod()

                // this.collider.enabled = false
                // this.scheduleOnce(() => {
                //     this.collider.enabled = true
                //     this.rb.allowSleep = false
                // }, 0.001)

                this.gameplayPod.eggInScene.forEach((egg) => {
                    var distance = Vec2.distance(egg.node.position, this.node.position)
                    // console.log(distance)

                    if (egg != this && distance <= this.uiTransform.width + this.uiTransform.width / 2 + 5) {
                        // check is already in list
                        if (!this.eggPod.eggList.find((x) => x == egg)) {
                            //add new egg at list for all element in list
                            this.eggPod.addEggToEggList(egg)
                        }

                        // add new same type egg at list
                        if (egg.eggPod.bean.type == this.eggPod.bean.type) {
                            if (!this.eggPod.eggListInType.find((x) => x == egg)) this.eggPod.addEggToEggListInType(egg)
                        }

                        // this.handleEggContact(otherCollider, selfCollider)
                    }
                })

                this.scheduleOnce(() => {
                    var falling = true
                    this.eggPod.eggList.forEach((x) => {
                        if (!x.canFall) {
                            falling = false
                        }
                    })
                    if (falling) this.onBeforeDestory()
                }, 0.17)
            },
            this
        )

        this.speedMove = this.gameplayPod.gameSpeed
        this.gameplayPod.gameplayPodEventTarget.on('gameSpeed', (speed: number) => {
            this.speedMove = speed
        })

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this)
    }

    private beanSubscribe() {
        this.eggPod.eventTarget.on('BeanChange', (bean: EggBean, isGrid: boolean) => {
            this.eggSprite.getComponent(Sprite).spriteFrame = AssetManagerManual.Instance.getAsset(bean.keySprite)
            this.collider.enabled = true
            this.isOnGrid = isGrid
            this.isBullet = !isGrid
            this.isDestroying = false
            this.gameplayPod.eggInScene.push(this)
        })
    }
    public updateCurrentLineSpawn(line: number) {
        this.eggPod.currentLine = line
    }

    private onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 30) {
            // this.canFall = true
        }
    }

    private onClick(event: MouseEvent) {
        this.eggPod.eggList.forEach((x) => {
            x.eggSprite.color = math.color(255, 0, 0, 255)
            setTimeout(() => (x.eggSprite.color = math.color(255, 255, 255, 255)), 3000, this)
        })

        this.eggPod.eggListInType.forEach((x) => {
            x.eggSprite.color = math.color(0, 0, 255, 255)
            setTimeout(() => (x.eggSprite.color = math.color(255, 255, 255, 255)), 3000, this)
        })
    }

    private OnEggCollision(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (!this.isOnGrid) {
            this.targetPosition = this.getGridPosition(selfCollider, otherCollider)
            this.isCollided = true
        }

        this.rb.linearVelocity = new Vec2(0, 0)
        this.isOnGrid = true

        this.scheduleOnce(() => {
            if (this.eggPod.eggListInType.length > 2) {
                this.eggPod.eggListInType.forEach((x) => {
                    x.onBeforeDestory()
                })

                this.onAudioPlay(this.destroyClip)
                this.gameplayPod.eggInScene.forEach((x) => {
                    x.eggPod.resetPod()
                })

                this.gameplayPod.gameplayPodEventTarget.emit('updateCollision')
            } else this.onAudioPlay(this.contactClip)

            this.isBullet = false
        }, 0.05)
    }

    private getGridPosition(selfCollider: Collider2D, otherCollider: Collider2D): Vec3 {
        var vec: Vec3 = new Vec3()

        if (
            selfCollider.node.position.y <=
            otherCollider.node.position.y - otherCollider.getComponent(UITransform).height / 2
        ) {
            if (selfCollider.node.position.x < otherCollider.node.position.x)
                vec = new Vec3(
                    otherCollider.node.position.x - this.uiTransform.width / 2,
                    otherCollider.node.position.y - this.yOffset
                )
            else
                vec = new Vec3(
                    otherCollider.node.position.x + this.uiTransform.width / 2,
                    otherCollider.node.position.y - this.yOffset
                )
        } else {
            if (selfCollider.node.position.x < otherCollider.node.position.x)
                vec = new Vec3(otherCollider.node.position.x - this.uiTransform.width, otherCollider.node.position.y)
            else vec = new Vec3(otherCollider.node.position.x + this.uiTransform.width, otherCollider.node.position.y)
        }

        if (vec.x > 262.5) vec.x -= this.uiTransform.width
        if (vec.x < -262.5) vec.x += this.uiTransform.width

        return vec
    }

    private onAudioPlay(clip: AudioClip) {
        this.audio.clip = clip
        if (clip == this.destroyClip) this.audio.play()
        else if (!this.audio.playing) this.audio.play()
    }

    update(deltaTime: number) {
        this.canFall =
            this.node.position.y <= this.node.parent.getComponent(UITransform).width / 2 - this.uiTransform.height

        if (!this.isDestroying) {
            if (this.isCollided) {
                this.node.setPosition(this.targetPosition)
                this.isCollided = false
            }

            if (this.isOnGrid) {
                this.rb.angularVelocity = 0.001
                this.node.setRotation(new math.Quat())
                var yPosition = this.node.position.y - this.speedMove * deltaTime
                this.node.setPosition(this.node.position.x, yPosition, 0)

                return
            }
        }
    }

    public onBeforeDestory() {
        if (this.isDestroying) return

        this.gameplayPod.removeEggInScene(this)
        this.eggPod.removeEggFromEggList(this)

        if (this.eggPod.currentLine == GameConfig.NEXT_SLING_SPAWN_NEW_EGG_1) {
            if (this.gameplayPod.beanEggDataSlingList.indexOf(this.gameplayPod.beanEggDataList[3]) == -1) {
                this.gameplayPod.beanEggDataSlingList.push(this.gameplayPod.beanEggDataList[3])
            }
        } else if (this.eggPod.currentLine == GameConfig.NEXT_SLING_SPAWN_NEW_EGG_2) {
            if (this.gameplayPod.beanEggDataSlingList.indexOf(this.gameplayPod.beanEggDataList[4]) == -1) {
                this.gameplayPod.beanEggDataSlingList.push(this.gameplayPod.beanEggDataList[4])
            }
        }

        this.gameplayPod.updateScore(this.eggPod.bean.score)

        this.particleBomb1.resetSystem()
        this.particleBomb2.resetSystem()

        this.isDestroying = true
        this.collider.enabled = false
        this.rb.linearVelocity = new Vec2(0, 5)
        this.rb.gravityScale = 1

        setTimeout(() => (this.rb.linearVelocity = new Vec2(this.randomIntFromRange(-5, 5), -15)), 300, this)
        setTimeout(() => this.returnToPool(), 3000, this)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 30) {
            // this.canFall = false
        }

        this.handleEggContact(otherCollider, selfCollider)
    }

    private handleEggContact(otherCollider: Collider2D, selfCollider: Collider2D) {
        if (this.isDestroying) return

        if (this.isBullet) {
            if (otherCollider.tag == 222) {
                var vec = this.rb.linearVelocity
                vec.x *= -1
                this.rb.linearVelocity = vec
            }
        }

        if (otherCollider.tag == selfCollider.tag) {
            var eggView = otherCollider.getComponent(EggView)
            if (eggView.isDestroying) return

            // check is already in list
            if (!this.eggPod.eggList.find((x) => x == eggView)) {
                //add new egg at list for all element in list
                this.eggPod.addEggToEggList(eggView)
            }

            // add new same type egg at list
            if (eggView.eggPod.bean.type == this.eggPod.bean.type) {
                if (!this.eggPod.eggListInType.find((x) => x == eggView)) this.eggPod.addEggToEggListInType(eggView)
            }

            if (this.isBullet) this.OnEggCollision(selfCollider, otherCollider)
        }
    }

    public returnToPool() {
        this.eggPod.resetPod()
        this.isCollided = false
        this.isOnGrid = false
        this.isBullet = false
        this.canFall = true

        this.rb.linearVelocity = Vec2.ZERO
        this.rb.gravityScale = 0

        this.particleBomb1.stopSystem()
        this.particleBomb2.stopSystem()

        this.pool.put(this.node)
    }

    randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}
