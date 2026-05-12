import React from 'react';
import { studentAPI, examsAPI, resumeAnalysisAPI } from '../../services/api';

function ExamDesk() {
  // Automated Interview Scheduling
  const handleScheduleInterview = async (exam) => {
    try {
      await Promise.all(
        (submissionsByExam[exam._id] || []).map(sub =>
          interviewAPI.schedule({
            studentId: sub.studentId,
            examId: exam._id,
            date: new Date().toISOString(), // Replace with actual scheduling logic
            interviewer: 'Auto-Assigned',
            location: 'Virtual',
            type: 'Virtual',
          })
        )
      );
      alert('Interviews scheduled for all candidates!');
    } catch (err) {
      alert('Failed to schedule interviews.');
    }
  };
  // Exam creation form state
  const [questions, setQuestions] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [duration, setDuration] = React.useState(60);
  const [newQuestion, setNewQuestion] = React.useState("");
  const [status, setStatus] = React.useState("");
  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, { question: newQuestion }]);
      setNewQuestion("");
    }
  };
  const removeQuestion = idx => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setStatus("");
    try {
      // Convert questions to required format
      const formattedQuestions = questions.map(q =>
        typeof q === 'string' ? { question: q } : q
      );
      await examsAPI.create({ title, description, durationMinutes: duration, questions: formattedQuestions });
      setStatus("Exam created successfully!");
      setTitle("");
      setDescription("");
      setDuration(60);
      setQuestions([]);
    } catch {
      setStatus("Error creating exam.");
    }
  };
  const [students, setStudents] = React.useState([]);
  const [selectedStudentId, setSelectedStudentId] = React.useState('');
  React.useEffect(() => {
    studentAPI.getAll()
      .then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.students)) {
            data = data.students;
          } else {
            data = [];
          }
        }
        setStudents(data);
      })
      .catch(() => setStudents([]));
  }, []);
  const [exams, setExams] = React.useState([]);
  React.useEffect(() => {
    examsAPI.getAll()
      .then(res => {
        let data = res.data;
        if (!Array.isArray(data)) {
          // If response is an object, try to extract array
          if (data && Array.isArray(data.exams)) {
            data = data.exams;
          } else {
            data = [];
          }
        }
        setExams(data);
      })
      .catch(() => setExams([]));
  }, []);
  const [analysisResult, setAnalysisResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [submissionsByExam, setSubmissionsByExam] = React.useState({});
  const handleAnalyzeAnswers = async (examId) => {
    setLoading(true);
    setAnalysisResult(null);
    try {
      // Fetch all student submissions for this exam
      const res = await examsAPI.getAllSubmissions();
      const submissions = Array.isArray(res.data) ? res.data : res.data?.submissions || [];
      // Filter submissions for this exam
      const examSubmissions = submissions.filter(sub => sub.examId === examId);
      // Analyze answers for each student
      const analysisPromises = examSubmissions.map(sub => resumeAnalysisAPI.analyze({ answers: sub.answers, studentId: sub.studentId }));
      const results = await Promise.all(analysisPromises);
      setAnalysisResult(results);
    } catch (err) {
      setAnalysisResult('Error analyzing answers');
    }
    setLoading(false);
  };
  // Fetch all submissions for all exams on mount
  React.useEffect(() => {
    examsAPI.getAllSubmissions()
      .then(res => {
        const submissions = Array.isArray(res.data) ? res.data : res.data?.submissions || [];
        // Group submissions by examId
        const grouped = {};
        submissions.forEach(sub => {
          if (!grouped[sub.examId]) grouped[sub.examId] = [];
          grouped[sub.examId].push(sub);
        });
        setSubmissionsByExam(grouped);
      })
      .catch(() => setSubmissionsByExam({}));
  }, []);
  // Bulk Resume Download & Analysis
  const handleBulkResumeDownload = async () => {
    try {
      const res = await studentAPI.getCsv();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to download resumes.');
    }
  };
  const handleBulkResumeAnalysis = async () => {
    setLoading(true);
    setAnalysisResult(null);
    try {
      const res = await resumeAnalysisAPI.batchAnalyze({ students });
      setAnalysisResult(res.data);
    } catch (err) {
      setAnalysisResult('Error analyzing resumes');
    }
    setLoading(false);
  };
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-blue-400">Exam Desk</h2>
      <p className="text-white text-lg">Conduct exams and analyze answers automatically using AI.</p>
      <div className="flex gap-4 mb-4">
        <button className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition" onClick={handleBulkResumeDownload}>
          Download All Resumes (CSV)
        </button>
        <button className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-800 transition" onClick={handleBulkResumeAnalysis} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze All Resumes'}
        </button>
      </div>
      <div className="bg-slate-800 p-6 rounded-xl mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-white mb-2">Exam Title</label>
            <input
              className="w-full p-3 border border-blue-400 rounded-lg text-white bg-slate-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter exam title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-white mb-2">Exam Description</label>
            <textarea
              className="w-full p-3 border border-blue-400 rounded-lg text-white bg-slate-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter exam description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-white mb-2">Duration (minutes)</label>
            <input
              className="w-full p-3 border border-blue-400 rounded-lg text-white bg-slate-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="number"
              min={10}
              max={180}
              placeholder="Duration (minutes)"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-white mb-2">Questions</label>
            <div className="flex mb-2 gap-2">
              <input
                className="flex-1 p-3 border border-blue-400 rounded-lg text-white bg-slate-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Add a question"
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
              />
              <button type="button" className="px-5 py-2 bg-blue-700 text-white rounded-lg font-bold shadow-sm hover:bg-blue-800 transition" onClick={addQuestion}>
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {questions.map((q, idx) => (
                <li key={idx} className="flex items-center bg-slate-700 border border-blue-400 rounded-lg px-3 py-2">
                  <span className="flex-1 text-white font-medium">{q.question}</span>
                  <button type="button" className="ml-2 text-red-400 font-bold hover:text-red-600" onClick={() => removeQuestion(idx)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button type="submit" className="w-full py-3 bg-green-700 text-white rounded-lg font-bold text-lg shadow-md hover:bg-green-800 transition">
            Create Exam
          </button>
          {status && <div className="mt-2 text-center text-lg text-emerald-400 font-bold">{status}</div>}
        </form>
      </div>
      <div className="mt-8">
        {exams.length === 0 ? (
          <div className="text-gray-300 text-center text-lg mt-8">No exams found. Create an exam to get started.</div>
        ) : (
          <div>
            <table className="w-full text-sm border mt-8">
              <thead>
                <tr className="bg-blue-900 text-blue-200">
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <React.Fragment key={exam._id}>
                    <tr className="border-b text-white">
                      <td className="px-4 py-2 font-semibold">{exam.title}</td>
                      <td className="px-4 py-2">{exam.date || '-'}</td>
                      <td className="px-4 py-2">{exam.status || 'Scheduled'}</td>
                      <td className="px-4 py-2 flex gap-2 items-center">
                        <button className="px-3 py-1 rounded bg-emerald-600 text-white text-xs" onClick={() => handleAnalyzeAnswers(exam._id)} disabled={loading}>
                          {loading ? 'Analyzing...' : 'Analyze Answers'}
                        </button>
                        <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs" onClick={() => handleScheduleInterview(exam)}>
                          Schedule Interviews
                        </button>
                      </td>
                    </tr>
                    {/* Render submitted answers and marks for this exam */}
                    {submissionsByExam[exam._id] && submissionsByExam[exam._id].length > 0 && (
                      <tr>
                        <td colSpan={4} className="bg-slate-900 p-4">
                          <div className="text-lg font-bold text-blue-300 mb-2">Submitted Answers & Marks</div>
                          <table className="w-full text-xs border">
                            <thead>
                              <tr className="bg-blue-800 text-blue-100">
                                <th className="px-2 py-1">Student ID</th>
                                <th className="px-2 py-1">Answers</th>
                                <th className="px-2 py-1">Score</th>
                                <th className="px-2 py-1">Result</th>
                                <th className="px-2 py-1">Feedback</th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissionsByExam[exam._id].map((sub, idx) => (
                                <tr key={sub._id || idx} className="border-b border-slate-700">
                                  <td className="px-2 py-1">{sub.studentId}</td>
                                  <td className="px-2 py-1 whitespace-pre-wrap max-w-xs">{Array.isArray(sub.answers) ? sub.answers.map((a, i) => (<div key={i}>{a}</div>)) : sub.answers}</td>
                                  <td className="px-2 py-1">{sub.score ?? 'N/A'}</td>
                                  <td className="px-2 py-1">{sub.result ?? '-'}</td>
                                  <td className="px-2 py-1">{sub.feedback ?? '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {analysisResult && (
        <div className="mt-8 bg-slate-800 p-6 rounded-xl text-white">
          <h3 className="text-xl font-bold mb-4">Analysis Results</h3>
          {typeof analysisResult === 'string' ? (
            <div>{analysisResult}</div>
          ) : (
            <ul className="space-y-2">
              {analysisResult.map((result, idx) => (
                <li key={idx} className="border-b border-slate-700 pb-2">
                  Student {result?.data?.studentId || idx}: Score {result?.data?.score || 'N/A'}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ExamDesk;
