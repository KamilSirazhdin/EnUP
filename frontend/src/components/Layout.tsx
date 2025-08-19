import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './Header'
import FloatingAssistant from './FloatingAssistant'

const Layout = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<motion.main 
				className="px-4 sm:px-6 lg:px-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<div className="max-w-7xl mx-auto py-6">
					<Outlet />
				</div>
			</motion.main>
			<FloatingAssistant />
		</div>
	)
}

export default Layout
