import './styles/index.css'

import ThreeSceneCreator from '@/helpers/three-scene-creator'
import ThreeTerrainCreator from '@/helpers/three-terrain-creator'

const initScene = () => {
  const container = document.getElementById('container')
  ThreeSceneCreator.init(container as HTMLDivElement)
  const { scene } = ThreeSceneCreator

  const threeTerrainCreator = new ThreeTerrainCreator(scene)
  threeTerrainCreator.init()
}

initScene()
