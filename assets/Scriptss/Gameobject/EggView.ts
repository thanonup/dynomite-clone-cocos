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
    Input,
    ParticleSystem2D,
    math,
    AudioSource,
    AudioClip,
} from 'cc'
import { EggPod } from '../Pods/EggPod'
import { EggBean } from '../Bean/EggBean'
import { AssetManagerManual } from '../Managers/AssetManagerManual'
import { GameplayPod } from '../Pods/GameplayPod'
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
    private eggSprite: Sprite
    @property
    private collider: CircleCollider2D

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
    private isCollided: boolean = false
    private targetPosition: Vec3
    private isDestorying: boolean = false

    private gameplayPod: GameplayPod

    uiTransform: UITransform

    public doInit(bean: EggBean, isGrid: boolean) {
        this.gameplayPod = GameplayPod.instance

        this.uiTransform = this.getComponent(UITransform)
        this.isOnGrid = isGrid
        this.isBullet = !isGrid
        this.eggPod = new EggPod(this)

        this.eggPod.eventTarget.on('BeanChange', (bean: EggBean) => {
            this.eggSprite.getComponent(Sprite).spriteFrame = AssetManagerManual.Instance.getAsset(bean.keySprite)
        })

        this.gameplayPod.gameplayPodEventTarget.on(
            'updateCollision',
            () => {
                if (this.isDestorying) return
                this.eggPod.resetList()
                this.collider.enabled = false
                this.scheduleOnce(() => {
                    this.collider.enabled = true
                    this.rb.allowSleep = false
                }, 0.001)

                this.scheduleOnce(() => {
                    var falling = true
                    this.eggPod.eggList.forEach((x) => {
                        if (!x.canFall) {
                            falling = false
                        }
                    })

                    if (falling) this.onBeforeDestory()
                }, 0.05)
            },
            this
        )

        this.speedMove = this.gameplayPod.gameSpeed
        this.gameplayPod.gameplayPodEventTarget.on('gameSpeed', (speed: number) => {
            this.speedMove = speed
        })

        this.eggPod.ChangeBean(bean)

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this)

        this.node.on(Input.EventType.MOUSE_DOWN, this.onClick, this)
    }

    private onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 30) {
            this.canFall = true
        }
    }

    private onClick(event: MouseEvent) {
        this.eggPod.eggList.forEach((x) => {
            console.log(x.name)
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

        return vec
    }

    private onAudioPlay(clip: AudioClip) {
        this.audio.clip = clip
        if (clip == this.destroyClip) this.audio.play()
        else if (!this.audio.playing) this.audio.play()
    }

    update(deltaTime: number) {
        this.rb.angularVelocity = 0.001
        this.node.setRotation(new math.Quat())

        if (!this.isDestorying) {
            if (this.isCollided) {
                this.node.setPosition(this.targetPosition)
                this.isCollided = false
            }

            if (this.isOnGrid) {
                var yPosition = this.node.position.y - this.speedMove * deltaTime
                this.node.setPosition(this.node.position.x, yPosition, 0)

                return
            }
        }
    }

    public onBeforeDestory() {
        this.particleBomb1.resetSystem()
        this.particleBomb2.resetSystem()

        this.isDestorying = true
        this.collider.enabled = false
        this.rb.linearVelocity = new Vec2(0, 5)
        this.collider.sensor = true
        this.rb.gravityScale = 1

        this.scheduleOnce(() => {
            this.rb.linearVelocity = new Vec2(this.randomIntFromRange(-5, 5), -15)
        }, 0.3)

        this.scheduleOnce(() => {
            this.onDestroy()
        }, 3)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 30) {
            this.canFall = false
        }

        this.handleEggContact(otherCollider, selfCollider)
    }

    private handleEggContact(otherCollider: Collider2D, selfCollider: Collider2D) {
        if (this.isDestorying) return

        if (this.isBullet) {
            if (otherCollider.tag == 222) {
                var vec = this.rb.linearVelocity
                vec.x *= -1
                this.rb.linearVelocity = vec
            }
        }

        if (otherCollider.tag == selfCollider.tag) {
            var eggView = otherCollider.getComponent(EggView)
            if (eggView.isDestorying) return

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

    public onDestroy() {
        this.node.active = false
        this.eggPod.removeEggFromEggList(this)
    }

    randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}
