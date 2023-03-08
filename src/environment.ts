import Phaser from 'phaser'
import { isPointInCircle } from './utils'
import { Boid } from './boids'

const SCREEP_AMOUNT = 500

export default class EnvironmentScene extends Phaser.Scene {

	private boidList: Boid[] = []
	private fpsDisplay: HTMLParagraphElement;

	public constructor() {
		super('simulation')

		this.fpsDisplay = document.getElementById("fps") as HTMLParagraphElement
	}

	public preload() {
		this.load.image('boid_image', 'assets/boid.svg')
	}

	public create() {

		for (let i = 0; i < SCREEP_AMOUNT; i++) {
			const rx: number = Phaser.Math.Between(0, (this.game.config.width as number))
			const ry: number = Phaser.Math.Between(0, (this.game.config.height as number))
			const boid: Boid = new Boid(this, rx, ry)
			this.boidList.push(boid)
		}
		this.boidList.forEach((boid: Boid) => {
			boid.boids = this.boidList
		})
	}

	public update(time: number, delta: number): void {
		this.fpsDisplay.innerText = "" + Math.floor(this.game.loop.actualFps)
		this.boidList.forEach((boid: Boid) => {
			boid.move()
		})

	}
}
