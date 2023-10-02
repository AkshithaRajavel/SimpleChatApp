function Signup(){
    async function submit(){
        const email = (document.getElementById("email") as HTMLInputElement).value
        const password = (document.getElementById("password") as HTMLInputElement).value
        const response  = await fetch('/api/signup',
        {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
              },
            body:JSON.stringify({email:email,password:password})
        }
        )
        if(response.status == 200){window.location.href = "/login"}
        else{
            const payload = await response.json();
            (document.getElementById("error")as HTMLDivElement).innerText = payload.message
        }
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
        <div id="error"></div>
        </>
    )
}
export default Signup