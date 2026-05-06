import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../state/store';
import { LoginApiService } from '../api/login/login-api-service';
import { StorageService } from '../api/storage/storageService';
import { saveLoginDataAction } from '../login/state/loginSlice';

interface Props {
    children: ReactNode;
    doctorOnly?: boolean;
    // adminOnly?: boolean;
}

const AuthGuard = ({ children, doctorOnly }: Props) => {
    const loginData = useSelector((s: RootState) => s.loginData)
    const loginApiService: LoginApiService = new LoginApiService()
    const storageService: StorageService = new StorageService()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const auth = useSelector((state: RootState) => state.loginData)

    const { authorized, isDoctor } = useSelector(
        (state: RootState) => state.loginData
    );
    const [loading, setLoading] = useState(true);
    // let loading = false;

    const getMe = async () => {
        try {
            const response = await loginApiService.getMe()
            if (response.success) {
                dispatch(saveLoginDataAction(response?.data))
                storageService.setToken(response?.data?.accessToken)
            }
        } catch (error: any) {
            console.log(error);
        } finally {
            // loading = false
            setLoading(false);
        }
    }

    useEffect(() => {
        const token = storageService.getToken();
        if (!token) {
            setLoading(false);
            return;
        }

        if (!authorized) {
            getMe();
        } else {
            setLoading(false);
        }
        // if (storageService.getToken() && !auth.authorized) {
        //     loading = true
        //     getMe();
        // }
        // if (!loginData?.authorized && !loading) {
        //     navigate('/');
        // }
        // if (!storageService.getToken()) {
        //     navigate('/');
        // }
    }, [])

    if (loading) return null; // or spinner

    if (!authorized) {
        return <Navigate to="/" replace />;
    }

    // if (doctorOnly && isDoctor !== 1) {
    //     return <Navigate to="/unauthorized" replace />;
    // }
    if (doctorOnly) {
    const validDoctor = loginData.isDoctor === 1;
    if (validDoctor) {
        console.log(
            'Unauthorized access blocked by AuthGuard:',
            loginData
        );
        return <Navigate to="/unauthorized" replace />;
    }
}

    return <>{children}</>;
    
    // return  (
    //     <Fragment>
    //         <React.Fragment>{component}</React.Fragment>
    //     </Fragment>
    // )


}

export default AuthGuard;