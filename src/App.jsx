import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export default function CareerPathAI() {
  const [currentPage, setCurrentPage] = useState('auth'); // auth / quiz
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, email: 'demo@example.com', name: 'Demo User', joinDate: '2024-11-01', lastLogin: '2024-11-12', completedQuiz: true }
  ]);

  const [step, setStep] = useState('skills'); // skills / interests / workstyle / education
  const [selections, setSelections] = useState({
    skills: [],
    interests: [],
    workStyle: [],
    education: null
  });
  const [recommendations, setRecommendations] = useState([]);

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
    ]
  };

  const steps = ['skills', 'interests', 'workstyle', 'education'];
  const COLORS = ['#4F46E5', '#06B6D4', '#EC4899', '#F59E0B', '#10B981'];

  // ---------------- Authentication ----------------
  const handleLogin = () => {
    const user = users.find(u => u.email === userEmail);
    if (user && userPassword === 'demo123') {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setUserEmail('');
      setUserPassword('');
    } else {
      alert('Invalid credentials. Demo: demo@example.com / demo123');
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
    setStep('skills');
    setSelections({ skills: [], interests: [], workStyle: [], education: null });
    setRecommendations([]);
  };

  // ---------------- Quiz Selection ----------------
  const toggleSelection = (category, value) => {
    setSelections(prev => ({
      ...prev,
      [category]: category === 'education'
        ? value
        : prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const nextStep = () => {
    const currentIdx = steps.indexOf(step);
    if (currentIdx < steps.length - 1) {
      setStep(steps[currentIdx + 1]);
    } else {
      generateRecommendations();
    }
  };

  // ---------------- Generate Recommendations ----------------
  const generateRecommendations = () => {
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

    const uniqueCareers = [...new Set(matched.map(c => c.role))]
      .map(role => matched.find(c => c.role === role))
      .slice(0, 6);

    setRecommendations(uniqueCareers);
  };

  // ---------------- Visualization Data ----------------
  const skillData = selections.skills.map(skill => ({ name: skill, value: 1 }));
  const interestData = selections.interests.map(interest => ({ name: interest, value: 1 }));

  // ---------------- Render ----------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <Briefcase className="w-10 h-10 mx-auto text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Career Path AI</h1>
          </div>
          {isSignUp && <input placeholder="Full Name" value={userName} onChange={e => setUserName(e.target.value)} className="w-full mb-4 px-4 py-3 border rounded-lg"/>}
          <input placeholder="Email" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full mb-4 px-4 py-3 border rounded-lg"/>
          <input placeholder="Password" type="password" value={userPassword} onChange={e => setUserPassword(e.target.value)} className="w-full mb-6 px-4 py-3 border rounded-lg"/>
          <button onClick={isSignUp ? handleSignUp : handleLogin} className="w-full bg-indigo-600 text-white py-3 rounded-lg mb-4">{isSignUp ? 'Sign Up' : 'Login'}</button>
          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-indigo-600">{isSignUp ? 'Already have account? Login' : 'No account? Sign Up'}</button>
        </div>
      </div>
    );
  }

  // ---------------- Quiz / Results ----------------
  return (
    <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Career Path AI</h2>

        {/* ---------------- Charts ---------------- */}
        <div className="flex flex-wrap gap-6 mb-6 justify-center">
          {skillData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow w-80">
              <h3 className="text-xl font-bold mb-4">Your Skills</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={skillData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {skillData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {interestData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow w-80">
              <h3 className="text-xl font-bold mb-4">Your Interests</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={interestData}>
                  <XAxis dataKey="name"/>
                  <YAxis allowDecimals={false}/>
                  <Tooltip/>
                  <Bar dataKey="value" fill="#4F46E5"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ---------------- Quiz Options ---------------- */}
        {step !== 'results' && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-2xl font-bold mb-4 capitalize">{step}</h3>
            <div className="flex flex-wrap gap-2">
              {step === 'skills' && skillOptions.map(opt => (
                <button
                  key={opt}
                  className={`px-4 py-2 rounded-lg border ${selections.skills.includes(opt) ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={() => toggleSelection('skills', opt)}
                >
                  {opt}
                </button>
              ))}
              {step === 'interests' && interestOptions.map(opt => (
                <button
                  key={opt}
                  className={`px-4 py-2 rounded-lg border ${selections.interests.includes(opt) ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={() => toggleSelection('interests', opt)}
                >
                  {opt}
                </button>
              ))}
              {step === 'workstyle' && workStyleOptions.map(opt => (
                <button
                  key={opt}
                  className={`px-4 py-2 rounded-lg border ${selections.workStyle.includes(opt) ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={() => toggleSelection('workStyle', opt)}
                >
                  {opt}
                </button>
              ))}
              {step === 'education' && educationOptions.map(opt => (
                <button
                  key={opt}
                  className={`px-4 py-2 rounded-lg border ${selections.education === opt ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={() => toggleSelection('education', opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button onClick={() => {
              if(step === 'education') {
                generateRecommendations();
                setStep('results');
              } else nextStep();
            }} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">{step === 'education' ? 'See Results' : 'Next'}</button>
          </div>
        )}

        {/* ---------------- Recommendations ---------------- */}
        {step === 'results' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Recommended Careers</h3>
            <ul className="list-disc pl-6">
              {recommendations.map((c, i) => (
                <li key={i} className="mb-2">
                  <strong>{c.role}</strong>: {c.description} <br/>
                  <em>Salary:</em> {c.salary} | <em>Growth:</em> {c.growth}
                </li>
              ))}
            </ul>
            <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}
