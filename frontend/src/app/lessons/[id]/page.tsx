'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function LessonView() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchLesson = async () => {
      try {
        const res = await fetch(`http://localhost:3333/api/lessons/${lessonId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Aula não encontrada');
        const data = await res.json();
        setLesson(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, router]);

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3333/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao concluir aula');
      }

      setFeedback(data);
      
      // Atualiza estado local da aula para concluída
      setLesson((prev: any) => ({ ...prev, isCompleted: true }));

      // Atualiza o user no localStorage
      if (data.xpGained > 0 && data.newLevel) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.xp += data.xpGained;
          user.level = data.newLevel;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }

    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando aula...</div>;
  if (error || !lesson) return <div className="p-8 text-center text-red-500">{error || 'Aula não encontrada'}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/lessons" className="text-indigo-600 hover:text-indigo-800 font-medium mb-6 inline-block">
          &larr; Voltar para a Trilha
        </Link>
        
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <header className="mb-10 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider rounded-full">
                {lesson.language}
              </span>
              <span className="text-gray-500 text-sm">Escrito por {lesson.author.name}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{lesson.title}</h1>
            <p className="text-lg text-gray-500">Recompensa: <strong className="text-indigo-600">{lesson.xpReward} XP</strong></p>
          </header>

          <article className="prose prose-indigo prose-lg max-w-none text-gray-700">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </article>

          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center">
            {lesson.isCompleted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 px-8 py-4 rounded-xl text-center w-full">
                <h3 className="text-xl font-bold mb-2">🎉 Aula Concluída!</h3>
                <p>Você já garantiu os pontos de experiência desta aula.</p>
                <Link href="/exercises" className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                  Ir para os Exercícios Práticos
                </Link>
              </div>
            ) : (
              <button
                onClick={handleComplete}
                disabled={submitting}
                className={`w-full md:w-auto px-12 py-4 text-lg font-bold rounded-xl shadow-lg transition-all ${
                  submitting 
                    ? 'bg-gray-400 text-gray-100 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 text-white'
                }`}
              >
                {submitting ? 'Processando...' : `Li e Entendi (+${lesson.xpReward} XP)`}
              </button>
            )}

            {feedback && !lesson.isCompleted && (
              <div className="mt-6 bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-3 rounded-lg w-full text-center font-bold">
                {feedback.message} Você ganhou {feedback.xpGained} XP!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
