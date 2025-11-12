import { useState } from 'react';
import { Briefcase, LogOut } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function App() {
  const [page, setPage] = useState('auth');
  const [step, setStep] = useState('intro');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [users, setUsers] = useState([
    { id: 1, name: 'Demo User', email: 'demo@example.com', date: '2024-11-01', quizzes: 2 }
  ]);
  
  const [quizHistory, setQuizHistory] = useState([
    { user: 'Demo', skills: 2, interests: 1, work: 2, career: 'Data Scientist' },
    { user: 'Demo', skills: 1, interests: 1, work: 1, career: 'Teacher' }
  ]);
  
  const [selections, setSelections] = useState({ skills: [], interests: [], work: [], education: '' });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const skillList = ['Problem Solving', 'Communication', 'Creativity', 'Leadership', 'Technical', 'Data Analysis', 'Design', 'Writing'];
  const interestList = ['Technology', 'Healthcare', 'Business', 'Education', 'Environment', 'Arts', 'Finance', 'Social'];
  const workList = ['Independent', 'Team', 'Client', 'Remote', 'Outdoor', 'Research', 'Hands-on', 'Teaching'];
  const eduList = ['High School', 'Bachelors', 'Masters', 'Doctorate', 'Vocational'];

  const careers = {
    Technology: [
      { name: 'Data Scientist', sal: '$90K-$150K', grow: 'Very High' },
      { name: 'Software Engineer', sal: '$85K-$160K', grow: 'High' },
      { name: 'AI Engineer', sal: '$110K-$200K', grow: 'Very High' }
    ],
    Healthcare: [
      { name: 'Healthcare Manager', sal: '$75K-$130K', grow: 'High' },
      { name: 'Health Researcher', sal: '$70K-$120K', grow: 'High' },
      { name: 'Counselor', sal: '$50K-$95K', grow: 'High' }
    ],
    Business: [
      { name: 'Business Manager', sal: '$70K-$150K', grow: 'Moderate' },
      { name: 'Business Analyst', sal: '$65K-$125K', grow: 'High' },
      { name: 'Entrepreneur', sal: 'Variable', grow: 'Very High' }
    ],
    Education: [
      { name: 'Teacher', sal: '$40K-$85K', grow: 'Moderate' },
      { name: 'Educational Designer', sal: '$55K-$95K', grow: 'High' },
      { name: 'Training Manager', sal: '$65K-$110K', grow: 'Moderate' }
    ],
    Environment: [
      { name: 'Environmental Scientist', sal: '$60K-$110K', grow: 'High' },
      { name: 'Sustainability Consultant', sal: '$70K-$130K', grow: 'Very High' },
      { name: 'Conservation Manager', sal: '$55K-$100K', grow: 'Moderate' }
    ],
    Arts: [
      { name: 'Graphic Designer', sal: '$45K-$95K', grow: 'Moderate' },
      { name: 'UX Designer', sal: '$70K-$130K', grow: 'Very High' },
      { name: 'Creative Director', sal: '$80K-$160K', grow: 'High' }
    ],
    Finance: [
      { name: 'Financial Analyst', sal: '$60K-$120K', grow: 'High' },
      { name: 'Investment Manager', sal: '$90K-$200K', grow: 'Moderate' },
      { name: 'Accountant', sal: '$55K-$110K', grow: 'Moderate' }
    ],
    Social: [
      { name: 'Social Worker', sal: '$45K-$85K', grow: 'High' },
      { name: 'Community Manager', sal: '$50K-$90K', grow: 'High' },
      { name: 'Counselor', sal: '$50K-$95K', grow: 'High' }
    ]
  };

  const steps = ['skills', 'interests', 'work', 'education'];
  const idx = steps.indexOf(step);
  const prog = step === 'intro' ? 0 : step === 'results' ? 100 : ((idx + 1) / steps.length) * 100;

  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
      setUser({ name: name || email.split('@')[0], email });
      setEmail('');
      setPassword('');
      setPage('home');
    }
  };

  const handleSignUp = () => {
    if (name && email && password) {
      setUsers([...users, { id: users.length + 1, name, email, date: new Date().toLocaleDateString(), quizzes: 0 }]);
      setIsLoggedIn(true);
      setUser({ name, email });
      setIsSignUp(false);
      setName('');
      setEmail('');
      setPassword('');
      setPage('home');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setPage('auth');
    setStep('intro');
    setSelections({ skills: [], interests: [], work: [], education: '' });
  };

  const toggle = (type, val) => {
    setSelections(prev => ({
      ...prev,
      [type]: prev[type].includes(val) ? prev[type].filter(i => i !== val) : [...prev[type], val]
    }));
  };

  const getRecommendations = () => {
    setLoading(true);
    setTimeout(() => {
      let result = [];
      selections.interests.forEach(inter => {
        if (careers[inter]) {
          result = result.concat(careers[inter].map(c => ({ ...c, match: Math.floor(Math.random() * 40 + 60) })));
        }
      });
      if (result.length === 0) {
        result = Object.values(careers).flat().map(c => ({ ...c, match: Math.floor(Math.random() * 30 + 50) }));
      }
      setRecommendations(result.slice(0, 6));
      setQuizHistory([...quizHistory, {
        user: user?.name,
        skills: selections.skills.length,
        interests: selections.interests.length,
        work: selections.work.length,
        career: result[0]?.name || 'Not Found'
      }]);
      setLoading(false);
      setStep('results');
    }, 1500);
  };

  const download = () => {
    const txt = `Career Results\nUser: ${user?.name}\nDate: ${new Date().toLocaleDateString()}\n\nTop Careers:\n${recommendations.slice(0, 3).map((c, i) => `${i + 1}. ${c.name} (${c.match}% match) - ${c.sal}`).join('\n')}`;
    const el = document.createElement('a');
    el.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt);
    el.download = 'results.txt';
    el.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <Briefcase className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Career Path AI</h1>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{isSignUp ? 'Sign Up' : 'Login'}</h2>
          
          {isSignUp && (
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded-lg" />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded-lg" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 px-4 py-2 border rounded-lg" />
          
          <button onClick={isSignUp ? handleSignUp : handleLogin} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 mb-4">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-indigo-600 font-semibold">
            {isSignUp ? 'Have account? Login' : 'No account? Sign Up'}
          </button>
          <div className="mt-6 pt-4 border-t text-center text-sm text-gray-600">
            <p>Demo: demo@example.com / demo123</p>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'home') {
    const totalResp = quizHistory.reduce((a, b) => a + b.skills + b.interests + b.work, 0);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Career Path AI</h1>
            <div className="flex gap-3 items-center">
              <span className="text-sm">Welcome, {user?.name}!</span>
              <button onClick={() => setPage('dashboard')} className="bg-white/20 px-3 py-1 rounded text-sm">Dashboard</button>
              <button onClick={logout} className="bg-red-600 px-3 py-1 rounded text-sm">Logout</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-5xl font-bold text-gray-800 mb-4">Discover Your Perfect Career</h2>
              <p className="text-xl text-gray-600 mb-6">AI-powered career matching based on your interests.</p>
              <button onClick={() => setPage('quiz')} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 mr-4">Start Assessment</button>
              <button onClick={() => setPage('dashboard')} className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-bold">View Analytics</button>
            </div>
            <div className="bg-indigo-200 rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-xl font-bold text-indigo-600">{users.length} Users | {quizHistory.length} Quizzes</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-12">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">Platform Stats</h3>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div><p className="text-4xl font-bold text-indigo-600">{users.length}</p><p className="text-gray-600">Users</p></div>
              <div><p className="text-4xl font-bold text-purple-600">{quizHistory.length}</p><p className="text-gray-600">Quizzes</p></div>
              <div><p className="text-4xl font-bold text-pink-600">{totalResp}</p><p className="text-gray-600">Responses</p></div>
              <div><p className="text-4xl font-bold text-green-600">89%</p><p className="text-gray-600">Satisfaction</p></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'dashboard') {
    const careerCount = {};
    quizHistory.forEach(q => {
      careerCount[q.career] = (careerCount[q.career] || 0) + 1;
    });
    const chartData = Object.entries(careerCount).map(([name, count]) => ({ name, count }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Analytics Dashboard</h1>
            <div className="flex gap-3">
              <button onClick={() => setPage('home')} className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold">Home</button>
              <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded font-semibold">Logout</button>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6"><p className="text-gray-600 font-semibold mb-2">Total Users</p><p className="text-4xl font-bold text-indigo-600">{users.length}</p></div>
            <div className="bg-white rounded-xl shadow p-6"><p className="text-gray-600 font-semibold mb-2">Quizzes</p><p className="text-4xl font-bold text-purple-600">{quizHistory.length}</p></div>
            <div className="bg-white rounded-xl shadow p-6"><p className="text-gray-600 font-semibold mb-2">Total Responses</p><p className="text-4xl font-bold text-pink-600">{quizHistory.reduce((a, b) => a + b.skills + b.interests + b.work, 0)}</p></div>
            <div className="bg-white rounded-xl shadow p-6"><p className="text-gray-600 font-semibold mb-2">Avg Score</p><p className="text-4xl font-bold text-green-600">87%</p></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { w: 'W1', s: 15, c: 12 },
                  { w: 'W2', s: 22, c: 18 },
                  { w: 'W3', s: 18, c: 15 },
                  { w: 'W4', s: 25 + quizHistory.length, c: 20 + quizHistory.length }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="w" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="s" stroke="#4F46E5" />
                  <Line type="monotone" dataKey="c" stroke="#10B981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Top Career Recommendations</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Career Path AI</h1>
          {step !== 'intro' && (
            <div className="mb-6">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>Progress</span>
                <span className="text-indigo-600">{Math.round(prog)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${prog}%` }}></div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {step === 'intro' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Assessment</h2>
                <p className="text-gray-600 mb-8">Answer questions to get your perfect career matches.</p>
                <button onClick={() => setStep('skills')} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700">Start Quiz</button>
              </div>
            )}
            {step === 'skills' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Skills?</h2>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {skillList.map(s => (
                    <button key={s} onClick={() => toggle('skills', s)} className={`p-3 rounded-lg font-semibold ${selections.skills.includes(s) ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>{s}</button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setPage('home')} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold">Back</button>
                  <button onClick={() => setStep('interests')} disabled={selections.skills.length === 0} className="flex-1 bg-indigo-600 text-white py-2 rounded font-semibold disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
            {step === 'interests' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Interests?</h2>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {interestList.map(i => (
                    <button key={i} onClick={() => toggle('interests', i)} className={`p-3 rounded-lg font-semibold ${selections.interests.includes(i) ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>{i}</button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('skills')} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold">Back</button>
                  <button onClick={() => setStep('work')} disabled={selections.interests.length === 0} className="flex-1 bg-indigo-600 text-white py-2 rounded font-semibold disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
            {step === 'work' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Work Style?</h2>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {workList.map(w => (
                    <button key={w} onClick={() => toggle('work', w)} className={`p-3 rounded-lg font-semibold ${selections.work.includes(w) ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>{w}</button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('interests')} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold">Back</button>
                  <button onClick={() => setStep('education')} disabled={selections.work.length === 0} className="flex-1 bg-indigo-600 text-white py-2 rounded font-semibold disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
            {step === 'education' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Education Level?</h2>
                <div className="space-y-3 mb-8">
                  {eduList.map(e => (
                    <button key={e} onClick={() => setSelections(prev => ({ ...prev, education: e }))} className={`w-full p-3 rounded-lg font-semibold text-left ${selections.education === e ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>{e}</button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('work')} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold">Back</button>
                  <button onClick={getRecommendations} disabled={!selections.education} className="flex-1 bg-green-600 text-white py-2 rounded font-semibold disabled:opacity-50">Get Results</button>
                </div>
              </div>
            )}
            {step === 'results' && (
              <div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Analyzing your interests: {selections.interests.join(', ')}</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Recommended Careers</h2>
                    <p className="text-gray-600 mb-6">Based on: {selections.interests.join(', ')}</p>
                    <div className="space-y-4 mb-8">
                      {recommendations.map((c, i) => (
                        <div key={i} className="border-l-4 border-indigo-600 bg-indigo-50 p-4 rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">{c.name}</h3>
                              <p className="text-sm text-gray-600">Salary: {c.sal}</p>
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${c.grow === 'Very High' ? 'bg-green-200' : c.grow === 'High' ? 'bg-blue-200' : 'bg-yellow-200'}`}>Growth: {c.grow}</span>
                            </div>
                            <div className="text-right">
                              <div className="bg-indigo-600 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold">{c.match}%</div>
                              <p className="text-xs text-gray-600">Match</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={download} className="bg-blue-600 text-white py-2 rounded font-semibold">Download</button>
                      <button onClick={() => setPage('home')} className="bg-indigo-600 text-white py-2 rounded font-semibold">Home</button>
                      <button onClick={() => { setStep('intro'); setSelections({ skills: [], interests: [], work: [], education: '' }); }} className="bg-gray-600 text-white py-2 rounded font-semibold">Restart</button>
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
