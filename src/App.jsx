import { useState } from 'react';
import { Briefcase, LogOut } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CareerPathAI() {
  const [page, setPage] = useState('auth');
  const [step, setStep] = useState('intro');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [users, setUsers] = useState([{ id: 1, name: 'Demo', email: 'demo@example.com', date: '2024-11-01' }]);
  const [totalResponses, setTotalResponses] = useState(1);
  const [totalQuizzes, setTotalQuizzes] = useState(1);
  const [selections, setSelections] = useState({ skills: [], interests: [], work: [], education: '' });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const skills = ['Problem Solving', 'Communication', 'Creativity', 'Leadership', 'Technical', 'Data Analysis', 'Design', 'Writing'];
  const interests = ['Technology', 'Healthcare', 'Business', 'Education', 'Environment', 'Arts', 'Finance', 'Social'];
  const workStyles = ['Independent', 'Team', 'Client', 'Remote', 'Outdoor', 'Research', 'Hands-on', 'Teaching'];
  const education = ['High School', 'Bachelors', 'Masters', 'Doctorate', 'Vocational'];

  const careerData = {
    'Technology': [
      { role: 'Data Scientist', salary: '$90K-$150K', growth: 'Very High', skills: ['Data Analysis', 'Problem Solving'], interests: ['Technology'], work: ['Research', 'Independent'] },
      { role: 'Software Engineer', salary: '$85K-$160K', growth: 'High', skills: ['Technical', 'Problem Solving'], interests: ['Technology'], work: ['Team', 'Independent'] },
      { role: 'AI Engineer', salary: '$110K-$200K', growth: 'Very High', skills: ['Data Analysis', 'Technical'], interests: ['Technology'], work: ['Research', 'Independent'] }
    ],
    'Healthcare': [
      { role: 'Healthcare Manager', salary: '$75K-$130K', growth: 'High', skills: ['Leadership', 'Communication'], interests: ['Healthcare'], work: ['Team', 'Client'] },
      { role: 'Health Researcher', salary: '$70K-$120K', growth: 'High', skills: ['Data Analysis', 'Problem Solving'], interests: ['Healthcare'], work: ['Research', 'Independent'] },
      { role: 'Clinical Coordinator', salary: '$50K-$90K', growth: 'Moderate', skills: ['Communication', 'Leadership'], interests: ['Healthcare'], work: ['Team', 'Hands-on'] }
    ],
    'Business': [
      { role: 'Business Manager', salary: '$70K-$150K', growth: 'Moderate', skills: ['Leadership', 'Communication'], interests: ['Business'], work: ['Team', 'Client'] },
      { role: 'Business Analyst', salary: '$65K-$125K', growth: 'High', skills: ['Data Analysis', 'Problem Solving'], interests: ['Business'], work: ['Team', 'Client'] },
      { role: 'Entrepreneur', salary: 'Variable', growth: 'Very High', skills: ['Leadership', 'Problem Solving'], interests: ['Business'], work: ['Independent', 'Remote'] }
    ],
    'Education': [
      { role: 'Teacher', salary: '$40K-$85K', growth: 'Moderate', skills: ['Communication', 'Creativity'], interests: ['Education'], work: ['Team', 'Teaching'] },
      { role: 'Educational Designer', salary: '$55K-$95K', growth: 'High', skills: ['Creativity', 'Communication'], interests: ['Education'], work: ['Independent', 'Remote'] },
      { role: 'Training Manager', salary: '$65K-$110K', growth: 'Moderate', skills: ['Leadership', 'Communication'], interests: ['Education'], work: ['Team', 'Client'] }
    ],
    'Environment': [
      { role: 'Environmental Scientist', salary: '$60K-$110K', growth: 'High', skills: ['Data Analysis', 'Problem Solving'], interests: ['Environment'], work: ['Research', 'Outdoor'] },
      { role: 'Sustainability Consultant', salary: '$70K-$130K', growth: 'Very High', skills: ['Problem Solving', 'Communication'], interests: ['Environment'], work: ['Client', 'Team'] },
      { role: 'Conservation Manager', salary: '$55K-$100K', growth: 'Moderate', skills: ['Leadership', 'Problem Solving'], interests: ['Environment'], work: ['Outdoor', 'Team'] }
    ],
    'Arts': [
      { role: 'Graphic Designer', salary: '$45K-$95K', growth: 'Moderate', skills: ['Design', 'Creativity'], interests: ['Arts'], work: ['Independent', 'Remote'] },
      { role: 'UX/UI Designer', salary: '$70K-$130K', growth: 'Very High', skills: ['Design', 'Problem Solving'], interests: ['Arts', 'Technology'], work: ['Team', 'Remote'] },
      { role: 'Creative Director', salary: '$80K-$160K', growth: 'High', skills: ['Leadership', 'Creativity'], interests: ['Arts'], work: ['Team', 'Client'] }
    ],
    'Finance': [
      { role: 'Financial Advisor', salary: '$70K-$140K', growth: 'Moderate', skills: ['Communication', 'Problem Solving'], interests: ['Finance', 'Business'], work: ['Client', 'Team'] },
      { role: 'Investment Manager', salary: '$90K-$200K', growth: 'Moderate', skills: ['Data Analysis', 'Problem Solving'], interests: ['Finance'], work: ['Independent', 'Team'] },
      { role: 'Accountant', salary: '$55K-$110K', growth: 'Moderate', skills: ['Data Analysis', 'Problem Solving'], interests: ['Finance', 'Business'], work: ['Independent', 'Team'] }
    ],
    'Social': [
      { role: 'Social Worker', salary: '$45K-$85K', growth: 'High', skills: ['Communication', 'Leadership'], interests: ['Social'], work: ['Client', 'Team', 'Hands-on'] },
      { role: 'Community Manager', salary: '$50K-$90K', growth: 'High', skills: ['Communication', 'Creativity'], interests: ['Social'], work: ['Team', 'Client'] },
      { role: 'Counselor', salary: '$50K-$95K', growth: 'High', skills: ['Communication', 'Leadership'], interests: ['Social'], work: ['Client', 'Hands-on'] }
    ]
  };

  const steps = ['skills', 'interests', 'work', 'education'];
  const idx = steps.indexOf(step);
  const progress = step === 'intro' ? 0 : step === 'results' ? 100 : ((idx + 1) / steps.length) * 100;

  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
      setUser({ name: name || email.split('@')[0], email });
      setEmail('');
      setPassword('');
      setName('');
      setPage('home');
    } else alert('Please enter email and password');
  };

  const handleSignUp = () => {
    if (name && email && password) {
      setUsers([...users, { id: users.length + 1, name, email, date: new Date().toLocaleDateString() }]);
      setIsLoggedIn(true);
      setUser({ name, email });
      setIsSignUp(false);
      setName('');
      setEmail('');
      setPassword('');
      setPage('home');
    } else alert('Please fill all fields');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setPage('auth');
    setStep('intro');
    setSelections({ skills: [], interests: [], work: [], education: '' });
    setRecommendations([]);
  };

  const toggleSelection = (type, val) => {
    setSelections(prev => ({
      ...prev,
      [type]: prev[type].includes(val) ? prev[type].filter(i => i !== val) : [...prev[type], val]
    }));
  };

  const calculateMatch = (career) => {
    let score = 0;
    let total = 0;
    if (selections.skills.length > 0) {
      total += selections.skills.length;
      selections.skills.forEach(s => {
        if (career.skills && career.skills.includes(s)) score += 1;
      });
    }
    if (selections.interests.length > 0) {
      total += selections.interests.length;
      selections.interests.forEach(i => {
        if (career.interests && career.interests.includes(i)) score += 1;
      });
    }
    if (selections.work.length > 0) {
      total += selections.work.length;
      selections.work.forEach(w => {
        if (career.work && career.work.includes(w)) score += 1;
      });
    }
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const getRecommendations = () => {
    setLoading(true);
    setTimeout(() => {
      let all = [];
      selections.interests.forEach(i => {
        if (careerData[i]) all = all.concat(careerData[i]);
      });
      if (all.length === 0) all = Object.values(careerData).flat();
      
      const scored = all.map(c => ({ ...c, match: calculateMatch(c) }));
      const unique = Array.from(new Map(scored.map(c => [c.role, c])).values())
        .sort((a, b) => b.match - a.match)
        .slice(0, 6);
      
      setRecommendations(unique);
      setTotalQuizzes(totalQuizzes + 1);
      setTotalResponses(selections.skills.length + selections.interests.length + selections.work.length + 1);
      setLoading(false);
      setStep('results');
    }, 1500);
  };

  const downloadResults = () => {
    const text = `Career Results\nUser: ${user?.name}\nEmail: ${user?.email}\n\nSelections:\nSkills: ${selections.skills.join(', ')}\nInterests: ${selections.interests.join(', ')}\nWork: ${selections.work.join(', ')}\n\nCareers:\n${recommendations.map((c, i) => `${i + 1}. ${c.role} (${c.match}% match) - ${c.salary}`).join('\n')}`;
    const el = document.createElement('a');
    el.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    el.download = 'results.txt';
    el.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <Briefcase className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
            <h1 className="text-4xl font-bold text-gray-800">Career Path AI</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{isSignUp ? 'Sign Up' : 'Login'}</h2>
          {isSignUp && <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded-lg" />}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded-lg" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 px-4 py-2 border rounded-lg" />
          <button onClick={isSignUp ? handleSignUp : handleLogin} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 mb-4">{isSignUp ? 'Sign Up' : 'Login'}</button>
          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-indigo-600 font-semibold">{isSignUp ? 'Have account? Login' : 'No account? Sign Up'}</button>
          <div className="mt-6 pt-4 border-t text-center text-sm text-gray-600">
            <p className="font-semibold">Demo: demo@example.com / demo123</p>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Career Path AI</h1>
            <div className="flex gap-3">
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
              <p className="text-xl text-gray-600 mb-6">AI-powered career matching based on your skills and interests.</p>
              <button onClick={() => setPage('quiz')} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 mr-4">Start Assessment</button>
              <button onClick={() => setPage('dashboard')} className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-bold">View Analytics</button>
            </div>
            <div className="bg-indigo-200 rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-2xl font-bold text-indigo-600">{users.length}+ Users</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-12">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">Platform Stats</h3>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div><div className="text-4xl font-bold text-indigo-600">{users.length}</div><p className="text-gray-600">Users</p></div>
              <div><div className="text-4xl font-bold text-purple-600">{totalQuizzes}</div><p className="text-gray-600">Quizzes</p></div>
              <div><div className="text-4xl font-bold text-pink-600">{totalResponses}</div><p className="text-gray-600">Responses</p></div>
              <div><div className="text-4xl font-bold text-green-600">89%</div><p className="text-gray-600">Satisfaction</p></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex gap-3">
              <button onClick={() => setPage('home')} className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold">Home</button>
              <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded font-semibold">Logout</button>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6"><h3 className="text-gray-600 font-semibold mb-2">Users</h3><p className="text-4xl font-bold text-indigo-600">{users.length}</p></div>
            <div className="bg-white rounded-xl shadow p-6"><h3 className="text-gray-600 font-semibold mb-2">Quizzes</h3><p className="text-4xl font-bold text-purple-600">{totalQuizzes}</p></div>
            <div className="bg-white rounded-xl shadow p-6"><h3 className="text-gray-600 font-semibold mb-2">Responses</h3><p className="text-4xl font-bold text-pink-600">{totalResponses}</p></div>
            <div className="bg-white rounded-xl shadow p-6"><h3 className="text-gray-600 font-semibold mb-2">Score</h3><p className="text-4xl font-bold text-green-600">87%</p></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[{ w: 'W1', s: 45, c: 38 }, { w: 'W2', s: 62, c: 52 }, { w: 'W3', s: 58, c: 48 }, { w: 'W4', s: 89, c: 76 }]}>
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
              <h3 className="text-xl font-bold text-gray-800 mb-6">Top Careers</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ n: 'Data Sci', c: 145 }, { n: 'Engineer', c: 132 }, { n: 'Designer', c: 89 }, { n: 'Manager', c: 76 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="n" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="c" fill="#4F46E5" />
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Career Path AI</h1>
          </div>
          {step !== 'intro' && (
            <div className="mb-6">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>Progress</span>
                <span className="text-indigo-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {step === 'intro' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Assessment</h2>
                <p className="text-gray-600 mb-8">Answer questions to get accurate career recommendations.</p>
                <button onClick={() => setStep('skills')} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700">Start Quiz</button>
              </div>
            )}
            {step === 'skills' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Skills?</h2>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {skills.map(s => (
                    <button key={s} onClick={() => toggleSelection('skills', s)} className={`p-3 rounded-lg font-semibold ${selections.skills.includes(s) ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{s}</button>
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
                  {interests.map(i => (
                    <button key={i} onClick={() => toggleSelection('interests', i)} className={`p-3 rounded-lg font-semibold ${selections.interests.includes(i) ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{i}</button>
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
                  {workStyles.map(w => (
                    <button key={w} onClick={() => toggleSelection('work', w)} className={`p-3 rounded-lg font-semibold ${selections.work.includes(w) ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{w}</button>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Education?</h2>
                <div className="space-y-3 mb-8">
                  {education.map(e => (
                    <button key={e} onClick={() => setSelections(prev => ({ ...prev, education: e }))} className={`w-full p-3 rounded-lg font-semibold text-left ${selections.education === e ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{e}</button>
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
                    <p className="text-gray-600 font-semibold">Analyzing...</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Careers</h2>
                    <p className="text-gray-600 mb-6">Interests: {selections.interests.join(', ')}</p>
                    <div className="space-y-4 mb-8">
                      {recommendations.map((c, i) => (
                        <div key={i} className="border-l-4 border-indigo-600 bg-indigo-50 p-4 rounded">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-800">{c.role}</h3>
                              <p className="text-sm text-gray-600 mb-2">Salary: {c.salary}</p>
                              <span className={`font-semibold px-2 py-1 rounded text-xs ${c.growth === 'Very High' ? 'bg-green-200 text-green-800' : c.growth === 'High' ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'}`}>Growth: {c.growth}</span>
                            </div>
                            <div className="text-right">
                              <div className="bg-indigo-600 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold">{c.match}%</div>
                              <span className="text-xs text-gray-600">Match</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={downloadResults} className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Download</button>
                      <button onClick={() => setPage('home')} className="bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700">Home</button>
                      <button onClick={() => { setStep('intro'); setSelections({ skills: [], interests: [], work: [], education: '' }); }} className="bg-gray-600 text-white py-2 rounded font-semibold hover:bg-gray-700">Restart</button>
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
