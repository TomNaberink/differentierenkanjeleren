import DifferentiationApp from '@/components/DifferentiationApp'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Differentiëren Leren
          </h1>
          
          <p className="text-xl text-blue-700 font-medium mb-6">
            Adaptieve wiskundelessen voor Havo 5 - Op jouw niveau!
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
            <p className="text-gray-600">
              Deze app past zich aan jouw wiskundeniveau aan. We beginnen met een paar oefeningen om te zien wat je al kunt, 
              en geven je daarna uitleg en opgaven die perfect bij jouw niveau passen.
            </p>
          </div>
        </div>

        {/* Main App */}
        <DifferentiationApp />
      </div>
    </div>
  )
}