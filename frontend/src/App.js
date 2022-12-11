import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import NeedAuth from "./Auth/NeedAuth";
import UserList from "./Component/UserList";
import Login from "./Auth/Login";
import UserProvider from "./Context/UserContext";
import Test from './Component/Test';
import RedirectTo from "./Component/RecirecTo";

function App() {





    return (
        <UserProvider>
            <BrowserRouter>
                <div className='d-flex vh-100'>
                    <UserList/>
                    <Routes>
                        <Route path='/' element={<RedirectTo/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path="/:id" element={
                            <NeedAuth>
                                <Test/>
                            </NeedAuth>
                        }/>
                    </Routes>
                </div>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;
