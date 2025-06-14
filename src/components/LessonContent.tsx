'use client'

import { useState } from 'react'
import { StudentLevel } from './DifferentiationApp'
import AITutor from './AITutor'

interface LessonContentProps {
  topic: string
  studentLevel: StudentLevel
  onComplete: (score: number) => void
  onBack: () => void
  isReview?: boolean // New prop to indicate if this is a review session
}

interface LessonSection {
  type: 'explanation' | 'example' | 'practice'
  title: string
  content: string
  examples?: Array<{
    problem: string
    solution: string
    steps: string[]
  }>
  exercises?: Array<{
    question: string
    answer: string
    hint?: string
  }>
}

const lessonData: Record<string, Record<StudentLevel, LessonSection[]>> = {
  'basic-rules': {
    beginner: [
      {
        type: 'explanation',
        title: 'Wat is differentiëren?',
        content: 'Differentiëren is het vinden van de afgeleide van een functie. De afgeleide vertelt ons hoe snel een functie verandert op elk punt. Het is als het vinden van de helling van de raaklijn aan de grafiek.'
      },
      {
        type: 'explanation',
        title: 'De Machtsregel',
        content: 'De belangrijkste regel voor differentiëren is de machtsregel: Als f(x) = x^n, dan is f\'(x) = n·x^(n-1). Dit betekent dat je de macht naar voren haalt en de macht met 1 vermindert.'
      },
      {
        type: 'example',
        title: 'Voorbeelden van de Machtsregel',
        content: 'Laten we een paar eenvoudige voorbeelden bekijken:',
        examples: [
          {
            problem: 'f(x) = x²',
            solution: 'f\'(x) = 2x',
            steps: [
              'Gebruik de machtsregel: d/dx(x^n) = n·x^(n-1)',
              'Hier is n = 2',
              'Dus: f\'(x) = 2·x^(2-1) = 2x'
            ]
          },
          {
            problem: 'f(x) = x³',
            solution: 'f\'(x) = 3x²',
            steps: [
              'Gebruik de machtsregel met n = 3',
              'f\'(x) = 3·x^(3-1) = 3x²'
            ]
          }
        ]
      },
      {
        type: 'practice',
        title: 'Oefenen met de Machtsregel',
        content: 'Probeer deze opgaven zelf op te lossen:',
        exercises: [
          {
            question: 'Wat is de afgeleide van f(x) = x⁴?',
            answer: '4x³',
            hint: 'Gebruik de machtsregel: breng de macht naar voren en verminder met 1'
          },
          {
            question: 'Wat is de afgeleide van f(x) = x⁵?',
            answer: '5x⁴',
            hint: 'De macht is 5, dus de afgeleide wordt 5·x^(5-1)'
          },
          {
            question: 'Wat is de afgeleide van f(x) = 2x³?',
            answer: '6x²',
            hint: 'Vergeet niet de coëfficiënt 2 mee te nemen!'
          }
        ]
      }
    ],
    intermediate: [
      {
        type: 'explanation',
        title: 'Basisregels Samenvatting',
        content: 'Je kent al de basis van differentiëren. Laten we de belangrijkste regels snel doornemen en uitbreiden naar meer complexe situaties.'
      },
      {
        type: 'explanation',
        title: 'Uitgebreide Machtsregel',
        content: 'De machtsregel werkt ook voor negatieve en gebroken machten: d/dx(x^n) = n·x^(n-1) voor alle reële getallen n.'
      },
      {
        type: 'example',
        title: 'Complexere Voorbeelden',
        content: 'Voorbeelden met coëfficiënten en meerdere termen:',
        examples: [
          {
            problem: 'f(x) = 3x² + 5x - 2',
            solution: 'f\'(x) = 6x + 5',
            steps: [
              'Differentieer elke term apart (somregel)',
              'd/dx(3x²) = 3·2x = 6x',
              'd/dx(5x) = 5',
              'd/dx(-2) = 0 (constante regel)',
              'Dus: f\'(x) = 6x + 5'
            ]
          }
        ]
      },
      {
        type: 'practice',
        title: 'Geavanceerde Oefeningen',
        content: 'Test je begrip met deze uitdagendere opgaven:',
        exercises: [
          {
            question: 'Wat is de afgeleide van f(x) = 4x³ - 2x² + 7x - 1?',
            answer: '12x² - 4x + 7',
            hint: 'Differentieer elke term apart en gebruik de somregel'
          },
          {
            question: 'Wat is de afgeleide van f(x) = x^(-2)?',
            answer: '-2x^(-3)',
            hint: 'De machtsregel werkt ook voor negatieve machten!'
          }
        ]
      }
    ],
    advanced: [
      {
        type: 'explanation',
        title: 'Geavanceerde Toepassingen',
        content: 'Als gevorderde student gaan we direct naar complexere toepassingen van de basisregels en bereiden we voor op de kettingregel en productregel.'
      },
      {
        type: 'practice',
        title: 'Uitdagende Opgaven',
        content: 'Deze opgaven testen je volledige begrip:',
        exercises: [
          {
            question: 'Wat is de afgeleide van f(x) = (1/2)x⁴ - (3/4)x³ + 2√x?',
            answer: '2x³ - (9/4)x² + 1/√x',
            hint: 'Schrijf √x als x^(1/2) en gebruik de machtsregel'
          }
        ]
      }
    ]
  },
  'chain-rule': {
    beginner: [
      {
        type: 'explanation',
        title: 'Inleiding tot Samengestelde Functies',
        content: 'Voordat we de kettingregel leren, moeten we begrijpen wat samengestelde functies zijn. Een samengestelde functie is een functie binnen een functie, zoals f(g(x)).'
      },
      {
        type: 'practice',
        title: 'Herkennen van Samengestelde Functies',
        content: 'Leer eerst samengestelde functies herkennen:',
        exercises: [
          {
            question: 'Wat is de binnenfunctie in f(x) = (x + 1)²?',
            answer: 'x + 1',
            hint: 'Kijk naar wat er tussen de haakjes staat'
          }
        ]
      }
    ],
    intermediate: [
      {
        type: 'explanation',
        title: 'De Kettingregel',
        content: 'De kettingregel wordt gebruikt om samengestelde functies te differentiëren. Als y = f(g(x)), dan is dy/dx = f\'(g(x)) · g\'(x).'
      },
      {
        type: 'example',
        title: 'Kettingregel Voorbeelden',
        content: 'Laten we de kettingregel toepassen:',
        examples: [
          {
            problem: 'f(x) = (2x + 1)³',
            solution: 'f\'(x) = 6(2x + 1)²',
            steps: [
              'Identificeer de binnen- en buitenfunctie',
              'Buitenfunctie: u³, binnenfunctie: u = 2x + 1',
              'Afgeleide buitenfunctie: 3u²',
              'Afgeleide binnenfunctie: 2',
              'Kettingregel: 3(2x + 1)² · 2 = 6(2x + 1)²'
            ]
          }
        ]
      },
      {
        type: 'practice',
        title: 'Kettingregel Oefeningen',
        content: 'Pas de kettingregel toe:',
        exercises: [
          {
            question: 'Wat is de afgeleide van f(x) = (3x - 2)⁴?',
            answer: '12(3x - 2)³',
            hint: 'Identificeer eerst de binnen- en buitenfunctie'
          },
          {
            question: 'Wat is de afgeleide van f(x) = (x² + 1)²?',
            answer: '4x(x² + 1)',
            hint: 'De binnenfunctie is x² + 1, vergeet niet deze ook te differentiëren!'
          }
        ]
      }
    ],
    advanced: [
      {
        type: 'explanation',
        title: 'Complexe Kettingregel Toepassingen',
        content: 'Voor gevorderde studenten behandelen we meervoudige samenstellingen en combinaties met andere regels.'
      },
      {
        type: 'practice',
        title: 'Geavanceerde Kettingregel',
        content: 'Uitdagende toepassingen:',
        exercises: [
          {
            question: 'Wat is de afgeleide van f(x) = ((2x + 1)² - 3)³?',
            answer: '12(2x + 1)((2x + 1)² - 3)²',
            hint: 'Dit is een dubbele samenstelling - werk van buiten naar binnen'
          }
        ]
      }
    ]
  },
  'polynomial-functions': {
    beginner: [
      {
        type: 'explanation',
        title: 'Polynoomfuncties',
        content: 'Polynoomfuncties zijn functies die bestaan uit termen met verschillende machten van x, zoals f(x) = 3x³ + 2x² - 5x + 1.'
      },
      {
        type: 'practice',
        title: 'Polynomen Differentiëren',
        content: 'Oefen met het differentiëren van polynomen:',
        exercises: [
          {
            question: 'Wat is de afgeleide van f(x) = x³ + 2x² + x?',
            answer: '3x² + 4x + 1',
            hint: 'Differentieer elke term apart'
          }
        ]
      }
    ],
    intermediate: [
      {
        type: 'explanation',
        title: 'Complexere Polynomen',
        content: 'We gaan kijken naar polynomen met hogere graden en meer complexe coëfficiënten.'
      },
      {
        type: 'practice',
        title: 'Geavanceerde Polynomen',
        content: 'Uitdagendere polynoomfuncties:',
        exercises: [
          {
            question: 'Wat is de afgeleide van f(x) = 2x⁵ - 3x⁴ + x² - 7?',
            answer: '10x⁴ - 12x³ + 2x',
            hint: 'Gebruik de machtsregel voor elke term'
          }
        ]
      }
    ],
    advanced: [
      {
        type: 'explanation',
        title: 'Polynomen met Gebroken Machten',
        content: 'Geavanceerde polynomen kunnen ook gebroken en negatieve machten bevatten.'
      },
      {
        type: 'practice',
        title: 'Complexe Polynomen',
        content: 'Polynomen met speciale machten:',
        exercises: [
          {
            question: 'Wat is de afgeleide van f(x) = x^(3/2) + x^(-1/2)?',
            answer: '(3/2)x^(1/2) - (1/2)x^(-3/2)',
            hint: 'Gebruik de machtsregel ook voor gebroken machten'
          }
        ]
      }
    ]
  }
}

