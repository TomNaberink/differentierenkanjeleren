'use client'

import { AssessmentResult, StudentLevel } from './DifferentiationApp'

interface Topic {
  id: string
  title: string
  description: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  prerequisites: string[]
  estimatedTime: string
  icon: string
}

const allTopics: Topic[] = [
  {
    id: 'basic-rules',
    title: 'Basisregels van Differentiëren',
    description: 'Leer de fundamentele regels: machtsregel, constante regel en somregel',
    difficulty: 'basic',
    prerequisites: [],
    estimatedTime: '20 min',
    icon: '📐'
  },
  {
    id: 'polynomial-functions',
    title: 'Polynoomfuncties',
    description: 'Differentiëren van polynomen van verschillende graden',
    difficulty: 'basic',
    prerequisites: ['basic-rules'],
    estimatedTime: '25 min',
    icon: '📈'
  },
  {
    id: 'trigonometric-functions',
    title: 'Goniometrische Functies',
    description: 'Afgeleiden van sin(x), cos(x), tan(x) en hun varianten',
    difficulty: 'intermediate',
    prerequisites: ['basic-rules'],
    estimatedTime: '30 min',
    icon: '🌊'
  },
  {
    id: 'exponential-functions',
    title: 'Exponentiële en Logaritmische Functies',
    description: 'Differentiëren van e^x, a^x, ln(x) en log(x)',
    difficulty: 'intermediate',
    prerequisites: ['basic-rules'],
    estimatedTime: '25 min',
    icon: '📊'
  },
  {
    id: 'chain-rule',
    title: 'Kettingregel',
    description: 'Samengestelde functies differentiëren met de kettingregel',
    difficulty: 'advanced',
    prerequisites: ['basic-rules', 'polynomial-functions'],
    estimatedTime: '35 min',
    icon: '🔗'
  },
  {
    id: 'product-rule',
    title: 'Productregel',
    description: 'Differentiëren van producten van functies',
    difficulty: 'advanced',
    prerequisites: ['basic-rules', 'polynomial-functions'],
    estimatedTime: '30 min',
    icon: '✖️'
  },
  {
    id: 'quotient-rule',
    title: 'Quotiëntregel',
    description: 'Differentiëren van quotiënten van functies',
    difficulty: 'advanced',
    prerequisites: ['basic-rules', 'product-rule'],
    estimatedTime: '30 min',
    icon: '➗'
  },
  {
    id: 'implicit-differentiation',
    title: 'Impliciete Differentiatie',
    description: 'Differentiëren van impliciete functies',
    difficulty: 'advanced',
    prerequisites: ['chain-rule', 'product-rule'],
    estimatedTime: '40 min',
    icon: '🔄'
  }
]

interface TopicSelectorProps {
  assessmentResult: AssessmentResult
  completedTopics: string[]
  onTopicSelect: (topicId: string) => void
}

