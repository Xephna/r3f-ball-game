import { useGLTF, Float, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useState } from 'react'
import { useMemo } from 'react'
import { useRef } from 'react'
import * as THREE from 'three'

// If creating material outside of R3F, need to do this
THREE.ColorManagement.legacyMode = false

// create native 3JS BOXgeometry
const boxGeometry = new THREE.BoxGeometry(1,1,1)

// create native 3JS material
const floor1Material = new THREE.MeshStandardMaterial({color: '#111111', metalness: 0, roughness:0})
const floor2Material = new THREE.MeshStandardMaterial({color: '#222222', metalness: 0, roughness:0})
const obstacleMaterial = new THREE.MeshStandardMaterial({color: '#ff0000', metalness: 0, roughness:1})
const wallMaterial = new THREE.MeshStandardMaterial({color: '#887777', metalness: 0, roughness:0})

function BlockStart( {position=[0,0,0]} ){//args here is for default value
	return <group position={position}>
		<Float floatIntensity={0.25} rotationIntensity={0.25}>
			<Text
				scale={0.3}
				font='./bebas-neue-v9-latin-regular.woff'
				maxWidth={0.25}
				lineHeight={0.75}
				textAlign='right'
				position={[0.75, 0.65, 0]}
				rotation-y={-0.25}
			>
				Marble Race
				<meshBasicMaterial toneMapped={false}/>
			</Text>
			
		</Float>
		{/* starting area floor */}
		<mesh geometry={boxGeometry} material={floor1Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
	</group>
}

function BlockEnd( {position=[0,0,0]} ){//args here is for default value

	const hamburger = useGLTF('./hamburger.glb')

	hamburger.scene.children.forEach((mesh)=>{
		mesh.castShadow = true
	})

	return <group position={position}>
		{/* starting area floor */}
		<mesh geometry={boxGeometry} material={floor1Material} position={[0, 0, 0]} scale={[4, 0.2, 4]} receiveShadow />
		<RigidBody type='fixed' colliders='hull' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
			<primitive object={hamburger.scene} scale={0.2} />
		</RigidBody>

		<Text
			scale={0.3}
			font='./bebas-neue-v9-latin-regular.woff'
			position={[0, 2.25, 2]}
		>
			FINISH
			<meshBasicMaterial toneMapped={false}/>
		</Text>
	</group>
}

export function BlockSpinner( {position=[0,0,0]} ){//args here is for default value
	const obstacle = useRef()
	const [speed] = useState(()=>(Math.random()+0.3) * Math.random() < 0.5 ? -1 : 1)

	useFrame((state, delta)=>{
		const time = state.clock.getElapsedTime()
		
		const rotation = new THREE.Quaternion()
		rotation.setFromEuler(new THREE.Euler(0, time*speed, 0))//time in y axis because spinning on y axis
		obstacle.current.setNextKinematicRotation(rotation)
	})

	return <group position={position}>
		{/* obstacle area floor */}
		<mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]}  receiveShadow/>
		{/* ref for kinematic animation is put on rigid body */}
		<RigidBody ref={obstacle} type={'kinematicPosition'} position={[0, 0.3, 0]} restitution={0.2} friction={0}>
			<mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
		</RigidBody>
	</group>
}

export function BlockLimbo( {position=[0,0,0]} ){//args here is for default value
	const obstacle = useRef()
	const [timeOffset] = useState(()=>Math.random() * Math.PI * 2)

	useFrame((state, delta)=>{
		const time = state.clock.getElapsedTime()
		
		const elevation = Math.sin(time + timeOffset) + 1.2
		obstacle.current.setNextKinematicTranslation({x:position[0], y:elevation, z:position[2]})
	})

	return <group position={position}>
		{/* obstacle area floor */}
		<mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]}  receiveShadow/>
		{/* ref for kinematic animation is put on rigid body */}
		<RigidBody ref={obstacle} type={'kinematicPosition'} position={[0, 0.18, 0]} restitution={0.2} friction={0}>
			<mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
		</RigidBody>
	</group>
}

export function BlockAxe( {position=[0,0,0]} ){//args here is for default value
	const obstacle = useRef()
	const [timeOffset] = useState(()=>Math.random() * Math.PI * 2)

	useFrame((state, delta)=>{
		const time = state.clock.getElapsedTime()
		
		const sideways = Math.sin(time + timeOffset) * 1.25
		obstacle.current.setNextKinematicTranslation({x:sideways, y:position[1]+0.75, z:position[2]})
	})

	return <group position={position}>
		{/* obstacle area floor */}
		<mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]}  receiveShadow/>
		{/* ref for kinematic animation is put on rigid body */}
		<RigidBody ref={obstacle} type={'kinematicPosition'} position={[0, 0.18, 0]} restitution={0.2} friction={0}>
			<mesh geometry={boxGeometry} material={obstacleMaterial} scale={[1.5, 1.5, 0.3]} castShadow receiveShadow />
		</RigidBody>
	</group>
}

function Bounds({length = 1}){
	return <>
		<RigidBody type={'fixed'} restitution={0.2} friction={0}>
			<mesh geometry={boxGeometry} material={wallMaterial} position={[2.15, 0.75, -(length*2)+2]} scale={[0.3, 1.5, 4*length]} castShadow />
			<mesh geometry={boxGeometry} material={wallMaterial} position={[-2.15, 0.75, -(length*2)+2]} scale={[0.3, 1.5, 4*length]} receiveShadow />
			<mesh geometry={boxGeometry} material={wallMaterial} position={[0,0.75,(-length*4)+1.8]} scale={[4.6,1.5,0.3]} receiveShadow />
			<CuboidCollider args={[2, 0.1, 2*length]} position={[0, -0.1, -(length*2)+2]} restitution={0.2} friction={1}/>
		</RigidBody>
	</>
}

export function Level({count = 40, types = [BlockSpinner, BlockAxe, BlockLimbo]}, seed = 0){

	const blocks = useMemo(()=>{

		const blocks = []

		for (let i = 0; i < count;i++){
			const type = types[Math.floor(Math.random() * types.length)]
			blocks.push(type)
		}

		return blocks

	},[count, types, seed])

	return <>
		<BlockStart position={[0,0,0]} />
		{blocks.map((Block, index)=><Block key={index} position={[0, 0, - (index+1) * 4]} />)}
		<BlockEnd position={[0, 0, -(count+1) *4 ]} />
		<Bounds length={count+2}/>
	</>
}