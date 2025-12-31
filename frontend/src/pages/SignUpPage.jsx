import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../style/SignUpPageStyle.css'

const SignUpPage = () => {
    // const [emailValue, setemailValue] = useState("")
    // const [passwordValue, setpasswordValue] = useState("")
    const Navigate = useNavigate();
    const [displayMessage, setdisplayMessage] = useState("")
    const [formData, setformData] = useState({})
    const onEmailChange = (e) => {
        setformData({ ...formData, email: e.target.value })
    }
    const onPasswordChange = (e) => {
        setformData({ ...formData, password: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const password = formData.password
        if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) {
            await axios.post("http://localhost:3000/signUp/", { formData })
                .then((res) => {
                    console.log(res)
                    const userExists = res.data.out
                    console.log(userExists, "userexists")
                    if (userExists == true) {
                        setdisplayMessage(res.data.message)
                    }
                    else {
                        Navigate("/signInPage")
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            setdisplayMessage("Password doesn't meet specific criteria")
        }

    }
    const onSignInButtonClick = () => {
        Navigate("/signInPage")
    }
    return (
        <div className='signUpPageDiv'>
            <div className='formDiv'>
                <form onSubmit={handleSubmit} className='form'>
                    {/* <label>email: </label> */}
                    <input type="email" placeholder='enter email' name='email' onChange={onEmailChange} className='inputField'></input><br />
                    {/* <label>password: </label> */}
                    <input type="text" placeholder='enter password' name='password' onChange={onPasswordChange} className='inputField'></input><br />
                    <input type='submit' className='submitBtn'></input>
                </form>
            </div>
            <hr style={{width:"100%"}}/>
            <div className='errorMsgDiv'>{displayMessage}</div>
            <div className='signInButtonDiv'><p>Already have an account? </p><button onClick={onSignInButtonClick}>Sign In</button></div>
        </div>
    )
}

export default SignUpPage
