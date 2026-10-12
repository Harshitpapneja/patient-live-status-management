import './index.css';

export default function App() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-600">Live Operations</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Patient Live Status Management</h1>
          </div>
          <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            System online
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Total Patients', value: '324', tone: 'bg-blue-100 text-blue-700' },
            { label: 'In Consultation', value: '42', tone: 'bg-amber-100 text-amber-700' },
            { label: 'Critical Alerts', value: '7', tone: 'bg-rose-100 text-rose-700' },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">{card.label}</p>
              <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${card.tone}`}>
                {card.value}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Patient Queue</h2>
              <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700">
                Update Status
              </button>
            </div>

            <div className="space-y-3">
              {[
                ['P-1031', 'Ava Patel', 'Critical', 'ICU'],
                ['P-2044', 'Lucas Brown', 'In Consultation', 'Ward A'],
                ['P-4410', 'Sofia Nguyen', 'Waiting', 'Reception'],
                ['P-1938', 'Daniel Kim', 'Discharged', 'Ward C'],
              ].map(([id, name, status, location]) => (
                <div key={id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{name}</p>
                    <p className="text-sm text-slate-500">{id} • {location}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    status === 'Critical'
                      ? 'bg-rose-100 text-rose-700'
                      : status === 'In Consultation'
                        ? 'bg-amber-100 text-amber-700'
                        : status === 'Waiting'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
            <h2 className="text-xl font-bold">Department Summary</h2>
            <div className="mt-6 space-y-4">
              {[
                ['Emergency', '14 active'],
                ['Ward A', '28 active'],
                ['Ward B', '19 active'],
                ['ICU', '6 critical'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-slate-800 p-3">
                  <span>{label}</span>
                  <span className="font-semibold text-sky-300">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
