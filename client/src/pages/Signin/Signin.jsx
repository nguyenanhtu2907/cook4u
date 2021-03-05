import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { signupApi, signinApi, signinGoogleApi } from '../../api/index';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';

import { useWindowHeightAndWidth } from '../commons/custom/useWindowHeightAndWidth';
import './styles.sass';
import GoogleIcon from './icon';
import {signin} from '../../actions/user';

function Signin(props) {
    const { type } = props;   //type: signin or signup
    const [height, width] = useWindowHeightAndWidth();
    const history = useHistory();
    const dispatch = useDispatch();

    const [messageFrDb, setMessageFrDb] = useState({
        success: false,
        message: ''
    });
    //toggle signin signup
    const signupFormik = useFormik({
        initialValues: {
            username: '',
            password: '',
            name: '',
            confirm_password: '',
            phone: '',
            gender: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Trường này là bắt buộc!!!'),
            username: Yup.string()
                .min(6, 'Tên đăng nhập tối thiểu 6 ký tự!!!')
                .required('Trường này là bắt buộc!!!'),
            password: Yup.string()
                .min(6, 'Mật khẩu tối thiểu 6 ký tự!!!')
                .required('Trường này là bắt buộc!!!'),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Mật khẩu nhập lại chưa đúng!!!')
                .required('Trường này là bắt buộc!!!'),
            phone: Yup.string()
                .required('Trường này là bắt buộc!!!'),
            gender: Yup.string()
                .required('Trường này là bắt buộc!!!'),
        }),
        onSubmit: async (values) => {
            const { data } = await signupApi(values);

            setMessageFrDb({ ...data });
            signupFormik.handleReset()
        },
    });
    if (messageFrDb.message && messageFrDb.success) {
        setTimeout(() => {
            history.push('/user/signin')
            setMessageFrDb({
                success: false,
                message: ''
            })
        }, 3000);
    }
    const signinFormik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Trường này là bắt buộc!!!'),
            password: Yup.string()
                .required('Trường này là bắt buộc!!!'),
        }),
        onSubmit: async (values) => {
            const { data } = await signinApi(values);

            if(data.message){
                setMessageFrDb({ ...data });
                signupFormik.handleReset()
            }else{
                dispatch(signin(data, history))
                signinFormik.handleReset()
            }

        },
    });

    //handle google function
    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            const {data} = await signinGoogleApi(result);
            dispatch({ type: 'SIGNIN', payload: { result: data, token } });
            history.push('/')
        } catch (error) {
            console.log(error);

        }
    }

    const googleFailure = () => {
        console.log('Google Sign In was unsuccessful. Try again later');
    }

    return (
        <div className="signin-page">
            <div className="bg-black">

                <form onSubmit={type === 'signup' ? signupFormik.handleSubmit : signinFormik.handleSubmit} className="signin-form shadow">
                    <span className="signin-form--title">{type === 'signin' ? 'Đăng nhập' : 'Đăng ký'}</span>
                    <p>Let's cook with us <FavoriteIcon style={{ position: 'relative', top: '5px', color: 'red' }} /> </p>

                    {messageFrDb.message && (
                        <span className={`signin-form--option ${messageFrDb.success ? "success-message" : "failure-message"}`}>
                            {messageFrDb.message}
                        </span>
                    )}

                    {type === 'signup' && (
                        <div className={`${width < 768 && "flex-column"} signin-form--control`}>
                            <label htmlFor="name">Tên đầy đủ: </label>
                            <input
                                className="signin-form--control__input"
                                id="name"
                                name="name"
                                type="text"
                                autoComplete='off'
                                onChange={signupFormik.handleChange}
                                onBlur={signupFormik.handleBlur}
                                value={signupFormik.values.name}
                            />
                            {signupFormik.touched.name && signupFormik.errors.name ? (
                                <div className="signin-form--control__error">{signupFormik.errors.name}</div>
                            ) : null}
                        </div>
                    )}

                    <div className={`${width < 768 && "flex-column"} signin-form--control`}>
                        <label htmlFor="username">Tên đăng nhập:</label>
                        <input
                            className="signin-form--control__input"
                            id="username"
                            name="username"
                            type="text"
                            autoComplete='off'
                            onChange={type === 'signup' ? signupFormik.handleChange : signinFormik.handleChange}
                            onBlur={type === 'signup' ? signupFormik.handleBlur : signinFormik.handleBlur}
                            value={type === 'signup' ? signupFormik.values.username : signinFormik.values.username}
                        />
                        {type === 'signup' ?
                            signupFormik.touched.username && signupFormik.errors.username ? (
                                <div className="signin-form--control__error">{signupFormik.errors.username}</div>
                            ) : null :
                            signinFormik.touched.username && signinFormik.errors.username ? (
                                <div className="signin-form--control__error">{signinFormik.errors.username}</div>
                            ) : null
                        }
                    </div>

                    <div className={`${width < 768 && "flex-column"} signin-form--control`}>
                        <label htmlFor="password">Mật khẩu:</label>
                        <input
                            className="signin-form--control__input"
                            id="password"
                            name="password"
                            type="password"
                            onChange={type === 'signup' ? signupFormik.handleChange : signinFormik.handleChange}
                            onBlur={type === 'signup' ? signupFormik.handleBlur : signinFormik.handleBlur}
                            value={type === 'signup' ? signupFormik.values.password : signinFormik.values.password}
                        />
                        {type === 'signup' ?
                            signupFormik.touched.password && signupFormik.errors.password ? (
                                <div className="signin-form--control__error">{signupFormik.errors.password}</div>
                            ) : null :
                            signinFormik.touched.password && signinFormik.errors.password ? (
                                <div className="signin-form--control__error">{signinFormik.errors.password}</div>
                            ) : null
                        }
                    </div>

                    {type === 'signup' && (
                        <>
                            <div className={`${width < 768 && "flex-column"} signin-form--control`}>
                                <label htmlFor="confirm_password">Nhập lại mật khẩu:</label>
                                <input
                                    className="signin-form--control__input"
                                    id="confirm_password"
                                    name="confirm_password"
                                    type="password"
                                    onChange={signupFormik.handleChange}
                                    onBlur={signupFormik.handleBlur}
                                    value={signupFormik.values.confirm_password}
                                />
                                {signupFormik.touched.confirm_password && signupFormik.errors.confirm_password ? (
                                    <div className="signin-form--control__error">{signupFormik.errors.confirm_password}</div>
                                ) : null}
                            </div>
                            <div className={`${width < 768 && "flex-column"} signin-form--control`}>
                                <label htmlFor="phone">Số điện thoại:</label>
                                <input
                                    className="signin-form--control__input"
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    autoComplete='off'
                                    onChange={signupFormik.handleChange}
                                    onBlur={signupFormik.handleBlur}
                                    value={signupFormik.values.phone}
                                />
                                {signupFormik.touched.phone && signupFormik.errors.phone ? (
                                    <div className="signin-form--control__error">{signupFormik.errors.phone}</div>
                                ) : null}
                            </div>

                            <div className={`${width < 768 && "flex-column"} signin-form--control`}>
                                <label htmlFor="gender">Giới tính:</label>
                                <div role="group" aria-labelledby="gender"
                                    id="gender"
                                    onChange={signupFormik.handleChange}
                                    onBlur={signupFormik.handleBlur}
                                    value={signupFormik.values.gender}
                                >
                                    <div>
                                        <label className="radio-formik">
                                            <input type="radio" name="gender" value="Nam" /> Nam
                                        </label>
                                        <label className="radio-formik">
                                            <input type="radio" name="gender" value="Nữ" /> Nữ
                                        </label>
                                        <label className="radio-formik">
                                            <input type="radio" name="gender" value="Khác" /> Khác
                                        </label>
                                    </div>
                                </div>


                                {signupFormik.touched.gender && signupFormik.errors.gender ? (
                                    <div className="signin-form--control__error">{signupFormik.errors.gender}</div>
                                ) : null}
                            </div>
                        </>
                    )}
                    {/* button */}
                    <button type="submit" className={`button-submit ${width <= 1024 && 'full-width'}`}>{type === 'signup' ? "Đăng ký ngay" : "Đăng nhập ngay"}</button>
                    {type === 'signin' && (
                        <>
                            <span className="option-signin">
                                hoặc
                            </span>
                            <GoogleLogin
                                clientId="653628001713-nlgihikvcd6rp6kg3k0qrnbkvs6emosr.apps.googleusercontent.com"
                                icon={true}
                                onSuccess={googleSuccess}
                                onFailure={googleFailure}
                                cookiePolicy="single_host_origin"
                                render={(renderProps) => (
                                    <button
                                        className={`google-button button-submit ${width <= 1024 && 'full-width'}`}

                                        onClick={renderProps.onClick}
                                        disabled={renderProps.disabled}

                                    ><div style={{ position: 'relative', top: '-18px' }}> Đăng nhập với Google {<GoogleIcon />}</div></button>
                                )}
                            />
                        </>
                    )}
                    {type === 'signup' ? (
                        <span className='signin-form--option'>Bạn đã có tài khoản? <Link to="/user/signin" >Đăng nhập ngay</Link> </span>
                    ) : (
                            <span className='signin-form--option'>Bạn chưa có tài khoản? <Link to="/user/signup" >Đăng ký ngay</Link> </span>
                        )}
                </form>
            </div>
        </div>
    );
}

export default Signin;