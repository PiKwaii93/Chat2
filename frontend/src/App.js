import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import NeedAuth from "./Auth/NeedAuth";
import UserList from "./Component/UserList";
import Login from "./Auth/Login";
import UserProvider from "./Context/UserContext";
import Test from './Component/Test';
import RedirectTo from "./Component/RecirecTo";
import UserProfil from './Component/UserProfil';
import JWTLogin from './Component/JWTLogin';
import './App.css';
import profil from "./Ressource/profil.svg"

function App() {
    
    return (
        <UserProvider>
            <BrowserRouter>
                <div className='d-flex vh-100'>
                    <UserList/>
                    <Link to="/profil"><img className='position-absolute bottom-0 start-0 mb-1 ml-5' src={profil} style={{width:"50px", marginLeft: "0.25rem!important"}}/></Link>
                    <Routes>
                        <Route path='/' element={<RedirectTo/>}/>
                        <Route path='/jwt/:jwt' element={<JWTLogin/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path="/:id" element={
                            <NeedAuth>
                                <Test/>
                            </NeedAuth>
                        }/>
                        <Route path="/profil" element={
                            <NeedAuth>
                                <UserProfil/>
                            </NeedAuth>
                        }/>
                    </Routes>
                </div>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;
