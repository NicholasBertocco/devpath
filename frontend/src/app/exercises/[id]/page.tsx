'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Editor from '@monaco-editor/react';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  language: string;
  initialCode: string;
  points: number;
  author: { name: string };
  testCases: TestCase[];
}

export default function SolveExercise() {
  const router = useRouter();
  const params = useParams();
  const exerciseId = params.id as string;

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [code, setCode] = useState('');
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

    const fetchExercise = async () => {
      try {
        const res = await fetch(`http://localhost:3333/api/exercises/${exerciseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Exercício não encontrado ou erro no servidor');
        }

        const data = await res.json();
        setExercise(data);
        setCode(data.initialCode || '');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId, router]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRunCode = async () => {
    setSubmitting(true);
    setFeedback(null);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3333/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          exerciseId,
          code
        })
      });

      const data = await res.json();
      setFeedback(data);
      
      // Se ganhou XP, atualiza o localStorage silenciosamente para refletir no Dashboard
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
      alert(err.message || 'Erro ao executar o código.');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando exercício...</div>;

  if (error || !exercise) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Exercício não encontrado'}</h2>
        <Link href="/exercises" className="text-indigo-600 hover:underline">Voltar para a lista</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/exercises" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            &larr; Voltar
          </Link>
          <h1 className="text-xl font-bold">{exercise.title}</h1>
          <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Recompensa: <strong className="text-indigo-400">{exercise.points} XP</strong></span>
          <button 
            onClick={handleRunCode}
            disabled={submitting}
            className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-lg transition-colors flex items-center gap-2 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Executando...' : '▶ Executar Código'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Description & Test Cases */}
        <div className="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-gray-100">Enunciado</h2>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {exercise.description}
            </div>
            <p className="mt-6 text-xs text-gray-500">
              Criado por: {exercise.author.name}
            </p>
          </div>
          
          <div className="p-6 flex-1">
            <h2 className="text-lg font-bold mb-4 text-gray-100">Casos de Teste Visíveis</h2>
            <div className="space-y-4">
              {exercise.testCases.map((tc, index) => (
                <div key={tc.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Entrada:</span>
                    <div className="font-mono text-sm text-indigo-300 mt-1">{tc.input}</div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Saída Esperada:</span>
                    <div className="font-mono text-sm text-green-400 mt-1">
                      {tc.isHidden ? (
                        <span className="italic text-gray-500">[Teste Oculto - Avaliado apenas na submissão]</span>
                      ) : (
                        tc.expectedOutput
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Code Editor & Feedback */}
        <div className="w-2/3 flex flex-col relative">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-300 uppercase">{exercise.language}</span>
            <button 
              onClick={() => setCode(exercise.initialCode)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Resetar Código
            </button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={exercise.language === 'javascript' ? 'javascript' : 'python'}
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Feedback Panel (Shows after execution) */}
          {feedback && (
            <div className={`absolute bottom-0 left-0 right-0 p-6 border-t ${
              feedback.status === 'SUCCESS' ? 'bg-green-900 border-green-700' : 'bg-red-900 border-red-700'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xl font-bold ${feedback.status === 'SUCCESS' ? 'text-green-300' : 'text-red-300'}`}>
                  {feedback.status === 'SUCCESS' ? 'Sucesso!' : 'Falha nos Testes'}
                </h3>
                <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-white">&times;</button>
              </div>
              <p className="text-gray-100 font-medium mb-4">{feedback.message}</p>
              
              {feedback.xpGained > 0 && (
                <div className="mb-4 inline-block bg-yellow-500 text-yellow-900 font-bold px-3 py-1 rounded-full text-sm">
                  + {feedback.xpGained} XP Adquiridos! (Nível Atual: {feedback.newLevel})
                </div>
              )}

              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {feedback.details && feedback.details.map((detail: any, i: number) => (
                  <div key={i} className={`p-3 rounded text-sm font-mono border ${detail.passed ? 'bg-green-950 border-green-800' : 'bg-red-950 border-red-800'}`}>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-gray-300">Caso de Teste {i + 1}</span>
                      <span className={detail.passed ? 'text-green-400' : 'text-red-400'}>
                        {detail.passed ? '✓ PASSOU' : '✗ FALHOU'}
                      </span>
                    </div>
                    {detail.error ? (
                      <div className="text-red-300 mt-2 whitespace-pre-wrap">{detail.error}</div>
                    ) : (
                      <>
                        <div className="text-gray-400">Entrada: <span className="text-gray-200">{detail.input}</span></div>
                        <div className="text-gray-400">Esperado: <span className="text-green-300">{detail.expected}</span></div>
                        <div className="text-gray-400">Sua Saída: <span className={detail.passed ? 'text-green-300' : 'text-red-300'}>{detail.actual}</span></div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
