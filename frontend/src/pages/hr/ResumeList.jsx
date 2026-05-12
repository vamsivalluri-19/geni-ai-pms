import React, { useEffect, useState } from 'react';
import { Download, Eye, CheckCircle, XCircle, Users } from 'lucide-react';
import { studentAPI, interviewAPI } from '../../services/api';

const ResumeList = ({ onAction }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResumes() {
      setLoading(true);
      setError('');
      try {
        const res = await studentAPI.getAll();
        setResumes(res.data.students || []);
      } catch (err) {
        setError('Failed to load resumes');
      } finally {
        setLoading(false);
      }
    }
    fetchResumes();
  }, []);

  const handleDownload = (resumeUrl, name) => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `Resume_${name}.pdf`;
    link.click();
  };

  const handleAction = async (student, action) => {
    if (onAction) onAction(student, action);
    // Optionally: call backend to update status
  };

  if (loading) return <div>Loading resumes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold mb-4">Student Resumes</h3>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-slate-100">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Resume</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resumes.filter(s => s.resume).map(student => (
            <tr key={student._id} className="border-b">
              <td className="px-4 py-2 font-semibold">{student.name}</td>
              <td className="px-4 py-2">{student.email}</td>
              <td className="px-4 py-2">
                <button onClick={() => handleDownload(student.resume, student.name)} className="px-2 py-1 bg-blue-600 text-white rounded flex items-center gap-1">
                  <Download size={14} /> Download
                </button>
                <a href={student.resume} target="_blank" rel="noopener noreferrer" className="ml-2 px-2 py-1 bg-slate-200 rounded flex items-center gap-1 text-blue-700">
                  <Eye size={14} /> View
                </a>
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button onClick={() => handleAction(student, 'accept')} className="px-2 py-1 bg-emerald-600 text-white rounded flex items-center gap-1">
                  <CheckCircle size={14} /> Accept
                </button>
                <button onClick={() => handleAction(student, 'interview')} className="px-2 py-1 bg-blue-600 text-white rounded flex items-center gap-1">
                  <Users size={14} /> Schedule Interview
                </button>
                <button onClick={() => handleAction(student, 'reject')} className="px-2 py-1 bg-red-600 text-white rounded flex items-center gap-1">
                  <XCircle size={14} /> Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResumeList;
