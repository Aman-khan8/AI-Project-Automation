import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './onboarding/StepIndicator';
import Step0Welcome from './onboarding/Step0Welcome';
import Step1Name from './onboarding/Step1Name';
import Step2Role from './onboarding/Step2Role';
import Step3Goals from './onboarding/Step3Goals';
import Step4WorkStyle from './onboarding/Step4WorkStyle';
import StepComplete from './onboarding/StepComplete';
const TOTAL_STEPS = 4;
// ─── Main component ───────────────────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: '',
    email: '',
    role: '',
    goals: [],
    workStyle: '',
    password:"",
    confirmPassword:"",
  })

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }))
  const next = () => setStep((s) => s + 1)
  const back = () => setStep((s) => s - 1)
 const  onGoToDashboard=async() => {
  try{
 delete data.confirmPassword;
    console.log(data);
  const sendData=await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, data);
  if(sendData.status===201){
    console.log("Signup data sent successfully");
      navigate('/')
  }
  else{
    console.error("Failed to send signup data");
  }
}catch(err){
  console.error("Error sending signup data:", err.message);
}}

  const isComplete = step === TOTAL_STEPS

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        {/* Progress bar + skip */}
        {step > 0 && !isComplete && (
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <StepIndicator current={step} total={TOTAL_STEPS} />
            <button
              onClick={() => navigate('/dashboard')}
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              Skip setup
            </button>
          </div>
        )}

        {/* Card */}
        <div className={`bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 sm:p-10 shadow-2xl ${
          step === 0 || isComplete ? 'text-center' : ''
        }`}>
          {step === 0 && <Step0Welcome onNext={next} />}
          {step === 1 && <Step1Name data={data} onChange={set} onNext={next} onBack={back} TOTAL_STEPS={TOTAL_STEPS} />}
          {step === 2 && <Step2Role data={data} onChange={set} onNext={next} onBack={back} TOTAL_STEPS={TOTAL_STEPS} />}
          {step === 3 && <Step3Goals data={data} onChange={set} onNext={next} onBack={back} TOTAL_STEPS={TOTAL_STEPS} />}
          {step === 4 && !isComplete && <Step4WorkStyle data={data} onChange={set} onNext={next} onBack={back} TOTAL_STEPS={TOTAL_STEPS} />}
          {isComplete && <StepComplete data={data} onGoToDashboard={onGoToDashboard} />}
        </div>

        {/* Step counter */}
        {step > 0 && !isComplete && (
          <p className="text-center text-slate-600 text-xs mt-4 animate-fade-in">
            Step {step} of {TOTAL_STEPS - 1}
          </p>
        )}

      </div>
    </div>
  )
}

