'use client'

import { useState } from 'react'
import { AssessmentResult, StudentLevel } from './DifferentiationApp'

interface Question {
  id: string
  question: string
  type: 'multiple-choice' | 'input'
  options?: string[]
  correctAnswer: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  topic: string
  explanation: string
}

const assessmentQuestions: Question[] = [
  {
    id: 'q1',
    question: 'Wat is de afgeleide van f(x) = x²?',
    type: 'multiple-choice',
    options: ['x', '2x', 'x²', '2'],
    correctAnswer: '2x',
    difficulty: 'basic',
    topic: 'Basisregels',
    explanation: 'De afgeleide van x² is 2x volgens de machtsregel: d/dx(xⁿ) = n·xⁿ⁻¹'
  },
  {
    id: 'q2',
    question: 'Wat is de afgeleide van f(x) = 3x³ + 2x?',
    type: 'input',
    correctAnswer: '9x² + 2',
    difficulty: 'basic',
    topic: 'Basisregels',
    explanation: 'Gebruik de machtsregel en somregel: d/dx(3x³) = 9x² en d/dx(2x) = 2'
  },
  {
    id: 'q3',
    question: 'Wat is de afgeleide van f(x) = sin(x)?',
    type: 'multiple-choice',
    options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'],
    correctAnswer: 'cos(x)',
    difficulty: 'intermediate',
    topic: 'Goniometrische functies',
    explanation: 'De afgeleide van sin(x) is cos(x)'
  },
  {
    id: 'q4',
    question: 'Wat is de afgeleide van f(x) = e^x?',
    type: 'multiple-choice',
    options: ['e^x', 'x·e^(x-1)', 'e', 'ln(x)'],
    correctAnswer: 'e^x',
    difficulty: 'intermediate',
    topic: 'Exponentiële functies',
    explanation: 'De exponentiële functie e^x is bijzonder: zijn afgeleide is zichzelf!'
  },
  {
    id: 'q5',
    question: 'Wat is de afgeleide van f(x) = (2x + 1)³ met behulp van de kettingregel?',
    type: 'input',
    correctAnswer: '6(2x + 1)²',
    difficulty: 'advanced',
    topic: 'Kettingregel',
    explanation: 'Kettingregel: f\'(g(x)) = f\'(g(x)) · g\'(x). Hier: 3(2x + 1)² · 2 = 6(2x + 1)²'
  },
  {
    id: 'q6',
    question: 'Wat is de afgeleide van f(x) = x·sin(x) met behulp van de productregel?',
    type: 'input',
    correctAnswer: 'sin(x) + x·cos(x)',
    difficulty: 'advanced',
    topic: 'Productregel',
    explanation: 'Productregel: (u·v)\' = u\'·v + u·v\'. Hier: 1·sin(x) + x·cos(x)'
  }
]

interface AssessmentPhaseProps {
  onComplete: (result: AssessmentResult) => void
}

export default function AssessmentPhase({ onComplete }: AssessmentPhaseProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const currentQuestion = assessmentQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === assessmentQuestions.length - 1

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
    setUserAnswer(answer)
    setShowExplanation(true)
  }

  const handleNext = () => {
    setShowExplanation(false)
    setUserAnswer('')
    
    if (isLastQuestion) {
      // Calculate results
      const result = calculateAssessmentResult()
      setIsComplete(true)
      onComplete(result)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const calculateAssessmentResult = (): AssessmentResult => {
    let correctAnswers = 0
    const topicScores: Record<string, { correct: number, total: number }> = {}
    const strengths: string[] = []
    const weaknesses: string[] = []

    assessmentQuestions.forEach(question => {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
      
      if (isCorrect) correctAnswers++

      // Track topic performance
      if (!topicScores[question.topic]) {
        topicScores[question.topic] = { correct: 0, total: 0 }
      }
      topicScores[question.topic].total++
      if (isCorrect) topicScores[question.topic].correct++
    })

    // Determine strengths and weaknesses
    Object.entries(topicScores).forEach(([topic, scores]) => {
      const percentage = scores.correct / scores.total
      if (percentage >= 0.7) {
        strengths.push(topic)
      } else if (percentage < 0.5) {
        weaknesses.push(topic)
      }
    })

    // Determine level
    const percentage = correctAnswers / assessmentQuestions.length
    let level: StudentLevel
    if (percentage >= 0.8) {
      level = 'advanced'
    } else if (percentage >= 0.5) {
      level = 'intermediate'
    } else {
      level = 'beginner'
    }

    return {
      level,
      strengths,
      weaknesses,
      score: correctAnswers,
      totalQuestions: assessmentQuestions.length
    }
  }

  const isAnswerCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim()

  if (isComplete) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Assessment Voltooid!
        </h2>
        <p className="text-gray-600 mb-6">
          Geweldig! We hebben je niveau bepaald en gaan nu een gepersonaliseerd leerpad voor je maken.
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Vraag {currentQuestionIndex + 1} van {assessmentQuestions.length}
          </span>
          <span className="text-sm text-gray-500">
            Niveau bepaling
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / assessmentQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {currentQuestion.topic}
          </span>
          <span className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded ${
            currentQuestion.difficulty === 'basic' ? 'bg-green-100 text-green-800' :
            currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {currentQuestion.difficulty === 'basic' ? 'Basis' :
             currentQuestion.difficulty === 'intermediate' ? 'Gemiddeld' : 'Gevorderd'}
          </span>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion.question}
        </h2>

        {/* Answer Options */}
        {!showExplanation && (
          <div className="space-y-3">
            {currentQuestion.type === 'multiple-choice' ? (
              currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <span className="font-medium text-gray-700">{String.fromCharCode(65 + index)}.</span>
                  <span className="ml-3 text-gray-800">{option}</span>
                </button>
              ))
            ) : (
              <div>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Typ je antwoord hier..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userAnswer.trim()) {
                      handleAnswer(userAnswer)
                    }
                  }}
                />
                <button
                  onClick={() => handleAnswer(userAnswer)}
                  disabled={!userAnswer.trim()}
                  className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Bevestigen
                </button>
              </div>
            )}
          </div>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className={`p-6 rounded-lg border-l-4 ${
            isAnswerCorrect 
              ? 'bg-green-50 border-green-400' 
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-center mb-3">
              {isAnswerCorrect ? (
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className={`font-semibold ${
                isAnswerCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isAnswerCorrect ? 'Correct!' : 'Niet helemaal juist'}
              </span>
            </div>
            
            {!isAnswerCorrect && (
              <p className="text-red-700 mb-3">
                <strong>Jouw antwoord:</strong> {userAnswer}<br/>
                <strong>Correct antwoord:</strong> {currentQuestion.correctAnswer}
              </p>
            )}
            
            <p className="text-gray-700 mb-4">
              <strong>Uitleg:</strong> {currentQuestion.explanation}
            </p>
            
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLastQuestion ? 'Resultaten bekijken' : 'Volgende vraag'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}