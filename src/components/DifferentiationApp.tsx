'use client'

import { useState, useEffect } from 'react'
import AssessmentPhase from './AssessmentPhase'
import LearningPhase from './LearningPhase'
import ProgressTracker from './ProgressTracker'

export type StudentLevel = 'beginner' | 'intermediate' | 'advanced'

export interface AssessmentResult {
  level: StudentLevel
  strengths: string[]
  weaknesses: string[]
  score: number
  totalQuestions: number
}

export interface StudentProgress {
  currentPhase: 'assessment' | 'learning'
  assessmentResult?: AssessmentResult
  completedTopics: string[]
  currentTopic?: string
  totalScore: number
}

export default function DifferentiationApp() {
  const [progress, setProgress] = useState<StudentProgress>({
    currentPhase: 'assessment',
    completedTopics: [],
    totalScore: 0
  })

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('math-differentiation-progress')
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setProgress(parsed)
      } catch (error) {
        console.error('Error loading progress:', error)
      }
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('math-differentiation-progress', JSON.stringify(progress))
  }, [progress])

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setProgress(prev => ({
      ...prev,
      currentPhase: 'learning',
      assessmentResult: result
    }))
  }

  const handleTopicComplete = (topic: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      completedTopics: [...prev.completedTopics, topic],
      totalScore: prev.totalScore + score
    }))
  }

  const resetProgress = () => {
    setProgress({
      currentPhase: 'assessment',
      completedTopics: [],
      totalScore: 0
    })
    localStorage.removeItem('math-differentiation-progress')
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Tracker */}
      <ProgressTracker 
        progress={progress} 
        onReset={resetProgress}
      />

      {/* Main Content */}
      <div className="mt-8">
        {progress.currentPhase === 'assessment' ? (
          <AssessmentPhase onComplete={handleAssessmentComplete} />
        ) : (
          <LearningPhase 
            assessmentResult={progress.assessmentResult!}
            completedTopics={progress.completedTopics}
            onTopicComplete={handleTopicComplete}
          />
        )}
      </div>
    </div>
  )
}