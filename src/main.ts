import Phaser from 'phaser'

import EnvironmentScene from './environment'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 1000,
	height: 900,
	backgroundColor: 0xffffff,
	physics: {
		default: 'arcade',
	},
	scene: [EnvironmentScene],
}

export default new Phaser.Game(config)
