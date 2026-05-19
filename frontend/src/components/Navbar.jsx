function Navbar() {
  return (
  <nav className="bg-blue-600 text-white px-8 py-4 shadow-lg flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-white text-blue-600 font-bold rounded-full w-10 h-10 flex items-center justify-center">
          GT
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            Goal Tracker Portal
          </h1>

          <p className="text-sm text-blue-100">
            Performance Management System
          </p>
        </div>
      </div>

      <div className="text-sm text-blue-100">
        Employee • Manager • Admin
      </div>
    </nav>
  );
}

export default Navbar;