export default function TopicSelector({ 
  assessmentResult, 
  completedTopics, 
  onTopicSelect 
}: TopicSelectorProps) {
  
  const getRecommendedTopics = (): Topic[] => {
    // Filter topics based on student level and completed topics
    let recommendedTopics = allTopics.filter(topic => {
      // Check if topic is already completed
      if (completedTopics.includes(topic.id)) return false
      
      // Check prerequisites
      const hasPrerequisites = topic.prerequisites.every(prereq => 
        completedTopics.includes(prereq) || assessmentResult.strengths.includes(prereq)
      )
      if (!hasPrerequisites) return false
      
      // Filter by difficulty based on student level
      if (assessmentResult.level === 'beginner') {
        return topic.difficulty === 'basic'
      } else if (assessmentResult.level === 'intermediate') {
        return topic.difficulty === 'basic' || topic.difficulty === 'intermediate'
      } else {
        return true // Advanced students can access all topics
      }
    })

    // Prioritize topics that address weaknesses
    recommendedTopics.sort((a, b) => {
      const aAddressesWeakness = assessmentResult.weaknesses.some(weakness => 
        a.title.toLowerCase().includes(weakness.toLowerCase()) ||
        a.description.toLowerCase().includes(weakness.toLowerCase())
      )
      const bAddressesWeakness = assessmentResult.weaknesses.some(weakness => 
        b.title.toLowerCase().includes(weakness.toLowerCase()) ||
        b.description.toLowerCase().includes(weakness.toLowerCase())
      )
      
      if (aAddressesWeakness && !bAddressesWeakness) return -1
      if (!aAddressesWeakness && bAddressesWeakness) return 1
      return 0
    })

    return recommendedTopics
  }

  const recommendedTopics = getRecommendedTopics()
  const otherTopics = allTopics.filter(topic => 
    !recommendedTopics.includes(topic) && !completedTopics.includes(topic.id)
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'Basis'
      case 'intermediate': return 'Gemiddeld'
      case 'advanced': return 'Gevorderd'
      default: return difficulty
    }
  }

  const isTopicAvailable = (topic: Topic): boolean => {
    return topic.prerequisites.every(prereq => 
      completedTopics.includes(prereq) || assessmentResult.strengths.includes(prereq)
    )
  }

  const TopicCard = ({ topic, isRecommended = false, isCompleted = false }: { 
    topic: Topic, 
    isRecommended?: boolean,
    isCompleted?: boolean 
  }) => {
    const available = isTopicAvailable(topic)
    
    return (
      <div
        className={`relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
          isCompleted 
            ? 'bg-green-50 border-green-300 hover:border-green-400 hover:shadow-lg' 
            : available
              ? isRecommended
                ? 'bg-blue-50 border-blue-300 hover:border-blue-400 hover:shadow-lg'
                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
        }`}
        onClick={() => (available || isCompleted) && onTopicSelect(topic.id)}
      >
        {isRecommended && !isCompleted && (
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            Aanbevolen
          </div>
        )}
        
        {isCompleted && (
          <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
            <span>✓</span>
            <span>Voltooid</span>
          </div>
        )}

        <div className="flex items-start space-x-4">
          <div className="text-3xl">{topic.icon}</div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`font-semibold ${
                isCompleted ? 'text-green-800' : available ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {topic.title}
              </h3>
              <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(topic.difficulty)}`}>
                {getDifficultyText(topic.difficulty)}
              </span>
            </div>
            
            <p className={`text-sm mb-3 ${
              isCompleted ? 'text-green-600' : available ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {topic.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs ${
                isCompleted ? 'text-green-500' : available ? 'text-gray-500' : 'text-gray-400'
              }`}>
                ⏱️ {topic.estimatedTime}
              </span>
              
              {isCompleted && (
                <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                  🔄 Herhalen
                </span>
              )}
              
              {!available && !isCompleted && topic.prerequisites.length > 0 && (
                <span className="text-xs text-gray-400">
                  Vereist: {topic.prerequisites.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Recommended Topics */}
      {recommendedTopics.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              🎯
            </span>
            Aanbevolen voor jou
          </h2>
          <p className="text-gray-600 mb-6">
            Deze onderwerpen passen perfect bij jouw huidige niveau en helpen je verder te groeien.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} isRecommended={true} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Topics - Now Clickable for Review */}
      {completedTopics.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              ✅
            </span>
            Voltooide onderwerpen
          </h2>
          <p className="text-gray-600 mb-6">
            Goed gedaan! Deze onderwerpen heb je al succesvol afgerond. 
            <span className="font-medium text-green-700"> Klik op een onderwerp om het te herhalen.</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allTopics
              .filter(topic => completedTopics.includes(topic.id))
              .map(topic => (
                <TopicCard key={topic.id} topic={topic} isCompleted={true} />
              ))}
          </div>
        </div>
      )}

      {/* Other Topics */}
      {otherTopics.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              📚
            </span>
            Andere onderwerpen
          </h2>
          <p className="text-gray-600 mb-6">
            Deze onderwerpen worden beschikbaar zodra je de vereiste onderwerpen hebt voltooid.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}