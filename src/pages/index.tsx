import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      <h1>Zippia test</h1>
      <Link
        href="/test/jobs"
        className="flex items-center mt-4 bg-gray-700  text-white uppercase p-4 rounded font-bold text-sm"
      >
        Go to jobs list
      </Link>
    </div>
  )
}
