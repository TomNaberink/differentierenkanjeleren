'use client'

import { useState, useRef, useEffect } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

interface AITutorProps {
  isOpen: boolean
  onClose: () => void
  exercise: {
    question: string
    answer: string
    userAnswer: string
    topic: string
    difficulty: string
  }
  onHintReceived?: (hint: string) => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AITutor({ isOpen, onClose, exercise, onHintReceived }: AITutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationStarted, setConversationStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize conversation when tutor opens
  useEffect(() => {
    if (isOpen && !conversationStarted) {
      initializeConversation()
      setConversationStarted(true)
    }
  }, [isOpen, conversationStarted])

  // Reset when exercise changes
  useEffect(() => {
    setMessages([])
    setConversationStarted(false)
    setUserInput('')
  }, [exercise.question])

  const initializeConversation = async () => {
    setIsLoading(true)
    
    const initialPrompt = `
Je bent een vriendelijke en behulpzame wiskundedocent die leerlingen helpt met differentiëren. 
Een leerling heeft zojuist een fout antwoord gegeven op een opgave en heeft hulp nodig.

OPGAVE: ${exercise.question}
CORRECT ANTWOORD: ${exercise.answer}
ANTWOORD VAN LEERLING: ${exercise.userAnswer}
ONDERWERP: ${exercise.topic}
MOEILIJKHEIDSGRAAD: ${exercise.difficulty}

BELANGRIJKE REGELS:
1. Geef NOOIT het complete antwoord weg
2. Geef hints die de leerling helpen zelf tot het antwoord te komen
3. Wees bemoedigend en geduldig
4. Vraag de leerling om hun denkproces uit te leggen
5. Geef stap-voor-stap begeleiding
6. Gebruik eenvoudige, begrijpelijke taal
7. Complimenteer goede pogingen en denkstappen

Start het gesprek door de leerling te begroeten en te vragen waar ze denken dat het fout ging.
`

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: initialPrompt,
          aiModel: 'smart'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages([{
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error('Error initializing AI tutor:', error)
      setMessages([{
        role: 'assistant',
        content: 'Hoi! Ik zie dat je een andere uitkomst hebt dan verwacht. Geen probleem, dat gebeurt iedereen! Kun je me vertellen hoe je aan je antwoord bent gekomen? Dan kunnen we samen kijken waar het anders kan.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput('')
    setIsLoading(true)

    // Create conversation context
    const conversationHistory = [...messages, userMessage]
      .map(msg => `${msg.role === 'user' ? 'Leerling' : 'Docent'}: ${msg.content}`)
      .join('\n\n')

    const tutorPrompt = `
Je bent een wiskundedocent die een leerling helpt met deze opgave:

OPGAVE: ${exercise.question}
CORRECT ANTWOORD: ${exercise.answer}
OORSPRONKELIJK ANTWOORD LEERLING: ${exercise.userAnswer}
ONDERWERP: ${exercise.topic}

GESPREKSVERLAUF TOT NU TOE:
${conversationHistory}

BELANGRIJKE REGELS:
1. Geef NOOIT het complete antwoord weg
2. Geef hints die helpen bij de volgende stap
3. Als de leerling vastloopt, vraag dan naar hun denkproces
4. Wees geduldig en bemoedigend
5. Als de leerling dicht bij het antwoord komt, complimenteer dan hun vooruitgang
6. Gebruik concrete voorbeelden en analogieën waar mogelijk
7. Als de leerling het antwoord heeft gevonden, feliciteer hen en leg kort uit waarom het klopt

Reageer op de laatste vraag/opmerking van de leerling en help hen verder.
`

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: tutorPrompt,
          aiModel: 'smart'
        })
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        
        // Notify parent component about the hint
        if (onHintReceived) {
          onHintReceived(data.response)
        }
      }
    } catch (error) {
      console.error('Error sending message to AI tutor:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, ik heb even een technisch probleem. Probeer je vraag opnieuw te stellen.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">AI Wiskundedocent</h3>
                <p className="text-sm text-gray-600">Ik help je stap voor stap</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Exercise Context */}
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <div className="text-sm">
            <p className="font-medium text-gray-800 mb-1">Opgave:</p>
            <p className="text-gray-700 mb-2">{exercise.question}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <span>Jouw antwoord: <span className="font-mono bg-red-100 px-1 rounded">{exercise.userAnswer}</span></span>
              <span className="text-yellow-600">• {exercise.topic}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.role === 'assistant' ? (
                  <MarkdownRenderer content={message.content} className="text-sm" />
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-600 text-sm">Docent denkt na...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Stel een vraag of leg uit hoe je dacht..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!userInput.trim() || isLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            💡 Tip: Vertel me hoe je aan je antwoord kwam, dan kan ik je beter helpen!
          </div>
        </div>
      </div>
    </div>
  )
}