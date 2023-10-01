function Signup(){
    function submit(){
        const email = (document.getElementById("email") as HTMLInputElement).value
        const password = (document.getElementById("password") as HTMLInputElement).value
        fetch('/api/signup',
        {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
              },
            body:JSON.stringify({email:email,password:password})
        }
        ).then(()=>console.log("success")).catch(()=>console.log("error"))
        window.location.href = "/login"
        return ;
    }
    return(
        <>
        <h2>Signup</h2>
        <label>Username
        <input id="email"/>
        </label>
        <label>Password
        <input id="password"/>
        </label>
        <button onClick={submit}>signup</button>
        </>
    )
}
export default Signup