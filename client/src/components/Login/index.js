import React, {useState} from 'react';

import './styles.css'

const LoginForm = ({onSubmit})=>{
    const [mainPassWord, changePassWord] = useState('');
    return(
        <div className = 'form-wrapper'>
            <div className = 'title'>
                {'Insert Main Password'}
            </div>
            <input
                type = 'text'
                placeholder = 'Password'
                value = {mainPassWord}
                onChange = {e => changePassWord(e.target.value)}
            />
            <button className = 'submit' onClick = {()=> onSubmit()}>
                {'Submit'}
            </button>
        </div>
    )
}

export default LoginForm