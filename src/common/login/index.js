import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import { actionCreators } from './store';

import {
    LoginWrapper,
    LoginBox,
    Input,
} from './style';

class Login extends Component {
    getLoginBox() {
        // https://dev.to/sivaneshs/add-google-login-to-your-react-apps-in-10-mins-4del
        const clientId = '767966548929-ghusim71l8qt3jv5ub8bhomtfg8t7787.apps.googleusercontent.com';
        return (
            <LoginWrapper>
                <LoginBox>
                    <Input>Please Login via <span className="importantText">UW Email</span></Input>
                    <Input>
                        <GoogleLogin
                            clientId={clientId}
                            buttonText="Sign in"
                            onSuccess={(res) => this.props.onSuccess(res)}
                            onFailure={(error) => this.props.onFailure(error)}
                            cookiePolicy={'single_host_origin'}
                            isSignedIn={true} />
                    </Input>
                </LoginBox>
            </LoginWrapper>
        );
    }

    render() {
        const { login, role } = this.props;
        if (!login) {
            return this.getLoginBox();
        } else {
            if (role === '') return this.getLoginBox();
            else if (role === 'system administrator') {
                return <Redirect to='/systemadministrator/mainpage' />
            }
            else if (role === 'fiscal staff') {
                return <Redirect to='/fiscalstaff/mainpage' />
            }
            else {
                return <Redirect to='/' />
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.getIn(['login', 'login']),
        role: state.getIn(['login', 'user', 'role']),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSuccess(res) {
            console.log('Login, onSuccess, res.profileObj', res.profileObj);
            const profile = res.profileObj;
            const netId = profile.email.split('@')[0];
            dispatch(actionCreators.changeLogin(profile));
            dispatch(actionCreators.initializeUserData(netId));
        },
        onFailure(error) {
            console.log('Login, onFailure, error',error);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);