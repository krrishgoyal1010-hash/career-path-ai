import { useState } from 'react';
import { Briefcase, LogOut, LayoutDashboard } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

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
    { id: 1, email: 'demo@example.com', name: 'Demo User', joinDate: '2024-11-01', lastLogin: '2024-11-12', completedQuiz: true }
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
      const user = users.find(u => u.email === userEmail);
      if (user && userPassword === 'demo123') {
        setIsLoggedIn(true);
        setCurrentUser({ ...user, lastLogin: new Date().toLocaleDateString() });
        setUserEmail('');
        setUserPassword('');
        setCurrentPage('home');
      } else {
        alert('Invalid credentials. Try demo@example.com / demo123');
      }
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
      alert('Sign up successful! Please login.');
      setIsSignUp(false);
      setUserEmail('');
      setUserPassword('');
      setUserName('');
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

  // ----------- Prepare Data Visualization from user responses ------------
  const skillData = selections.skills.map(skill => ({ name: skill, value: 1 }));
  const interestData = selections.interests.map(interest => ({ name: interest, value: 1 }));

  // ---------------------- Render Section -------------------------------
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
              <input type="text" placeholder="Full Name" value={userName} onChange={(e) => setUserName(e.target.value)}
                className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"/>
            )}
            <input type="email" placeholder="Email Address" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"/>
            <input type="password" placeholder="Password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)}
              className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"/>
            <button onClick={isSignUp ? handleSignUp : handleLogin}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition mb-4">
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
            <button onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-indigo-600 font-semibold hover:text-purple-600 transition">
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

  // ---------------- Render Results Page with Charts -----------------
  if (currentPage === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {step === 'results' && (
            <div>
              <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Your Career Insights</h2>
              
              {/* PIE CHART FOR SKILLS */}
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-xl font-bold mb-4">Your Skills Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={skillData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {skillData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* BAR CHART FOR INTERESTS */}
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h3 className="text-xl font-bold mb-4">Your Interests</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={interestData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
