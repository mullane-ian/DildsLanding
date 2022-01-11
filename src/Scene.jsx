import * as THREE from 'three'
import React, { useRef, useState,Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import './styles.css'
import { useGLTF,Text, Html } from '@react-three/drei'
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing'
import { KernelSize, BlendFunction } from 'postprocessing'
import colors from 'nice-color-palettes'
import { RectAreaLightUniformsLib, FlakesTexture } from 'three-stdlib'

import myFont from './myFont.otf'

let colorArray = [
  "#3ebdef",
  "#e59297",
  "#0b3f8e",
  "#f2ab8a",
  "#f913f6",
  "#33bac6",
  "#88e88d",
  "#9fe234",
  "#f2c168",
  "#48f28c",
  "#fcd9a4",
  "#3ded2d",
  "#1cef15",
  "#069499",
  "#f7e991",
  "#c4c7fc",
  "#3f0996",
  "#efea86",
  "#50a3b7",
  "#415da8",
  "#1d20e2",
  "#b6e06d",
  "#2ad3ed",
  "#f9f1b1",
  "#e58d30",
  "#7b89f2",
  "#fc7435",
  "#70b517",
  "#867af4",
  "#126682",
  "#6df9e9",
  "#61f4de",
  "#7dd3db",
  "#aaffe0",
  "#1b2d91",
  "#78bde8",
  "#d32886",
  "#63b9c6",
  "#a02346",
  "#5fddaf",
  "#ffaf9b",
  "#f9dc84",
  "#e899de",
  "#876cc9",
  "#0d2f87",
  "#a0ea8a",
  "#019633",
  "#ef88bf",
  "#8e8fdb",
  "#4569b2",
  "#c64fea",
  "#e789f9",
  "#e83357",
  "#fcabc1",
  "#adc2ed",
  "#fcf5a6",
  "#9cf49c",
  "#aab2ef",
  "#f73d66",
  "#ffc6c4",
  "#e04188",
  "#a0e86d",
  "#f2e421",
  "#f27d9e",
  "#ce863d",
  "#b4b0f4",
  "#f98684",
  "#a0d624",
  "#94fc5f",
  "#bc0fb4",
  "#ea85ac",
  "#2c3ab2",
  "#e25171",
  "#a5cc3b",
  "#daf298",
  "#84f46b",
  "#b0ffa5",
  "#ead577",
  "#0891e0",
  "#e5ba1d",
  "#8c8cdb",
  "#dbbf23",
  "#e52a12",
  "#3f9fff",
  "#004f7c",
  "#42ccd1",
  "#e57a6b",
  "#e5f28e",
  "#a871c6",
  "#056682",
  "#e23152",
  "#e83ac8",
  "#5de299",
  "#ef34ba",
  "#17aa94",
  "#e5cc5b",
  "#a3f7b4",
  "#e516bc",
  "#f6fc8a",
  "#d347a9",
  "#E8BEAC",
  "#2ac134",
  "#e070d3",
  "#03b26f",
  "#8583e2",
  "#E8BEAC",
];
const myColors = colorArray
console.log(myColors)


RectAreaLightUniformsLib.init()
THREE.Vector2.prototype.equals = function (v, epsilon = 0.001) {
  return Math.abs(v.x - this.x) < epsilon && Math.abs(v.y - this.y) < epsilon
}

function useLerpedMouse() {
  const mouse = useThree((state) => state.mouse)
  const lerped = useRef(mouse.clone())
  const previous = new THREE.Vector2()
  useFrame((state) => {
    previous.copy(lerped.current)
    lerped.current.lerp(mouse, 0.1)
    // Regress system when the mouse is moved
    if (!previous.equals(lerped.current)) state.performance.regress()
  })
  return lerped
}



function Thing({...props}) {
  const { viewport } = useThree()
  const ref = useRef()
  const [color, setColor] = useState(0)
  const [hover, setHover] = useState(false);
  const { nodes, materials } = useGLTF('/001-transformed.glb')


  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto'
  }, [hover])

  useFrame(({ clock }) => {
    if (hover) {
      ref.current.rotation.y += 0.08
    }else{
      ref.current.rotation.y += .02

    }



    const i = Math.round(hover?((clock.getElapsedTime())/2 % myColors.length):((clock.getElapsedTime()/8) % myColors.length))
    console.log(hover)
    // either use state
    setColor(i)
    // or imperatively
     ref.current.material.color.set( myColors[color] )
    console.log(viewport.width)
  })
  

  return (
    <>
    <mesh 
       fog={false}
       ref={ref}
       scale={[2,2,2]}
       geometry={nodes.Cube.geometry}  
    
       position={[6, -4, -15.95]} 
       
       onPointerOver={() => {
          setHover(true);
        }}
        onPointerOut={() => {
          setHover(false);
        }}
    >
    
      <meshStandardMaterial color={myColors[color + 5]} />
      
      <Text
      position={[2,5,0]}
      rotation={[0,0,Math.PI/2]}
      textAlign='left'
  
      fontSize={1.5} 
      color={myColors[color]}  
      material-fog={false} 
     
      anchorX="center"
      anchorY="middle"
      whiteSpace={false}>
         {myColors[color]}
        </Text>
    </mesh>
    <Text
      position={[0,-8,-20]}
      maxWidth={(viewport.width / 100) * 120} 
      textAlign='left'
      font={myFont} 
      fontSize={7} 
      color={myColors[color]}  
      material-fog={false} 
      letterSpacing={0}
      anchorX="center"
      anchorY="middle"
      whiteSpace={false}>
          the DILDS
        </Text>




    </>

    

  )
}

const Lights = () => {
  const lights = useRef()
  const mouse = useLerpedMouse()
  useFrame((state) => {
    lights.current.rotation.x = (mouse.current.x * Math.PI) / 2
    lights.current.rotation.y = Math.PI * 0.25 - (mouse.current.y * Math.PI) / 2
  })
  return (
    <>
      <directionalLight intensity={1} position={[2, 2, 0]} color="red" distance={5} />
      <spotLight intensity={2} position={[-5, 10, 2]} angle={0.2} penumbra={1} castShadow shadow-mapSize={[2048, 2048]} />
      <group ref={lights}>
        <rectAreaLight intensity={12} position={[4.5, 0, -10]} width={100} height={100}/>
        <rectAreaLight intensity={12} position={[-10, 2, -10]} width={15} height={15} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </group>
    </>
  )
}


function Effects() {
  const ref = useRef()

  return (

        <EffectComposer multisampling={8}>
          <Bloom
            kernelSize={}
            luminanceThreshold={0.2}
            luminanceSmoothing={1}
            intensity={0.2}
          />
      
        </EffectComposer> 
  )
}




function Scene() {
  return (
    <Canvas gl={{ antialias: false }}>
     {/* <fog attach="fog" args={['#000', 1, 30]} /> */}
      <pointLight position={[0, 10, -5]} intensity={0.5} />

      <pointLight position={[1, -2, 5]} intensity={1} />
      <Lights />
      
      <Suspense fallback={null}>
    
       <Thing fog={false}/>

      </Suspense>
   
      <color attach="background" args={['black']} />
      <Effects />
    </Canvas>
  )
}

export default Scene






// import { useGLTF } from '@react-three/drei'

// export default function Model({ ...props }) {
//   const group = useRef()
//   const { nodes, materials } = useGLTF('/001-transformed.glb')
//   return (
//     <group ref={group} {...props} dispose={null}>
//       <mesh geometry={nodes.Cube.geometry} material={nodes.Cube.material} position={[0.1, 0.58, 0.95]} />
//     </group>
//   )
// }