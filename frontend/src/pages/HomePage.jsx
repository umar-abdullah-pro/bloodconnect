import { FiArrowRight, FiMapPin, FiShield, FiUsers } from "react-icons/fi";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/">
            <img
              src="/assets/logo.png"
              alt="BloodConnect"
              className="h-10 w-auto"
            />
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Sign In
            </a>

            <a
              href="/register"
              className="rounded-xl bg-[#b4232c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#991b1b]"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-[#b4232c]">
              <span className="h-2 w-2 rounded-full bg-[#b4232c]" />
              Connecting people when blood is needed
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find the right blood donor,
              <span className="text-[#b4232c]"> when it matters.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
              BloodConnect helps people find compatible, nearby blood donors and
              connect with them securely when help is needed.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-[#b4232c] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#991b1b]"
              >
                Get Started
                <FiArrowRight size={17} />
              </a>

              <a
                href="/register"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Become a Donor
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span>✓ Compatibility-based matching</span>
              <span>✓ Nearby donors</span>
              <span>✓ Consent-based contact</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Blood request
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-900">
                      O+ blood needed
                    </h2>
                  </div>

                  <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-[#b4232c]">
                    Urgent
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 font-semibold text-[#b4232c]">
                      O+
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Compatible donor
                      </p>
                      <p className="mt-1 text-xs text-slate-500">2.4 km away</p>
                    </div>

                    <span className="text-xs font-medium text-emerald-600">
                      Available
                    </span>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 font-semibold text-[#b4232c]">
                      O−
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Compatible donor
                      </p>
                      <p className="mt-1 text-xs text-slate-500">4.8 km away</p>
                    </div>

                    <span className="text-xs font-medium text-emerald-600">
                      Available
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-100 p-4">
                  <FiShield className="text-[#b4232c]" size={18} />
                  <p className="text-xs leading-5 text-slate-500">
                    Donor contact details are shared only after the donor
                    accepts the request.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#b4232c]">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Getting help should be simple.
            </h2>
            <p className="mt-3 text-slate-500">
              BloodConnect brings the request, matching and donor connection
              into one simple flow.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#b4232c]">
                <FiUsers size={20} />
              </div>

              <p className="mt-6 text-sm font-medium text-slate-400">01</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Create a request
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Share your blood group, location and how urgently blood is
                needed.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#b4232c]">
                <FiMapPin size={20} />
              </div>

              <p className="mt-6 text-sm font-medium text-slate-400">02</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Find compatible donors
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                See available compatible donors ranked using location and
                donation history.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#b4232c]">
                <FiShield size={20} />
              </div>

              <p className="mt-6 text-sm font-medium text-slate-400">03</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Connect with consent
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Request contact from a donor. Their contact details are shared
                only after they accept.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why BloodConnect */}
      <section className="border-y border-slate-200 bg-white px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium text-[#b4232c]">
              Built for real connections
            </p>

            <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight text-slate-900">
              More than a blood request form.
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-slate-500">
              BloodConnect focuses on helping people find human donors nearby,
              while keeping donor contact information private until consent is
              given.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">
                Compatibility first
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Matching starts with compatible blood groups.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">Nearby donors</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Location helps identify donors who may be close enough to help.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">
                Donor availability
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Donors can control whether they are currently available.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">
                Privacy by consent
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Contact information stays private until a donor accepts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
          <p className="text-sm font-medium text-[#b4232c]">BloodConnect</p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Someone may need your help today.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Create an account to request blood or make yourself available as a
            donor.
          </p>

          <a
            href="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#b4232c] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#991b1b]"
          >
            Get Started
            <FiArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BloodConnect</p>
          <p>Connecting donors with people who need them.</p>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
