import { Outlet, Link } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "../App";
function Layout(){
  const {isLoggedIn,setIsLoggedIn,user} = useContext(MainContext)
  function logout(){
    window.localStorage.clear()
    setIsLoggedIn(false)
  }
    return(
        <div className="container">
        <div id="main"className="row">
        <nav className="col-1">
            <h2 >Chat App</h2>
            {isLoggedIn?
            <div>
              <b><i>{user}</i></b>
              <Link className="nav-link" to="/" >Home</Link><br/>
              <a className="nav-link" onClick={logout}>Logout</a>
              </div>:
              <div>
                <Link className="nav-link" to="/login"  >Login</Link><br/>
              <Link className="nav-link" to="/signup" >Signup</Link><br/>
              </div>
            }
        </nav>
        <div className="col-10">
        <Outlet />
        </div>
        </div>
        </div>
    )
}
export default Layout