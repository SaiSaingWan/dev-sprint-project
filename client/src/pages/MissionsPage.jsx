export default function MissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Scenario Test Catalog</h1>
        <p className="text-slate-400 text-sm mt-1">Select a scenario to launch a timed assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white">Payment Gateway Meltdown</h3>
          <p className="text-slate-400 text-xs mt-2">Intermittent 500 API errors during peak traffic.</p>
          <div className="mt-4 p-3 bg-slate-950 rounded-xl text-slate-400 text-xs">
            [ Scenario details & role selector placeholder - Page 2 detail ]
          </div>
        </div>
      </div>
    </div>
  );
}