import React from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router';
import { logoutReducer } from '../reducers/user';
import { emptyReducer } from '@/reducers/ids';

function logout() {
    
    const dispatch = useDispatch();
    const router = useRouter();
    
    // Remove token from localStorage
    localStorage.removeItem("token");
    
    // Remove user data from Redux store
    dispatch(logoutReducer());
    dispatch(emptyReducer())
    
    // Redirect on login page
    router.replace("/login");

  return (<div>logout..</div>);
}

export default logout