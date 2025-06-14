'use client'

import { StudentProgress } from './DifferentiationApp'

interface ProgressTrackerProps {
  progress: StudentProgress
  onReset: () => void
}

export default function ProgressTracker({ progress, onReset }: ProgressTrackerProps) {
  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'advanced': return 'text-purple-600 bg-purple-100'
      case 'intermediate': return 'text-blue-600 bg-blue-100'
      case 'beginner': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getLevelText = (level?: string) => {
    switch (level) {
      case 'advanced': return 'Gevorderd'
      case 'intermediate': return 'Gemiddeld'
      case 'beginner': return 'Beginner'
      default: return 'Onbekend'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
            📊
          </span>
          Jouw Voortgang
        </h2>
        
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          title="Reset alle voortgang"
        >
          🔄 Opnieuw beginnen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Current Phase */}
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">
              {progress.currentPhase === 'assessment' ? '🧪' : '📚'}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Huidige Fase</h3>
          <p className="text-blue-600 text-xs">
            {progress.currentPhase === 'assessment' ? 'Niveau bepaling' : 'Leren'}
          </p>
        </div>

        {/* Level */}
        {progress.assessmentResult && (
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
              getLevelColor(progress.assessmentResult.level)
            }`}>
              <span className="text-xl">
                {progress.assessmentResult.level === 'advanced' ? '🏆' :
                 progress.assessmentResult.level === 'intermediate' ? '📈' : '🌱'}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Niveau</h3>
            <p className={`text-xs ${getLevelColor(progress.assessmentResult.level).split(' ')[0]}`}>
              {getLevelText(progress.assessmentResult.level)}
            </p>
          </div>
        )}

        {/* Completed Topics */}
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">✅</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Voltooid</h3>
          <p className="text-green-600 text-xs">
            {progress.completedTopics.length} onderwerpen
          </p>
        </div>

        {/* Total Score */}
        <div className="text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🎯</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Totaalscore</h3>
          <p className="text-yellow-600 text-xs">
            {progress.totalScore} punten
          </p>
        </div>
      </div>
    </div>
  )
}