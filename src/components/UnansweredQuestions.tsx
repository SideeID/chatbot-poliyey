import React, { useEffect, useState } from 'react';

interface Question {
  _id: string;
  content: string;
  timestamp: string;
}

export function UnansweredQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    async function fetchUnansweredQuestions() {
      const response = await fetch('/api/questions?answered=false');
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data);
      }
    }

    fetchUnansweredQuestions();
  }, []);

  return (
    <div className='mt-8'>
      <h2 className='text-xl font-bold mb-4'>Pertanyaan yang Belum Terjawab</h2>
      {questions.length === 0 ? (
        <p>Tidak ada pertanyaan yang belum terjawab saat ini.</p>
      ) : (
        <ul className='space-y-2'>
          {questions.map((question) => (
            <li key={question._id} className='border p-2 rounded'>
              <p>{question.content}</p>
              <p className='text-sm text-gray-500'>
                {new Date(question.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
