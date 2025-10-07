import React, { /*useEffect,*/ useState } from 'react'
import './styles/main.scss'
import Hero from './modules/Hero/Hero'
import Header from './modules/Header/Header'
import OurTeam from './modules/OurTeam/OurTeam'
import Lore from './modules/Lore/Lore'
import MintDetails from './modules/MintDetails/MintDetails'
import SneakPeek from './modules/SneakPeek/SneakPeek'
import BurgerMenu from './modules/BurgerMenu/BurgerMenu'
import { BurgerMenuContext } from './context'
import Collabs from './modules/Collabs/Collabs'
import Footer from './modules/Footer/Footer'

const App: React.FC = () => {
	const [active, setActive] = useState<boolean>(false);

/*	useEffect(() => {
		document.documentElement.classList.toggle('locked')
	}, [active])  
	
	под вопросом

	*/

	return (
		<BurgerMenuContext.Provider value={{active, setActive}}>
			<Header />
			<Hero />
			<BurgerMenu />
			<OurTeam />
			<Lore />
			<MintDetails />
			<SneakPeek />
			<Collabs />
			<Footer />
		</BurgerMenuContext.Provider>
	)
}

export default App
