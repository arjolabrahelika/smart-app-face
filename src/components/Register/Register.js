import React from 'react' 
import './Register.css'

class Register extends React.Component {

   constructor(props){
    super(props);
    this.state={
      email:'',
      password:'',
      name:'',
      errors:{}
    }
    this.handleChange = this.onSubmitRegister.bind(this);
  }



  onEmailChange = (event)=>{
    this.setState({ email: event.target.value})
  }

  onPasswordChange = (event)=>{
    this.setState({ password: event.target.value})
  }
  onNameChange = (event)=>{
    this.setState({ name: event.target.value})
  }

  
  validateForm () {

    const { email, password, name} = this.state
    let errors = {};
    let formIsValid = true;


    if (!name) {
      formIsValid = false;
      errors["username"] = "*Please enter your username.";
    }

    if (typeof name !== "undefined") {
      if (!name.match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["username"] = "*Please enter alphabet characters only.";
      }
    }

    if (!email) {
      formIsValid = false;
      errors["emailId"] = "*Please enter your email-ID.";
    }

    if (typeof email !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(email)) {
        formIsValid = false;
        errors["emailId"] = "*Please enter valid email-ID.";
      }
    }

  
    if (!password) {
      formIsValid = false;
      errors["password"] = "*Please enter your password.";
    }

    
    this.setState({
      errors: errors
    });
    return formIsValid;
  }
  
onSubmitRegister= (e) =>{
  e.preventDefault();
  if( this.validateForm()){
  fetch('https://secure-citadel-45276.herokuapp.com/register',{
    method:'post',
    headers:{'content-Type':'application/json'},
    body:JSON.stringify({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password 
    })
  }).then(response=>response.json())
  .then(user =>{
     if(user.id){
     this.props.loadUser(user)
      this.props.onRouteChange('home'); 
     }
  })
  
}
}


  render(){
    
  return(
    <article className="br5 ba  b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">  
     <main className="pa4 black-80">
      <div className="measure ">
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f1 fw6 ph0 mh0">Sign Up</legend>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
              type="text" name="name" 
              id="name"
              onChange={this.onNameChange}
              />
            <div className="errorMsg">{this.state.errors.username}</div> 
          </div>
          
          <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
              type="email" name="email-address"  
              id="email-address"
              onChange={this.onEmailChange}
              />
              <div className="errorMsg">{this.state.errors.emailId}</div>
          </div>
          <div className="mv3">
            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
              type="password" name="password" 
              id="password"
              onChange={this.onPasswordChange}
               />
               <div className="errorMsg">{this.state.errors.password}</div>
          </div>
     
        </fieldset>
        <div className="">
          <input 
         
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
          type="submit" 
          value="Register"
          onClick = {this.onSubmitRegister}

          />
        </div>
       
      </div>
     </main>
    </article>
    );
}

}
export default Register ;