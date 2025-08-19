import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send, X, GripVertical, Bot } from 'lucide-react'

interface ChatMessage {
	id: string
	text: string
	isUser: boolean
	timestamp: Date
}

const FloatingAssistant: React.FC = () => {
	const [open, setOpen] = useState(false)
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: 'welcome',
			text: 'Привет! Я твой Study Buddy! Помогу разобраться с английским, объясню правила простыми словами и поддержу в обучении. Что изучаем сегодня?',
			isUser: false,
			timestamp: new Date(),
		},
	])
	const [input, setInput] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Position and size state
	const [position, setPosition] = useState<{ x: number; y: number }>({ x: 24, y: 120 })
	const [size, setSize] = useState<{ width: number; height: number }>({ width: 380, height: 520 })
	const dragging = useRef(false)
	const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
	const origin = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

	// Auto-scroll to bottom when new messages arrive
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const onMouseDownHeader = (e: React.MouseEvent) => {
		dragging.current = true
		dragStart.current = { x: e.clientX, y: e.clientY }
		origin.current = { ...position }
		document.addEventListener('mousemove', onMouseMove)
		document.addEventListener('mouseup', onMouseUp)
	}

	const onMouseMove = (e: MouseEvent) => {
		if (!dragging.current) return
		const dx = e.clientX - dragStart.current.x
		const dy = e.clientY - dragStart.current.y
		setPosition({ x: Math.max(12, origin.current.x + dx), y: Math.max(12, origin.current.y + dy) })
	}

	const onMouseUp = () => {
		dragging.current = false
		document.removeEventListener('mousemove', onMouseMove)
		document.removeEventListener('mouseup', onMouseUp)
	}

	useEffect(() => () => {
		document.removeEventListener('mousemove', onMouseMove)
		document.removeEventListener('mouseup', onMouseUp)
	}, [])

	const send = () => {
		if (!input.trim()) return
		const userMsg: ChatMessage = { id: String(Date.now()), text: input, isUser: true, timestamp: new Date() }
		setMessages((m) => [...m, userMsg])
		setInput('')
		setTimeout(() => {
			const aiMsg: ChatMessage = {
				id: String(Date.now() + 1),
				text: 'Отлично! Давай разберём это вместе! Могу объяснить правило простыми словами, дать примеры из жизни и даже проверить твои ответы. Готов к мини-тесту?',
				isUser: false,
				timestamp: new Date(),
			}
			setMessages((m) => [...m, aiMsg])
		}, 700)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			send()
		}
	}

	return (
		<>
			{/* Floating FAB button */}
			<motion.button
				onClick={() => setOpen((v) => !v)}
				className="study-buddy-fab"
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				title="Study Buddy - твой помощник в изучении английского"
			>
				<Heart className="w-6 h-6" />
			</motion.button>

			{/* Chat window */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						style={{ left: position.x, top: position.y, width: size.width, height: size.height }}
						className="study-buddy-window"
					>
						{/* Header */}
						<div
							onMouseDown={onMouseDownHeader}
							className="study-buddy-header"
						>
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
									<Bot className="w-4 h-4 text-white" />
								</div>
								<div>
									<div className="study-buddy-title">Study Buddy</div>
									<div className="text-xs text-muted">Твой помощник в изучении английского</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setOpen(false)}
									className="p-1 rounded hover:bg-muted transition-colors"
									title="Закрыть"
								>
									<X className="w-4 h-4 text-muted" />
								</button>
								<GripVertical className="w-4 h-4 text-muted" />
							</div>
						</div>

						{/* Messages */}
						<div className="study-buddy-messages">
							{messages.map((m) => (
								<motion.div 
									key={m.id} 
									initial={{ opacity: 0, y: 10, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									transition={{ duration: 0.2, ease: "easeOut" }}
									className={`message ${m.isUser ? 'user' : 'assistant'}`}
								>
									<div className="message-content">
										{m.text}
									</div>
								</motion.div>
							))}
							<div ref={messagesEndRef} />
						</div>

						{/* Input */}
						<div className="study-buddy-input">
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Спроси меня о чём угодно..."
								className="input"
							/>
							<button 
								onClick={send} 
								className="study-buddy-input button"
								disabled={!input.trim()}
							>
								<Send className="w-4 h-4" />
							</button>
						</div>

						{/* Resize handle */}
						<div
							style={{ resize: 'both' as any }}
							className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity duration-200"
							onMouseDown={(e) => {
								const startX = e.clientX
								const startY = e.clientY
								const startW = size.width
								const startH = size.height
								const onMove = (ev: MouseEvent) => {
									setSize({ 
										width: Math.max(320, startW + (ev.clientX - startX)), 
										height: Math.max(420, startH + (ev.clientY - startY)) 
									})
								}
								const onUp = () => {
									document.removeEventListener('mousemove', onMove)
									document.removeEventListener('mouseup', onUp)
								}
								document.addEventListener('mousemove', onMove)
								document.addEventListener('mouseup', onUp)
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}

export default FloatingAssistant
