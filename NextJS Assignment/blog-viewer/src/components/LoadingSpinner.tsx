export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12" data-testid="loading-spinner">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="ml-3 text-gray-600">Loading posts...</span>
    </div>
  )
}
