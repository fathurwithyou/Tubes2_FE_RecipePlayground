import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="animated-background"></div>
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'white', textAlign: 'center', padding: '0 20px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '20px', textShadow: '0 0 10px rgba(0,0,0,0.7)' }}>
          Welcome to Recipe Playground
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '40px', textShadow: '0 0 8px rgba(0,0,0,0.6)' }}>
          Find recipes to create elements using BFS or DFS algorithms.
        </p>
        <Link href="/search">
          <button style={{ padding: '15px 30px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            Start Finding Recipes
          </button>
        </Link>
      </main>
    </>
  );
}
