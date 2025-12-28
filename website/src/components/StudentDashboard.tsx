import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, LogOut, MapPin, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import { Issue, IssueCategory, IssuePriority } from '../types';

export const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Maintenance');
  const [priority, setPriority] = useState<IssuePriority>('Medium');
  const [description, setDescription] = useState('');
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    loadMyIssues();
  }, [user]);

  const loadMyIssues = () => {
    if (user) {
      const issues = storage.getIssuesByUser(user.id);
      setMyIssues(issues.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!location.trim() || !description.trim()) {
      showAlertMessage('Please fill in all required fields', 'error');
      return;
    }

    if (storage.checkDuplicate(location, category)) {
      showAlertMessage('⚠️ Duplicate Detected! An active issue already exists for this Location and Category. Please check existing reports.', 'error');
      return;
    }

    const newIssue: Issue = {
      id: `issue_${Date.now()}`,
      location: location.trim(),
      category,
      priority,
      description: description.trim(),
      status: 'Reported',
      reportedBy: user!.id,
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    storage.addIssue(newIssue);
    showAlertMessage('✓ Issue reported successfully!', 'success');

    setLocation('');
    setCategory('Maintenance');
    setPriority('Medium');
    setDescription('');
    loadMyIssues();
  };

  const showAlertMessage = (message: string, type: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Reported':
        return <AlertCircle className="w-4 h-4" />;
      case 'In Progress':
        return <Clock className="w-4 h-4" />;
      case 'Resolved':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">Smart Campus</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAlert && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              alertType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className={`text-sm ${alertType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {alertMessage}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Report New Issue</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Building A - Room 201"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Security">Security</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as IssuePriority)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-md"
              >
                <Send className="w-5 h-5" />
                Submit Report
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Reported Issues</h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {myIssues.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No issues reported yet</p>
                </div>
              ) : (
                myIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-800">{issue.location}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {getStatusIcon(issue.status)}
                          {issue.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{issue.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium text-blue-600">{issue.category}</span>
                      <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
