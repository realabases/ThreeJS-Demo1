import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {Pane} from 'tweakpane';

const pane
const canvas = document.querySelector("canvas.three")
const h1 = document.querySelector("h1")

const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onLoad = function ( ) {
    h1.remove()
	canvas.style.display = "inline"
    pane = new Pane({title: 'Brick Sphere'})
    pane.addBinding(sphere2Material, 'aoMapIntensity',
        {min: 0, max: 10, step: 0.3}
    )
    pane.addBinding(sphere2Material, 'roughness',
        {min: 0, max: 1, step: 0.1}
    )
    pane.addBinding(sphere2Material, 'displacementScale',
        {min: 0, max: 1, step: 0.1}
    )
    
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    h1.innerText += ".."
    console.log(h1.textContent)
};

manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};


const scene = new THREE.Scene()
const textureloader = new THREE.TextureLoader(manager)
const clock = new THREE.Clock()



const material = new THREE.MeshStandardMaterial()
const light = new THREE.PointLight( "white", 15, 100 );
const amLight = new THREE.AmbientLight("white", 0.04)


//Sphere
const grassTexture = textureloader.load('whispy-grass-meadow-bl/wispy-grass-meadow_albedo.png')

const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry( 1, 32, 32),
    material
)

sphereMesh.material.map = grassTexture
sphereMesh.material.normalMap = textureloader.load("whispy-grass-meadow-bl/wispy-grass-meadow_normal-ogl.png")

//brickSphere

const sphere2Material = new THREE.MeshStandardMaterial()

sphere2Material.map = textureloader.load('brick-wall-bl/brick-wall_albedo.png')
sphere2Material.normalMap = textureloader.load('brick-wall-bl/brick-wall_normal-ogl.png')
sphere2Material.aoMap = textureloader.load('brick-wall-bl/brick-wall_ao.png')
sphere2Material.displacementMap = textureloader.load('brick-wall-bl/brick-wall_height.png')

sphere2Material.displacementScale = 0


const sphere2Mesh = new THREE.Mesh(
    new THREE.SphereGeometry( 1, 32, 32),
    sphere2Material
)


//cube Mesh

const cubeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshLambertMaterial({color: "red", wireframe:true})
)


//camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    40
)
camera.position.z = 5
cubeMesh.position.x = 3
sphere2Mesh.position.x = -3

//scene children
light.position.set(2,2,2);
scene.add(sphereMesh)
scene.add(camera)
scene.add(light)
scene.add(amLight)
scene.add(sphere2Mesh)
scene.add(cubeMesh)


const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    }
)
const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true   

let x = 0.1
const renderLoop= () => {
    const delta = clock.getDelta()
    sphereMesh.rotation.y += 0.2 * delta
    sphereMesh.rotation.x += 0.5 * delta
    sphereMesh.rotation.z += 0.3 * delta
    cubeMesh.scale.x = Math.abs(Math.sin(x))
    cubeMesh.scale.y = Math.abs(Math.sin(x))
    cubeMesh.scale.z = Math.abs(Math.sin(x))
    cubeMesh.rotation.x += 0.7 * delta
    cubeMesh.rotation.y += 0.7 * delta
    cubeMesh.rotation.z += 0.7 * delta
    sphere2Mesh.rotation.y += 1 * delta
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    controls.update()
    renderer.render(scene,camera)
    window.requestAnimationFrame(renderLoop)
    x += 0.01
}

renderLoop()


