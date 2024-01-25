import * as dat from 'lil-gui'
import { createNoise2D } from 'simplex-noise'
import {
  BufferAttribute,
  Mesh,
  MeshNormalMaterial,
  PlaneGeometry,
  Scene
} from 'three'

type Params = {
  frequency: {
    x: number
    z: number
  }
  amplitude: number
  octaves: number
}

const noise = createNoise2D()

export default class ThreeTerrainCreator {
  private scene: Scene
  private params!: Params
  private geometry!: PlaneGeometry

  constructor(scene: Scene) {
    this.scene = scene
  }

  public init() {
    this.createGui()
    this.createPlane()
  }

  private createPlane() {
    const chunkSize = 256
    const material = new MeshNormalMaterial({ wireframe: true })
    const geometry = new PlaneGeometry(chunkSize, chunkSize, 100, 100)
    geometry.rotateX(-Math.PI / 2)

    const mesh = new Mesh(geometry, material)
    this.scene.add(mesh)
    this.geometry = geometry

    this.updateGeometry(geometry, this.params)
  }

  private updateGeometry(geometry: PlaneGeometry, params: Params) {
    const position = geometry.getAttribute('position') as BufferAttribute
    const { amplitude = 1, frequency } = params
    const { x: fx, z: fz } = frequency

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i)
      const z = position.getZ(i)

      let y = noise(x * fx * 0.01, z * fz * 0.01) * amplitude

      if (params.octaves >= 2) {
        y += noise(x * fx * 0.01 * 2, z * fz * 0.01 * 2) * amplitude * 0.5
      }

      if (params.octaves >= 3) {
        y += noise(x * fx * 0.01 * 4, z * fz * 0.01 * 4) * amplitude * 0.25
      }

      position.setY(i, y)
    }

    geometry.computeVertexNormals()
    position.needsUpdate = true
  }

  private createGui() {
    const gui = new dat.GUI()
    this.params = {
      frequency: {
        x: 1,
        z: 1
      },
      amplitude: 1,
      octaves: 1
    }

    gui
      .add(this.params, 'amplitude', 0, 50)
      .onChange(() => this.updateGeometry(this.geometry, this.params))
    gui
      .add(this.params, 'octaves', 1, 3, 1)
      .onChange(() => this.updateGeometry(this.geometry, this.params))
    gui
      .add(this.params.frequency, 'x', 0.1, 2)
      .onChange(() => this.updateGeometry(this.geometry, this.params))
    gui
      .add(this.params.frequency, 'z', 0.1, 2)
      .onChange(() => this.updateGeometry(this.geometry, this.params))
  }
}
