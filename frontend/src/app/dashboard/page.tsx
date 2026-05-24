'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    // Busca as conquistas (badges) do usuário
    const fetchBadges = async () => {
      try {
        const res = await fetch('http://localhost:3333/api/badges', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBadges(data);
        }
      } catch (err) {
        console.error("Erro ao carregar badges", err);
      }
    };

    fetchBadges();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div className="p-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex gap-4">
            <Link 
              href="/lessons" 
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
            >
              Aulas 📚
            </Link>
            <Link 
              href="/leaderboard" 
              className="px-4 py-2 bg-yellow-500 text-yellow-900 font-bold rounded hover:bg-yellow-400 transition-colors"
            >
              Ranking 🏆
            </Link>
            <Link 
              href="/exercises" 
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition-colors"
            >
              Ver Exercícios
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-indigo-900">Bem-vindo, {user.name}!</h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <div className="text-sm text-gray-500">Nível</div>
              <div className="text-2xl font-bold text-indigo-600">{user.level}</div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <div className="text-sm text-gray-500">XP Total</div>
              <div className="text-2xl font-bold text-indigo-600">{user.xp}</div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <div className="text-sm text-gray-500">Perfil</div>
              <div className="text-lg font-bold text-indigo-600 mt-1">{user.role}</div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Minhas Conquistas 🎖️</h2>
          {badges.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 text-center text-gray-500">
              Você ainda não possui conquistas. Resolva desafios para ganhar!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-2">{badge.imageUrl || '🏅'}</div>
                  <h3 className="font-bold text-gray-800 text-sm">{badge.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
