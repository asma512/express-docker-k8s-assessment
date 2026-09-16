export default function App() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>BookShelf Client</h1>
      <p>This is a simple React front-end that is containerized with a multi-stage Docker build and served by Nginx.</p>
      <ul>
        <li>Frontend: React + Vite</li>
        <li>Backend: Express API</li>
        <li>Database: MongoDB</li>
      </ul>
    </main>
  );
}
