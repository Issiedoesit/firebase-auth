import React from 'react'
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth } from '../../../utils/firebase'
import Template from '../Template/Template'

const Home = () => {

    const [user, loading] = useAuthState(auth)
    console.log(user);

    return (
        <Template>
            {
                user != null
                &&
                <div>Welcome {user.displayName}</div>
            }
        </Template>
    )
}

export default Home