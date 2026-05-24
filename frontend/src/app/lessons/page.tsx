'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  language: string;
  xpReward: number;
  authorName: string;
  isCompleted: boolean;
}

export default function LessonsList() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
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

    const fetchLessons = async () => {
      try {
        const res = await fetch('http://localhost:3333/api/lessons', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Falha ao buscar aulas');
        const data = await res.json();
        setLessons(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [router]);

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'logic': return 'Lógica de Programação';
      case 'javascript': return 'JavaScript';
      case 'python': return 'Python';
      default: return lang;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando trilha de aulas...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trilha de Aulas 📚</h1>
          <div className="flex gap-4">
            <Link href="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors">
              Voltar ao Dashboard
            </Link>
            {user?.role !== 'STUDENT' && (
              <Link href="/lessons/create" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition-colors">
                + Nova Aula
              </Link>
            )}
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded mb-6">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.length === 0 && !error ? (
            <div className="col-span-full text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              Nenhuma aula disponível no momento.
            </div>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson.id} className={`p-6 rounded-xl shadow-sm border flex flex-col hover:shadow-md transition-shadow ${lesson.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h2 className={`text-xl font-bold line-clamp-2 ${lesson.isCompleted ? 'text-green-900' : 'text-gray-800'}`}>
                    {lesson.title}
                  </h2>
                  {lesson.isCompleted && (
                    <span className="text-green-600 font-bold" title="Aula Concluída">✓</span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 mb-6 flex-grow space-y-2">
                  <p className="flex justify-between">
                    <span>Módulo:</span>
                    <span className="font-semibold text-gray-900">{getLanguageLabel(lesson.language)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Recompensa:</span>
                    <span className="font-semibold text-indigo-600">+{lesson.xpReward} XP</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Autor:</span>
                    <span className="font-semibold text-gray-900">{lesson.authorName}</span>
                  </p>
                </div>

                <Link 
                  href={`/lessons/${lesson.id}`}
                  className={`w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                    lesson.isCompleted 
                      ? 'bg-green-200 text-green-800 hover:bg-green-300' 
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {lesson.isCompleted ? 'Revisar Aula' : 'Ler Aula'}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
