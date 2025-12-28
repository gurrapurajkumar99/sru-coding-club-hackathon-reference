import { GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Campus</h1>
          <p className="text-gray-600">Issue & Resource Management System</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => login('student')}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <GraduationCap className="w-5 h-5" />
            Login as Student
          </button>

          <button
            onClick={() => login('admin')}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <Shield className="w-5 h-5" />
            Login as Admin
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Select your role to access the system
          </p>
        </div>
      </div>
    </div>
  );
};
