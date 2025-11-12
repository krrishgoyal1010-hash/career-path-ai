import { useState } from 'react';
import { Briefcase, LogOut, LayoutDashboard } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CareerPathAI() {
  const [currentPage, setCurrentPage] = useState('auth');
  const [step, setStep] = useState('intro');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, email: 'demo@example.com', name: 'Demo User', password: 'demo123', joinDate: '2024-11-01', lastLogin: '2024-11-12', completedQuiz: true }
  ]);
  
  const [selections, setSelections] = useState({
    skills: [],
    interests: [],
    workStyle: [],
    education: null
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCareer, setExpandedCareer] = useState(null);

  const [analyticsData] = useState({
    careerChoices: [
      { name: 'Data Scientist', count: 145 },
      { name: 'Software Engineer', count: 132 },
      { name: 'UX Designer', count: 89 },
      { name: 'Healthcare Mgr', count: 76 },
      { name: 'Business Mgr', count: 98 }
    ],
    skillsDistribution: [
      { name: 'Problem Solving', value: 234 },
      { name: 'Communication', value: 198 },
      { name: 'Creativity', value: 156 },
      { name: 'Leadership', value: 142 },
      { name: 'Technical', value: 189 }
    ],
    weeklySignups: [
      { week: 'W1', signups: 45, completions: 38 },
      { week: 'W2', signups: 62, completions: 52 },
      { week: 'W3', signups: 58, completions: 48 },
      { week: 'W4', signups: 89, completions: 76 }
    ]
  });

  const skillOptions = ['Problem Solving', 'Communication', 'Creativity', 'Leadership', 'Technical Skills', 'Data Analysis', 'Design', 'Writing'];
  const interestOptions = ['Technology', 'Healthcare', 'Business', 'Education', 'Environment', 'Arts', 'Finance', 'Social Work'];
  const workStyleOptions = ['Independent', 'Team Work', 'Client Interaction', 'Remote', 'Outdoor', 'Research', 'Hands-on'];
  const educationOptions = ['High School', 'Bachelors', 'Masters', 'Doctorate', 'Vocational'];

  const careerDatabase = {
    'Technology|Problem Solving': [
      { role: 'Data Scientist', description: 'Analyze complex data to drive decisions', salary: '$90K - $150K', skills: ['Python', 'ML', 'Stats'], growth: 'Very High' },
      { role: 'Software Engineer', description: 'Develop software applications', salary: '$85K - $160K', skills: ['Code', 'Design', 'Problem'], growth: 'High' }
    ],
    'Healthcare|Communication': [
      { role: 'Healthcare Manager', description: 'Lead medical teams', salary: '$75K - $130K', skills: ['Leadership', 'Healthcare', 'Comm'], growth: 'High' },
      { role: 'Physician', description: 'Provide patient care', salary: '$120K - $250K', skills: ['Medical', 'Comm', 'Problem'], growth: 'Moderate' }
    ],
    'Business|Leadership': [
      { role: 'Business Manager', description: 'Oversee operations and strategy', salary: '$70K - $150K', skills: ['Leadership', 'Strategy', 'Comm'], growth: 'Moderate' },
      { role: 'Management Consultant', description: 'Help companies improve', salary: '$90K - $180K', skills: ['Analysis', 'Problem', 'Comm'], growth: 'High' }
    ],
    'Education|Creativity': [
      { role: 'Teacher', description: 'Educate students', salary: '$40K - $85K', skills: ['Comm', 'Patience', 'Creative'], growth: 'Moderate' },
      { role: 'Curriculum Designer', description: 'Develop educational programs', salary: '$55K - $95K', skills: ['Creative', 'Analysis', 'Comm'], growth: 'High' }
    ],
    'Finance|Data Analysis': [
      { role: 'Financial Analyst', description: 'Analyze financial data', salary: '$60K - $120K', skills: ['Finance', 'Excel', 'Comm'], growth: 'High' },
      { role: 'Accountant', description: 'Manage financial records', salary: '$55K - $110K', skills: ['Accounting', 'Detail', 'Compliance'], growth: 'Moderate' }
    ]
  };

  const steps = ['skills', 'interests', 'workstyle', 'education'];
  const currentStepIndex = steps.indexOf(step);
  const progress = step === 'intro' ? 0 : step === 'results' ? 100 : ((currentStepIndex + 1) / steps.length) * 100;

  const handleLogin = () => {
    if (userEmail && userPassword) {
      setIsLoggedIn(true);
      setCurrentUser({ 
        id: users.length + 1,
        name: userName || userEmail.split('@')[0],
        email: userEmail,
        lastLogin: new Date().toLocaleDateString(),
        joinDate: new Date().toLocaleDateString(),
        completedQuiz: false
      });
      setUserEmail('');
      setUserPassword('');
      setUserName('');
      setCurrentPage('home');
    } else {
      alert('Please enter email and password');
    }
  };

  const handleSignUp = () => {
    if (userName && userEmail && userPassword) {
      const newUser = {
        id: users.length + 1,
        email: userEmail,
        name: userName,
        joinDate: new Date().toLocaleDateString(),
        lastLogin: new Date().toLocaleDateString(),
        completedQuiz: false
      };
      setUsers([...users, newUser]);
      alert('Account created! Now logging you in...');
      setIsLoggedIn(true);
      setCurrentUser(newUser);
      setIsSignUp(false);
      setUserEmail('');
      setUserPassword('');
      setUserName('');
      setCurrentPage('home');
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('auth');
    setStep('intro');
    setSelections({ skills: [], interests: [], workStyle: [], education: null });
    setRecommendations([]);
  };

  const goBack = () => {
    const currentIdx = steps.indexOf(step);
    if (currentIdx > 0) {
      setStep(steps[currentIdx - 1]);
    }
  };

  const toggleSelection = (category, value) => {
    setSelections(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const getRecommendations = () => {
    setLoading(true);
    setTimeout(() => {
      const interests = selections.interests.join('|');
      const skills = selections.skills.slice(0, 2).join('|');
      
      let matched = [];
      for (const key in careerDatabase) {
        if (key.includes(interests) || key.includes(skills)) {
          matched = matched.concat(careerDatabase[key]);
        }
      }
      
      if (matched.length === 0) {
        matched = Object.values(careerDatabase).flat().slice(0, 5);
      }
      
      const uniqueCareers = [...new Set(matched.map(c => c.role))].map(role => 
        matched.find(c => c.role === role)
      ).slice(0, 6);

      setRecommendations(uniqueCareers);
      setLoading(false);
      setStep('results');
    }, 1500);
  };

  const downloadResults = () => {
    const resultsText = recommendations.map((c, i) => 
      `${i + 1}. ${c.role}\n${c.description}\nSalary: ${c.salary}\nGrowth: ${c.growth}\n\n`
    ).join('');
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(resultsText));
    element.setAttribute('download', 'career-results.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const reset = () => {
    setStep('intro');
    setSelections({ skills: [], interests: [], workStyle: [], education: null });
    setRecommendations([]);
    setExpandedCareer(null);
  };

  const COLORS = ['#4F46E5', '#06B6D4', '#EC4899', '#F59E0B', '#10B981'];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Briefcase className="w-10 h-10 text-white" />
              <h1 className="text-4xl font-bold text-white">Career Path AI</h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>

            {isSignUp && (
              <input
                type="text"
                placeholder="Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />

            <input
              type="password"
              placeholder="Password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />

            <button
              onClick={isSignUp ? handleSignUp : handleLogin}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition mb-4"
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-indigo-600 font-semibold hover:text-purple-600 transition"
            >
              {isSignUp ? 'Already have account? Login' : 'No account? Sign Up'}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <p>Email: demo@example.com</p>
              <p>Password: demo123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Career Path AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {currentUser?.name}!</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-gray-800">Discover Your Perfect Career</h2>
              <p className="text-xl text-gray-600">Use our AI-powered assessment to find careers matching your skills and interests.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentPage('quiz')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
                >
                  Start Assessment
                </button>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transition"
                >
                  View Analytics
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-200 to-purple-200 rounded-2xl p-8 flex flex-col justify-center items-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-2xl font-bold text-indigo-600 text-center">500+ Users Finding Their Career Path</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: '🎯', title: 'Personalized', desc: 'Recommendations tailored to your skills' },
              { icon: '📊', title: 'Data-Driven', desc: 'AI analyzes and matches your profile' },
              { icon: '⚡', title: 'Quick Results', desc: 'Complete in just 5 minutes' }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:scale-105">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-12">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Platform Statistics</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">{users.length}</div>
                <p className="text-gray-600 mt-2">Total Users</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">{users.filter(u => u.completedQuiz).length}</div>
                <p className="text-gray-600 mt-2">Completed Quiz</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600">500+</div>
                <p className="text-gray-600 mt-2">Career Matches</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">89%</div>
                <p className="text-gray-600 mt-2">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage('home')}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Back to Home
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-600 font-semibold mb-2">Total Users</h3>
              <p className="text-4xl font-bold text-indigo-600">{users.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-600 font-semibold mb-2">Completed Quizzes</h3>
              <p className="text-4xl font-bold text-purple-600">{users.filter(u => u.completedQuiz).length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-600 font-semibold mb-2">Career Matches</h3>
              <p className="text-4xl font-bold text-pink-600">745</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-gray-600 font-semibold mb-2">Avg Match Score</h3>
              <p className="text-4xl font-bold text-green-600">87%</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.weeklySignups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="signups" stroke="#4F46E5" strokeWidth={2} />
                  <Line type="monotone" dataKey="completions" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Top Careers</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.careerChoices}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Skills Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={analyticsData.skillsDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                    {analyticsData.skillsDistribution.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">User List</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {users.map(user => (
                  <div key={user.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Joined: {user.joinDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-800">Career Path AI</h1>
            </div>
          </div>

          {step !== 'intro' && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Progress</span>
                <span className="text-sm font-semibold text-indigo-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8">
            {step === 'intro' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Assessment Quiz</h2>
                <p className="text-gray-600 mb-8">Answer questions about your skills and interests.</p>
                <button
                  onClick={() => setStep('skills')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Start Quiz
                </button>
              </div>
            )}

            {step === 'skills' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">What are your key skills?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {skillOptions.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSelection('skills', skill)}
                      className={`p-3 rounded-lg font-semibold transition ${
                        selections.skills.includes(skill)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('interests')}
                    disabled={selections.skills.length === 0}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 'interests' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">What are your interests?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleSelection('interests', interest)}
                      className={`p-3 rounded-lg font-semibold transition ${
                        selections.interests.includes(interest)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={goBack}
                    className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('workstyle')}
                    disabled={selections.interests.length === 0}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 'workstyle' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferred work style?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {workStyleOptions.map(style => (
                    <button
                      key={style}
                      onClick={() => toggleSelection('workStyle', style)}
                      className={`p-3 rounded-lg font-semibold transition ${
                        selections.workStyle.includes(style)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={goBack}
                    className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('education')}
                    disabled={selections.workStyle.length === 0}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 'education' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Education level?</h2>
                <div className="space-y-3 mb-8">
                  {educationOptions.map(edu => (
                    <button
                      key={edu}
                      onClick={() => setSelections(prev => ({ ...prev, education: edu }))}
                      className={`w-full p-3 rounded-lg font-semibold transition text-left ${
                        selections.education === edu
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {edu}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={goBack}
                    className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={getRecommendations}
                    disabled={!selections.education}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    Get Recommendations
                  </button>
                </div>
              </div>
            )}

            {step === 'results' && (
              <div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                      <p className="text-gray-600 font-semibold">Analyzing your profile...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Recommended Careers</h2>
                    <p className="text-gray-600 mb-6">Based on your skills and interests</p>
                    
                    <div className="space-y-4 mb-8">
                      {recommendations.map((career, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-600 p-4 rounded">
                          <div 
                            onClick={() => setExpandedCareer(expandedCareer === idx ? null : idx)}
                            className="cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-800">{career.role}</h3>
                                <p className="text-gray-600 text-sm">{career.description}</p>
                                <div className="mt-2 flex gap-4 text-xs text-gray-700">
                                  <span className="font-semibold">Salary: {career.salary}</span>
                                  <span className={`font-semibold px-2 py-1 rounded ${career.growth === 'Very High' ? 'bg-green-100 text-green-800' : career.growth === 'High' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {career.growth}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
                                  85%
                                </div>
                                <span className="text-xs text-gray-600">Match</span>
                              </div>
                            </div>
                          </div>
                          
                          {expandedCareer === idx && (
                            <div className="mt-4 pt-4 border-t border-indigo-200">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Key Skills:</p>
                              <div className="flex flex-wrap gap-2">
                                {career.skills?.map((skill, i) => (
                                  <span key={i} className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={downloadResults}
                        className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Download Results
                      </button>
                      <button
                        onClick={() => setCurrentPage('home')}
                        className="bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                      >
                        Back to Home
                      </button>
                      <button
                        onClick={reset}
                        className="bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
                      >
                        Start Over
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
