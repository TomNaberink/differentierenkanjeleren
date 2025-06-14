'use client'

import { useState } from 'react'
import { AssessmentResult } from './DifferentiationApp'
import TopicSelector from './TopicSelector'
import LessonContent from './LessonContent'

interface LearningPhaseProps {
  assessmentResult: AssessmentResult
  completedTopics: string[]
  onTopicComplete: (topic: string, score: number) => void
}

export default function LearningPhase({ 
  assessmentResult, 
  completedTopics, 
  onTopicComplete 
}: LearningPhaseProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  if (!selectedTopic) {
    return (
      <div className="space-y-6">
        {/* Assessment Results Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Jouw Leerresultaten
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Level */}
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                assessmentResult.level === 'advanced' ? 'bg-purple-100' :
                assessmentResult.level === 'intermediate' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                <span className="text-2xl">
                  {assessmentResult.level === 'advanced' ? '🏆' :
                   assessmentResult.level === 'intermediate' ? '📈' : '🌱'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800">Jouw Niveau</h3>
              <p className={`text-sm ${
                assessmentResult.level === 'advanced' ? 'text-purple-600' :
                assessmentResult.level === 'intermediate' ? 'text-blue-600' : 'text-green-600'
              }`}>
                {assessmentResult.level === 'advanced' ? 'Gevorderd' :
                 assessmentResult.level === 'intermediate' ? 'Gemiddeld' : 'Beginner'}
              </p>
            </div>

            {/* Score */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-800">Score</h3>
              <p className="text-sm text-yellow-600">
                {assessmentResult.score} van {assessmentResult.totalQuestions} correct
              </p>
            </div>

            {/* Progress */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-800">Voortgang</h3>
              <p className="text-sm text-indigo-600">
                {completedTopics.length} onderwerpen voltooid
              </p>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {assessmentResult.strengths.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sterke punten
                </h4>
                <ul className="text-green-700 text-sm space-y-1">
                  {assessmentResult.strengths.map((strength, index) => (
                    <li key={index}>• {strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {assessmentResult.weaknesses.length > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Verbeterpunten
                </h4>
                <ul className="text-orange-700 text-sm space-y-1">
                  {assessmentResult.weaknesses.map((weakness, index) => (
                    <li key={index}>• {weakness}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Topic Selection */}
        <TopicSelector
          assessmentResult={assessmentResult}
          completedTopics={completedTopics}
          onTopicSelect={setSelectedTopic}
        />
      </div>
    )
  }

  // Check if this is a completed topic (review mode)
  const isReviewMode = completedTopics.includes(selectedTopic)

  return (
    <LessonContent
      topic={selectedTopic}
      studentLevel={assessmentResult.level}
      isReview={isReviewMode}
      onComplete={(score) => {
        if (!isReviewMode) {
          // Only add to completed topics if it's not already completed
          onTopicComplete(selectedTopic, score)
        }
        setSelectedTopic(null)
      }}
      onBack={() => setSelectedTopic(null)}
    />
  )
}