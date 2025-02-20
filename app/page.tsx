export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-3xl font-bold">Report Management System</h1>

      <div className="flex gap-6 flex-col sm:flex-row">
        <a
          href="reports/create"
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center min-w-[200px]"
        >
          Create Reports
        </a>

        <a
          href="reports/manage"
          className="px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center min-w-[200px]"
        >
          Manage Reports
        </a>
      </div>
    </div>
  );
}
