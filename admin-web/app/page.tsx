export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Yad2 Tracker Admin</h1>
        <p className="text-gray-600 mb-8">Welcome to the admin panel</p>
        <div className="space-y-4">
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </a>
          <br />
          <a 
            href="/dashboard" 
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
