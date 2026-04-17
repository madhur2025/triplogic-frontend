"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter()
  return (
    <div>
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">

          <div className="inline-flex items-center px-4 py-1 rounded-full bg-blue-50 border border-blue-100">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Precision Engine
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight">
            The Intelligence Behind <br />
            <span className="text-blue-600">Every Journey</span>
          </h1>

          <p className="max-w-xl mx-auto text-gray-500 text-base leading-relaxed">
            A smart discovery tool that finds hidden gems near you with high accuracy and builds optimized routes.
          </p>

          <button
            onClick={() => router.push('/places')}
            className="px-8 py-4 bg-black text-white rounded-2xl font-semibold text-sm hover:shadow-xl transition cursor-pointer"
          >
            Explore
          </button>

        </div>
      </section>
    </div>
  );
}
