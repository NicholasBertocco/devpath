'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export default function CreateExercise() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('EASY');
  const [language, setLanguage] = useState('javascript');
  const [initialCode, setInitialCode] = useState('');
  const [points, setPoints] = useState(10);
  
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: '', expectedOutput: '', isHidden: false }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'STUDENT') {
        router.push('/exercises');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: false }]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      const newTestCases = testCases.filter((_, i) => i !== index);
      setTestCases(newTestCases);
    }
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const newTestCases = [...testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setTestCases(newTestCases);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3333/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          language,
          initialCode,
          points: Number(points),
          testCases
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar exercício');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/exercises');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Criar Novo Exercício</h1>
          <Link href="/exercises" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Voltar
          </Link>
        </div>

        {error && <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded mb-6">{error}</div>}
        {success && <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded mb-6">Exercício criado com sucesso! Redirecionando...</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título do Exercício</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Soma de dois números"
              />
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Enunciado</label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descreva o que o aluno deve fazer..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dificuldade</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                <option value="EASY">Fácil</option>
                <option value="MEDIUM">Médio</option>
                <option value="HARD">Difícil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Linguagem</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">XP (Pontos)</label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={points}
                onChange={e => setPoints(Number(e.target.value))}
              />
            </div>
            
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Código Inicial (Opcional)</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={initialCode}
                onChange={e => setInitialCode(e.target.value)}
                placeholder="function somar(a, b) {&#10;  // seu código aqui&#10;}"
              />
            </div>
          </div>

          <hr className="my-8" />

          {/* Casos de Teste */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Casos de Teste</h2>
              <button
                type="button"
                onClick={addTestCase}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded hover:bg-indigo-200"
              >
                + Adicionar Teste
              </button>
            </div>

            <div className="space-y-4">
              {testCases.map((test, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Entrada (Input)</label>
                        <input
                          type="text"
                          required
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-indigo-500 font-mono text-sm"
                          value={test.input}
                          onChange={e => updateTestCase(index, 'input', e.target.value)}
                          placeholder="Ex: 2, 3"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Saída Esperada</label>
                        <input
                          type="text"
                          required
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-indigo-500 font-mono text-sm"
                          value={test.expectedOutput}
                          onChange={e => updateTestCase(index, 'expectedOutput', e.target.value)}
                          placeholder="Ex: 5"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`hidden-${index}`}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={test.isHidden}
                        onChange={e => updateTestCase(index, 'isHidden', e.target.checked)}
                      />
                      <label htmlFor={`hidden-${index}`} className="ml-2 text-sm text-gray-600">
                        Ocultar este teste do aluno
                      </label>
                    </div>
                  </div>
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remover teste"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Salvando...' : 'Salvar Exercício'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
