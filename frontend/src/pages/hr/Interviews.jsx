import React, { useState, useEffect } from 'react';
import { Users, Video, Clock, Plus, Star, X } from 'lucide-react';
import VideoConference from '../../components/VideoConference';
import useAuth from '../../hooks/useAuth';
import { interviewAPI, examsAPI } from '../../services/api';

const HRInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examSubmissions, setExamSubmissions] = useState([]);
  const [reviewing, setReviewing] = useState(null);
  const [reviewForm, setReviewForm] = useState({ score: '', result: 'pending', feedback: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [editForm, setEditForm] = useState({ date: '', time: '' });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackInterview, setFeedbackInterview] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ feedback: '', rating: 0 });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesInterview, setNotesInterview] = useState(null);
  const [notesForm, setNotesForm] = useState({ notes: '' });
  const [notesSubmitting, setNotesSubmitting] = useState(false);
  const [filterType, setFilterType] = useState('day');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoRoom, setVideoRoom] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isNew, setIsNew] = useState(false);
  // Panel modal state and functions (must be at top level)
  const [showPanelModal, setShowPanelModal] = useState(false);
  const [panelInterview, setPanelInterview] = useState(null);
  const [panelSelection, setPanelSelection] = useState([]);
  const [panelUsers, setPanelUsers] = useState([]);
  const [panelLoading, setPanelLoading] = useState(false);

  function handleOpenNotes(interview) {
    setNotesInterview(interview);
    setNotesForm({ notes: interview.notes || '' });
    setShowNotesModal(true);
  }

  async function handleSubmitNotes(e) {
    e.preventDefault();
    setNotesSubmitting(true);
    try {
      await interviewAPI.update(notesInterview.id, {
        notes: notesForm.notes
      });
      setInterviews(prev => prev.map(i => i.id === notesInterview.id ? { ...i, notes: notesForm.notes } : i));
      setNotesInterview(null);
      setShowNotesModal(false);
    } catch (err) {
      alert('Failed to save notes');
    } finally {
      setNotesSubmitting(false);
    }
  }

  function handleOpenPanelModal(interview) {
    setPanelInterview(interview);
    setPanelSelection(interview.panel ? interview.panel.map(u => u._id || u.id || u) : []);
    setShowPanelModal(true);
    fetchPanelUsers();
  }

  async function fetchPanelUsers() {
    setPanelLoading(true);
    try {
      const res = await (window.adminAPI ? window.adminAPI.getAllUsers() : (await import('../../services/api')).adminAPI.getAllUsers());
      setPanelUsers((res.data?.users || res.users || []).filter(u => ['hr','staff','recruiter'].includes(u.role)));
    } catch (e) {
      setPanelUsers([]);
    } finally {
      setPanelLoading(false);
    }
  }

  async function handleSavePanel() {
    if (!panelInterview) return;
    try {
      await interviewAPI.update(panelInterview.id, { panel: panelSelection });
      setInterviews(prev => prev.map(i => i.id === panelInterview.id ? { ...i, panel: panelUsers.filter(u => panelSelection.includes(u._id || u.id)) } : i));
      setShowPanelModal(false);
      setPanelInterview(null);
    } catch (e) {
      alert('Failed to update panel');
    }
  }

  useEffect(() => {
    fetchInterviews(filterType);
    fetchExamSubmissions();
  }, [filterType]);

  async function fetchExamSubmissions() {
    try {
      const res = await examsAPI.getAllSubmissions();
      setExamSubmissions(res.data?.submissions || res.submissions || []);
    } catch (err) {
      console.error('Failed to fetch exam submissions', err);
    }
  }

  // Dummy fetchInterviews for demonstration (replace with real API call)
  async function fetchInterviews(type) {
    // TODO: Replace with real API call
    // Simulate filtering by type
    setLoading(true);
    // Example data
    const all = [
      { id: 1, candidate: 'Priya Sharma', position: 'Backend Engineer', date: '2026-02-25', time: '10:00 AM', status: 'scheduled', duration: '45 min', rating: 4, roomId: 'room-1' },
      { id: 2, candidate: 'Deepak Singh', position: 'Full Stack Developer', date: '2026-02-24', time: '2:00 PM', status: 'completed', duration: '60 min', rating: 5, roomId: 'room-2' },
    ];
    setTimeout(() => {
      setInterviews(all.filter(i => {
        if (type === 'day') return i.date === '2026-02-24';
        if (type === 'week') return true;
        if (type === 'month') return true;
        return true;
      }));
      setLoading(false);
    }, 300);
  }

  // Handle join interview (open modal with VideoConference)
  function handleJoinInterview(interview) {
    setVideoRoom(interview.roomId);
    setShowVideoModal(true);
  }

  // Handle edit interview (open modal)
  function handleEditInterview(interview) {
    setEditingInterview(interview);
    setEditForm({ date: interview.date, startTime: interview.startTime || '', endTime: interview.endTime || '' });
    setIsNew(false);
    setShowEditModal(true);
  }

  // Handle schedule new interview
  function handleScheduleNew() {
    setEditingInterview(null);
    setEditForm({ date: '', time: '' });
    setEditForm({ date: '', startTime: '', endTime: '' });
    setIsNew(true);
    setShowEditModal(true);
  }

  // Handle save interview (edit or new)
  function handleSaveInterview() {
    // TODO: Save interview via API
    setShowEditModal(false);
    fetchInterviews(filterType);
  }
  // Handle open feedback modal
  function handleOpenFeedback(interview) {
    setFeedbackInterview(interview);
    setFeedbackForm({ feedback: interview.feedback || '', rating: interview.rating || 0 });
    setShowFeedbackModal(true);
  }

  // Handle submit feedback
  async function handleSubmitFeedback(e) {
    e.preventDefault();
    setFeedbackSubmitting(true);
    try {
      await interviewAPI.update(feedbackInterview.id, {
        feedback: feedbackForm.feedback,
        rating: feedbackForm.rating
      });
      setInterviews(prev => prev.map(i => i.id === feedbackInterview.id ? { ...i, feedback: feedbackForm.feedback, rating: feedbackForm.rating } : i));
      setFeedbackInterview(null);
      setShowFeedbackModal(false);
    } catch (err) {
      alert('Failed to save feedback');
    } finally {
      setFeedbackSubmitting(false);
    }
  }

  // Handle submit review
  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!reviewing) return;
    setReviewSubmitting(true);
    try {
      await examsAPI.reviewSubmission(reviewing._id, {
        score: reviewForm.score,
        result: reviewForm.result,
        feedback: reviewForm.feedback
      });
      setExamSubmissions(prev => prev.map(s => s._id === reviewing._id ? { ...s, score: reviewForm.score, result: reviewForm.result, feedback: reviewForm.feedback, status: 'reviewed' } : s));
      setReviewing(null);
      setReviewForm({ score: '', result: 'pending', feedback: '' });
    } catch (err) {
      alert('Failed to save review');
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Filter Buttons */}
      <div className="flex gap-3 mb-4">
        <button className={`px-4 py-2 rounded-lg font-bold ${filterType === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setFilterType('day')}>Day</button>
        <button className={`px-4 py-2 rounded-lg font-bold ${filterType === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setFilterType('week')}>Week</button>
        <button className={`px-4 py-2 rounded-lg font-bold ${filterType === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`} onClick={() => setFilterType('month')}>Month</button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Interview Scheduling
          </h1>
          <p className="text-xl text-gray-600 mt-2">Manage candidate interviews</p>
        </div>
        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl flex items-center" onClick={handleScheduleNew}>
          <Plus className="mr-2 w-5 h-5" />
          Schedule New
        </button>
      </div>

      <div className="glass-card p-8 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 font-bold text-gray-900">Candidate</th>
                <th className="text-left py-4 font-bold text-gray-900">Position</th>
                <th className="text-left py-4 font-bold text-gray-900">Date & Time</th>
                <th className="text-left py-4 font-bold text-gray-900">Status</th>
                <th className="text-left py-4 font-bold text-gray-900">Duration</th>
                <th className="text-left py-4 font-bold text-gray-900">Rating</th>
                <th className="text-left py-4 font-bold text-gray-900">Panel</th>
                <th className="text-left py-4 font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
              ) : interviews.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8">No interviews found.</td></tr>
              ) : interviews.map((interview) => (
                <tr key={interview.id} className="hover:bg-white/50 transition-colors border-b border-gray-100 last:border-b-0">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">{interview.candidate}</span>
                    </div>
                  </td>
                  <td className="py-4 font-medium text-gray-900">{interview.position}</td>
                  <td className="py-4">
                    <div>
                      <p className="font-semibold">{interview.date}</p>
                      <p className="text-sm text-gray-600">{interview.time}</p>
                    </div>
                  </td>
    <td className="py-4">
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
        interview.status === 'completed' ? 'bg-green-100 text-green-800' :
        interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {interview.status.toUpperCase()}
      </span>
    </td>
                  <td className="py-4 font-medium text-gray-900">{interview.duration}</td>
                  <td className="py-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < interview.rating ? 'fill-current' : ''}`} />
                      ))}
                      <span className="ml-1 text-sm font-medium">({interview.rating})</span>
                    </div>
                  </td>
                  {/* Panel column */}
                  <td className="py-4">
                    <div className="flex flex-col gap-1">
                      {(interview.panel && interview.panel.length > 0) ? (
                        interview.panel.map((member, idx) => (
                          <span key={member._id || member.id || idx} className="text-xs bg-gray-100 rounded px-2 py-1 mb-1 text-gray-800">
                            {member.name || member.email || member}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No panel assigned</span>
                      )}
                    </div>
                    <button
                      className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200"
                      onClick={() => handleOpenPanelModal(interview)}
                    >
                      Edit Panel
                    </button>
                  </td>

                        {/* Panel Modal */}
                        {showPanelModal && (
                          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl shadow-2xl p-6 relative w-full max-w-lg">
                              <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={() => setShowPanelModal(false)}><X className="w-6 h-6" /></button>
                              <h2 className="text-xl font-bold mb-4">Assign Interview Panel</h2>
                              {panelLoading ? (
                                <div className="text-center py-8">Loading users...</div>
                              ) : (
                                <form onSubmit={e => { e.preventDefault(); handleSavePanel(); }} className="space-y-4">
                                  <div>
                                    <label className="block font-semibold mb-1">Select Panel Members</label>
                                    <div className="max-h-60 overflow-y-auto border rounded p-2">
                                      {panelUsers.length === 0 ? (
                                        <div className="text-gray-400 text-sm">No eligible users found.</div>
                                      ) : panelUsers.map(user => (
                                        <label key={user._id || user.id} className="flex items-center gap-2 py-1 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={panelSelection.includes(user._id || user.id)}
                                            onChange={e => {
                                              if (e.target.checked) {
                                                setPanelSelection(sel => [...sel, user._id || user.id]);
                                              } else {
                                                setPanelSelection(sel => sel.filter(id => id !== (user._id || user.id)));
                                              }
                                            }}
                                          />
                                          <span>{user.name} <span className="text-xs text-gray-400">({user.role})</span></span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex gap-3 mt-4">
                                    <button
                                      type="button"
                                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-xl font-bold transition-all hover:bg-gray-300"
                                      onClick={() => setShowPanelModal(false)}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold transition-all hover:bg-blue-700"
                                    >
                                      Save Panel
                                    </button>
                                  </div>
                                </form>
                              )}
                            </div>
                          </div>
                        )}
                  <td className="py-4">
                    <div className="flex space-x-2">
                      {interview.roomId ? (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-xl transition-all flex items-center gap-2 font-semibold"
                          onClick={() => handleJoinInterview(interview)}
                          title="Join Interview Room"
                        >
                          <Video className="w-4 h-4" />
                          Join Interview
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 bg-gray-300 text-gray-600 rounded-xl cursor-not-allowed"
                          disabled
                          title="No interview room available"
                        >
                          <Video className="w-4 h-4 inline mr-1" />
                          No Room
                        </button>
                      )}
                      <button
                        className="px-4 py-2 bg-yellow-500 text-white rounded-xl font-semibold"
                        onClick={() => handleEditInterview(interview)}
                        title="Edit Date/Time"
                      >
                        <Clock className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold"
                        onClick={() => handleOpenFeedback(interview)}
                        title="Add/Edit Feedback"
                      >
                        <Star className="w-4 h-4 mr-1" /> Feedback
                      </button>
                      <button
                        className="px-4 py-2 bg-slate-700 text-white rounded-xl font-semibold"
                        onClick={() => handleOpenNotes(interview)}
                        title="Add/Edit Notes"
                      >
                        Notes
                      </button>
                                      {/* Notes Modal */}
                                      {showNotesModal && notesInterview && (
                                        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                                          <div className="bg-white rounded-2xl shadow-2xl p-6 relative w-full max-w-md">
                                            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={() => setShowNotesModal(false)}><X className="w-6 h-6" /></button>
                                            <h2 className="text-xl font-bold mb-4">Interview Notes</h2>
                                            <form onSubmit={handleSubmitNotes} className="space-y-4">
                                              <div>
                                                <label className="block font-semibold mb-1">Notes</label>
                                                <textarea
                                                  className="w-full border rounded px-3 py-2 min-h-[80px]"
                                                  value={notesForm.notes}
                                                  onChange={e => setNotesForm(f => ({ ...f, notes: e.target.value }))}
                                                  required
                                                />
                                              </div>
                                              <div className="flex gap-3 mt-4">
                                                <button
                                                  type="button"
                                                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-xl font-bold transition-all hover:bg-gray-300"
                                                  onClick={() => setShowNotesModal(false)}
                                                  disabled={notesSubmitting}
                                                >
                                                  Cancel
                                                </button>
                                                <button
                                                  type="submit"
                                                  className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl font-bold transition-all hover:bg-slate-800 disabled:opacity-50"
                                                  disabled={notesSubmitting}
                                                >
                                                  {notesSubmitting ? 'Saving...' : 'Save Notes'}
                                                </button>
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      )}
                                {/* Feedback Modal */}
                                {showFeedbackModal && feedbackInterview && (
                                  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-2xl shadow-2xl p-6 relative w-full max-w-md">
                                      <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={() => setShowFeedbackModal(false)}><X className="w-6 h-6" /></button>
                                      <h2 className="text-xl font-bold mb-4">Interview Feedback</h2>
                                      <form onSubmit={handleSubmitFeedback} className="space-y-4">
                                        <div>
                                          <label className="block font-semibold mb-1">Feedback</label>
                                          <textarea
                                            className="w-full border rounded px-3 py-2 min-h-[80px]"
                                            value={feedbackForm.feedback}
                                            onChange={e => setFeedbackForm(f => ({ ...f, feedback: e.target.value }))}
                                            required
                                          />
                                        </div>
                                        <div>
                                          <label className="block font-semibold mb-1">Rating</label>
                                          <div className="flex items-center gap-1">
                                            {[1,2,3,4,5].map(i => (
                                              <button
                                                type="button"
                                                key={i}
                                                className={`w-7 h-7 rounded-full flex items-center justify-center ${feedbackForm.rating >= i ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-500'}`}
                                                onClick={() => setFeedbackForm(f => ({ ...f, rating: i }))}
                                              >
                                                <Star className="w-5 h-5" />
                                              </button>
                                            ))}
                                            <span className="ml-2 text-sm font-medium">{feedbackForm.rating} / 5</span>
                                          </div>
                                        </div>
                                        <div className="flex gap-3 mt-4">
                                          <button
                                            type="button"
                                            className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-xl font-bold transition-all hover:bg-gray-300"
                                            onClick={() => setShowFeedbackModal(false)}
                                            disabled={feedbackSubmitting}
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="submit"
                                            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold transition-all hover:bg-emerald-700 disabled:opacity-50"
                                            disabled={feedbackSubmitting}
                                          >
                                            {feedbackSubmitting ? 'Saving...' : 'Save Feedback'}
                                          </button>
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                )}
                          {/* Video Call Modal */}
                          {showVideoModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                              <div className="bg-white rounded-2xl shadow-2xl p-6 relative w-full max-w-3xl">
                                <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={() => setShowVideoModal(false)}><X className="w-6 h-6" /></button>
                                <h2 className="text-xl font-bold mb-4">Interview Video Call</h2>
                                <VideoConference roomId={videoRoom} user={user} onLeave={() => setShowVideoModal(false)} />
                              </div>
                            </div>
                          )}

                          {/* Edit/Schedule Modal */}
                          {showEditModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                              <div className="bg-white rounded-2xl shadow-2xl p-6 relative w-full max-w-md">
                                <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={() => setShowEditModal(false)}><X className="w-6 h-6" /></button>
                                <h2 className="text-xl font-bold mb-4">{isNew ? 'Schedule New Interview' : 'Edit Interview'}</h2>
                                <form onSubmit={e => { e.preventDefault(); handleSaveInterview(); }} className="space-y-4">
                                  <div>
                                    <label className="block font-semibold mb-1">Date</label>
                                    <input type="date" className="w-full border rounded px-3 py-2" value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} required />
                                  </div>
                                  <div>
                                    <label className="block font-semibold mb-1">Time</label>
                                    <input type="time" className="w-full border rounded px-3 py-2" value={editForm.time} onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))} required />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <button type="button" className="px-4 py-2 rounded bg-gray-300" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-bold">Save</button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Interview Exam Reviews</h2>
          <span className="text-sm text-gray-600">HR verification</span>
        </div>
        {examSubmissions.length === 0 ? (
          <p className="text-gray-600">No exam submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-bold text-gray-900">Student</th>
                  <th className="text-left py-3 font-bold text-gray-900">Exam</th>
                  <th className="text-left py-3 font-bold text-gray-900">Status</th>
                  <th className="text-left py-3 font-bold text-gray-900">Score</th>
                  <th className="text-left py-3 font-bold text-gray-900">Result</th>
                  <th className="text-left py-3 font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {examSubmissions.map((submission) => (
                  <tr key={submission._id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 font-semibold text-gray-900">
                      {submission.studentUser?.name || 'Student'}
                    </td>
                    <td className="py-3 text-gray-900">
                      {submission.exam?.title || 'Exam'}
                    </td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        submission.status === 'reviewed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="py-3">{submission.score ?? 'N/A'}</td>
                    <td className="py-3">{submission.result || 'pending'}</td>
                    <td className="py-3">
                      <button
                        onClick={() => {
                          setReviewing(submission);
                          setReviewForm({
                            score: submission.score ?? '',
                            result: submission.result || 'pending',
                            feedback: submission.feedback || ''
                          });
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-sm uppercase hover:shadow-lg transition-shadow"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Review Modal */}
        {reviewing && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 relative w-full max-w-md">
              <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={() => setReviewing(null)}>
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold mb-4">Review Exam Submission</h2>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Score</label>
                  <input 
                    type="number" 
                    className="w-full border rounded px-3 py-2" 
                    value={reviewForm.score} 
                    onChange={e => setReviewForm(f => ({ ...f, score: e.target.value }))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Result</label>
                  <select 
                    className="w-full border rounded px-3 py-2" 
                    value={reviewForm.result} 
                    onChange={e => setReviewForm(f => ({ ...f, result: e.target.value }))}
                  >
                    <option value="pending">Pending</option>
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Feedback</label>
                  <textarea 
                    className="w-full border rounded px-3 py-2 min-h-[80px]" 
                    value={reviewForm.feedback} 
                    onChange={e => setReviewForm(f => ({ ...f, feedback: e.target.value }))} 
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-300" 
                    onClick={() => setReviewing(null)}
                    disabled={reviewSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50" 
                    disabled={reviewSubmitting}
                  >
                    {reviewSubmitting ? 'Saving...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRInterviews;
