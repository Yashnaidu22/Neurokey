import React from 'react'
import axios from 'axios'
import { useState, useRef } from 'react'
// import "../assets/script"
import { Navigate, useNavigate } from 'react-router-dom'
import '../style/SignInPageStyle.css'

const SignInPage = () => {
  const [showGraph, setShowGraph] = useState(false);
  const [keyStrokeData, setkeyStrokeData] = useState({})
  const [temporaryBiometricData, settemporaryBiometricData] = useState([]) //dwell-flight-interKey
  const Navigate = useNavigate();
  const [errorMessage, seterrorMessage] = useState("")
  const [formData, setformData] = useState({})
  // if (typingPatternMismatch) {
  //   setShowGraph(true);
  // }
  const onEmailChange = (e) => {
    setformData({ ...formData, email: e.target.value })
  }

  const onPasswordChange = (e) => {
    setformData({ ...formData, password: e.target.value })
  }

  let lastKeyDownTime = useRef(null);
  let lastKeyUpTime = useRef(null);
  let lastInterKeyInterval = useRef(null);
  let lastFlightTime = useRef(null);
  let lastDwellTime = useRef(null);


  const handleKeyDown = (e) => {
    const timestamp = e.timeStamp;
    let interKeyInterval = null;
    let flightTime = null;
    if (lastKeyDownTime.current != null) {
      interKeyInterval = timestamp - lastKeyDownTime.current;
    }
    if (lastKeyUpTime.current != null) {
      flightTime = timestamp - lastKeyUpTime.current;
    }
    lastKeyDownTime.current = timestamp;
    lastInterKeyInterval.current = interKeyInterval;
    lastFlightTime.current = flightTime;
  }

  const handleKeyUp = (e) => {
    const timestamp = e.timeStamp;
    const dwellTime = timestamp - lastKeyDownTime.current;
    lastKeyUpTime.current = timestamp;
    lastDwellTime.current = dwellTime;
    updateTemporaryBiometricData();
  }

  const updateTemporaryBiometricData = () => {
    settemporaryBiometricData([
      ...temporaryBiometricData,
      { dwellTime: lastDwellTime.current, flightTime: lastFlightTime.current, interKeyInterval: lastInterKeyInterval.current }
    ]);

    lastDwellTime.current = null;
    lastFlightTime.current = null;
    lastInterKeyInterval.current = null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let dwellSum = 0, flightSum = 0, interKeySum = 0;
    let dwellCount = 0, flightCount = 0, interKeyCount = 0;

    temporaryBiometricData.forEach(item => {
      if (item.dwellTime != null) {
        dwellSum += item.dwellTime;
        dwellCount++;
      }
      if (item.flightTime != null) {
        flightSum += item.flightTime;
        flightCount++;
      }
      if (item.interKeyInterval != null) {
        interKeySum += item.interKeyInterval;
        interKeyCount++;
      }
    });

    const avgDwellTime = dwellCount > 0 ? dwellSum / dwellCount : 0;
    const avgFlightTime = flightCount > 0 ? flightSum / flightCount : 0;
    const avgInterKeyInterval = interKeyCount > 0 ? interKeySum / interKeyCount : 0;

    await axios.post("http://localhost:3000/signIn/", { formData, dwellTime: avgDwellTime, flightTime: avgFlightTime, interKeyInterval: avgInterKeyInterval })
      .then((res) => {
        const out = res.data.out
        if (out == true) {
          alert("Sign In Success")
          Navigate("/HomePage") // Replace with actual home page route
        }
        else {
          setShowGraph(true);
          seterrorMessage("Email Or Password is incorrect")
        }
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    // <div>
    // <form onSubmit={handleSubmit}>
    //   <input type="email" placeholder='Email' onChange={onEmailChange} required />
    //   <input type="password" placeholder='Password' onChange={onPasswordChange} id="inputField" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} required />
    //   <button type='submit'>Sign In</button>
    // </form>
    // <div>
    //   {errorMessage}
    // </div>
    // </div>

    <div className="signInPageDiv">
      <div className={`signInContainer ${showGraph ? 'imposterDetected' : ''}`}>
        <div className={`formDiv ${showGraph ? 'imposterGlow' : ''}`}>
          <form onSubmit={handleSubmit} className='signInForm'>
            <input type="email" placeholder='Email' onChange={onEmailChange} required /><br></br>
            <input type="password" placeholder='Password' onChange={onPasswordChange} id="inputField" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} required />
           <br></br> <button type='submit'>Sign In</button>
          </form>
          <div>
            {errorMessage}
          </div>
        </div>

        <div className={`graphContainer ${showGraph ? 'show' : ''}`}>
          <div className="graphContent">
            <div className="graphImagePlaceholder">
              <img src="your-graph-image.png" alt="Graph" />
            </div>
            <div className="analysisText">
              <strong>Anomaly Detected:</strong> Your typing pattern does not match the registered biometric profile.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
