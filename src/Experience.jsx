import { OrbitControls } from '@react-three/drei'
import { Debug, Physics } from '@react-three/rapier'
import {Level} from './Level.jsx'
import Lights from './Lights.jsx'
import Player from './Player.jsx'
import useGame from './stores/useGame.jsx'
import Effects from './Effects.jsx'

export default function Experience()
{
	const blocksCount = useGame((state)=>state.blocksCount)
	const blockSeed = useGame((state)=>state.blockSeed)
	
    return <>

        {/* <OrbitControls makeDefault /> */}

		<color args={['#252731']} attach='background'/>

		<Physics>
			{/* <Debug/> */}
			<Lights />
			<Level count={blocksCount} seed={ blockSeed } />
			<Player />
		</Physics>
		<Effects />
    </>
}