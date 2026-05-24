'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateLesson() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('logic');
  const [xpReward, setXpReward] = useState(50);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'STUDENT') {
        router.push('/lessons');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3333/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          language,
          xpReward: Number(xpReward)
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar aula');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/lessons');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Criar Nova Aula Escrita</h1>
          <Link href="/lessons" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Voltar
          </Link>
        </div>

        {error && <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded mb-6">{error}</div>}
        {success && <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded mb-6">Aula criada com sucesso! Redirecionando...</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título da Aula</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Introdução à Lógica de Programação"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Módulo / Linguagem</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="logic">Lógica de Programação (Teoria)</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">XP (Recompensa)</label>
              <input
                type="number"
                min="10"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={xpReward}
                onChange={e => setXpReward(Number(e.target.value))}
              />
            </div>
            
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo da Aula (Suporta Markdown)</label>
              <p className="text-xs text-gray-500 mb-2">Escreva o texto explicativo, use ## para subtítulos e \`\`\` para blocos de código.</p>
              <textarea
                required
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="# Bem-vindo à aula...&#10;&#10;Aqui você aprenderá sobre variáveis..."
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Salvando...' : 'Publicar Aula'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