export default function LessonContent({ 
  topic, 
  studentLevel, 
  onComplete, 
  onBack,
  isReview = false
}: LessonContentProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, string>>({})
  const [showHints, setShowHints] = useState<Record<number, boolean>>({})
  const [showSolutions, setShowSolutions] = useState<Record<number, boolean>>({})
  const [tutorOpen, setTutorOpen] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<any>(null)

  const sections = lessonData[topic]?.[studentLevel] || []
  const currentSection = sections[currentSectionIndex]
  const isLastSection = currentSectionIndex === sections.length - 1

  const handleExerciseAnswer = (exerciseIndex: number, answer: string) => {
    setExerciseAnswers(prev => ({
      ...prev,
      [exerciseIndex]: answer
    }))
  }

  const checkAnswer = (exerciseIndex: number, exercise: any) => {
    const userAnswer = exerciseAnswers[exerciseIndex]?.toLowerCase().trim()
    const correctAnswer = exercise.answer.toLowerCase().trim()
    
    if (userAnswer === correctAnswer) {
      // Correct answer - show success feedback
      alert('🎉 Correct! Goed gedaan!')
      return true
    } else if (userAnswer && userAnswer !== correctAnswer) {
      // Wrong answer - open AI tutor
      setCurrentExercise({
        question: exercise.question,
        answer: exercise.answer,
        userAnswer: exerciseAnswers[exerciseIndex] || '',
        topic: topic,
        difficulty: studentLevel
      })
      setTutorOpen(true)
      return false
    }
    return false
  }

  const toggleHint = (exerciseIndex: number) => {
    setShowHints(prev => ({
      ...prev,
      [exerciseIndex]: !prev[exerciseIndex]
    }))
  }

  const toggleSolution = (exerciseIndex: number) => {
    setShowSolutions(prev => ({
      ...prev,
      [exerciseIndex]: !prev[exerciseIndex]
    }))
  }

  const handleNext = () => {
    if (isLastSection) {
      // Calculate score based on correct answers
      let correctAnswers = 0
      let totalExercises = 0
      
      sections.forEach(section => {
        if (section.exercises) {
          section.exercises.forEach((exercise, index) => {
            totalExercises++
            const userAnswer = exerciseAnswers[index]?.toLowerCase().trim()
            const correctAnswer = exercise.answer.toLowerCase().trim()
            if (userAnswer === correctAnswer) {
              correctAnswers++
            }
          })
        }
      })
      
      const score = totalExercises > 0 ? Math.round((correctAnswers / totalExercises) * 100) : 100
      
      // For review sessions, don't add to completed topics again
      if (isReview) {
        alert(`🎉 Herhaling voltooid! Je hebt ${correctAnswers} van ${totalExercises} opgaven correct beantwoord.`)
        onBack() // Just go back to topic selector
      } else {
        onComplete(score)
      }
    } else {
      setCurrentSectionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1)
    }
  }

  const getTopicTitle = (topicId: string): string => {
    const topicTitles: Record<string, string> = {
      'basic-rules': 'Basisregels van Differentiëren',
      'polynomial-functions': 'Polynoomfuncties',
      'trigonometric-functions': 'Goniometrische Functies',
      'exponential-functions': 'Exponentiële en Logaritmische Functies',
      'chain-rule': 'Kettingregel',
      'product-rule': 'Productregel',
      'quotient-rule': 'Quotiëntregel',
      'implicit-differentiation': 'Impliciete Differentiatie'
    }
    return topicTitles[topicId] || topicId
  }

  if (!currentSection) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Les niet beschikbaar
        </h2>
        <p className="text-gray-600 mb-6">
          Deze les is nog niet beschikbaar voor jouw niveau.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Terug naar overzicht
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Terug naar overzicht
            </button>
            
            <div className="text-sm text-gray-500">
              {currentSectionIndex + 1} van {sections.length}
            </div>
          </div>

          {/* Topic Title with Review Indicator */}
          <div className="mb-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-gray-800">
                {getTopicTitle(topic)}
              </h1>
              {isReview && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  🔄 Herhaling
                </span>
              )}
            </div>
            {isReview && (
              <p className="text-sm text-green-600 mt-1">
                Je herhaalt dit onderwerp om je kennis op te frissen!
              </p>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isReview ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${((currentSectionIndex + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center mb-6">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              currentSection.type === 'explanation' ? 'bg-blue-100 text-blue-600' :
              currentSection.type === 'example' ? 'bg-green-100 text-green-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              {currentSection.type === 'explanation' ? '📖' :
               currentSection.type === 'example' ? '💡' : '✏️'}
            </span>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentSection.title}
            </h2>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6 leading-relaxed">
              {currentSection.content}
            </p>

            {/* Examples */}
            {currentSection.examples && (
              <div className="space-y-6">
                {currentSection.examples.map((example, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 mb-3">
                      Voorbeeld {index + 1}: {example.problem}
                    </h4>
                    
                    <div className="bg-white p-4 rounded border mb-4">
                      <p className="font-medium text-gray-800 mb-2">
                        Oplossing: {example.solution}
                      </p>
                      
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-2">Stappen:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          {example.steps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Exercises */}
            {currentSection.exercises && (
              <div className="space-y-6">
                {currentSection.exercises.map((exercise, index) => (
                  <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-800 mb-3">
                      Opgave {index + 1}: {exercise.question}
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={exerciseAnswers[index] || ''}
                          onChange={(e) => handleExerciseAnswer(index, e.target.value)}
                          placeholder="Typ je antwoord hier..."
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              checkAnswer(index, exercise)
                            }
                          }}
                        />
                        <button
                          onClick={() => checkAnswer(index, exercise)}
                          disabled={!exerciseAnswers[index]?.trim()}
                          className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Controleren
                        </button>
                      </div>
                      
                      <div className="flex space-x-3">
                        {exercise.hint && (
                          <button
                            onClick={() => toggleHint(index)}
                            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                          >
                            {showHints[index] ? 'Verberg hint' : 'Toon hint'}
                          </button>
                        )}
                        
                        <button
                          onClick={() => toggleSolution(index)}
                          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          {showSolutions[index] ? 'Verberg oplossing' : 'Toon oplossing'}
                        </button>

                        <button
                          onClick={() => {
                            setCurrentExercise({
                              question: exercise.question,
                              answer: exercise.answer,
                              userAnswer: exerciseAnswers[index] || '',
                              topic: topic,
                              difficulty: studentLevel
                            })
                            setTutorOpen(true)
                          }}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center space-x-1"
                        >
                          <span>🤖</span>
                          <span>Vraag hulp</span>
                        </button>
                      </div>
                      
                      {showHints[index] && exercise.hint && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <p className="text-yellow-800 text-sm">
                            <strong>Hint:</strong> {exercise.hint}
                          </p>
                        </div>
                      )}
                      
                      {showSolutions[index] && (
                        <div className="bg-gray-50 border border-gray-200 rounded p-3">
                          <p className="text-gray-800 text-sm">
                            <strong>Oplossing:</strong> {exercise.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Vorige
            </button>
            
            <button
              onClick={handleNext}
              className={`px-6 py-2 text-white rounded-lg transition-colors ${
                isReview 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLastSection 
                ? (isReview ? 'Herhaling voltooien' : 'Les voltooien') 
                : 'Volgende'
              }
            </button>
          </div>
        </div>
      </div>

      {/* AI Tutor Modal */}
      {currentExercise && (
        <AITutor
          isOpen={tutorOpen}
          onClose={() => setTutorOpen(false)}
          exercise={currentExercise}
          onHintReceived={(hint) => {
            console.log('Hint received:', hint)
          }}
        />
      )}
    </>
  )
}