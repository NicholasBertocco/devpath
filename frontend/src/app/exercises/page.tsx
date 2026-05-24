'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Exercise {
  id: string;
  title: string;
  difficulty: string;
  language: string;
  points: number;
  author: { name: string };
}

export default function ExercisesList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));

    const fetchExercises = async () => {
      try {
        const res = await fetch('http://localhost:3333/api/exercises', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Falha ao buscar exercícios');
        const data = await res.json();
        setExercises(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [router]);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'EASY': return 'Fácil';
      case 'MEDIUM': return 'Médio';
      case 'HARD': return 'Difícil';
      default: return diff;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando exercícios...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Desafios de Programação</h1>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors">
              Voltar ao Dashboard
            </Link>
            {user?.role !== 'STUDENT' && (
              <Link href="/exercises/create" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition-colors">
                + Novo Exercício
              </Link>
            )}
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded mb-6">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.length === 0 && !error ? (
            <div className="col-span-full text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              Nenhum exercício disponível no momento.
            </div>
          ) : (
            exercises.map((ex) => (
              <div key={ex.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-2">{ex.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${getDifficultyColor(ex.difficulty)}`}>
                    {getDifficultyLabel(ex.difficulty)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-6 flex-grow space-y-2">
                  <p className="flex justify-between">
                    <span>Linguagem:</span>
                    <span className="font-semibold text-gray-900 uppercase">{ex.language}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Recompensa:</span>
                    <span className="font-semibold text-indigo-600">{ex.points} XP</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Criado por:</span>
                    <span className="font-semibold text-gray-900">{ex.author.name}</span>
                  </p>
                </div>

                <Link 
                  href={`/exercises/${ex.id}`}
                  className="w-full text-center py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-semibold transition-colors"
                >
                  Resolver Desafio
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
