import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation.js'
import Logo from './components/logo/Logo.js'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js'
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'
import Signin from './components/Signin/Signin.js'
import Register from './components/Register/Register.js'
import Rank from './components/Rank/Rank.js'
import Particles from 'react-particles-js';





const particlesOptions={
  
  "particles": {
    "number": {
        "value": 160,
        "density": {
            "enable": false
        }
    },
    "size": {
        "value": 3,
        "random": true,
        "anim": {
            "speed": 4,
            "size_min": 0.3
        }
    },
    "line_linked": {
        "enable": false
    },
    "move": {
        "random": true,
        "speed": 1,
        "direction": "top",
        "out_mode": "out"
    }
},
"interactivity": {
    "events": {
        "onhover": {
            "enable": true,
            "mode": "bubble"
        },
        "onclick": {
            "enable": true,
            "mode": "repulse"
        }
    },
    "modes": {
        "bubble": {
            "distance": 250,
            "duration": 2,
            "size": 0,
            "opacity": 0
        },
        "repulse": {
            "distance": 400,
            "duration": 4
        }
    }
}
}


const initialState = {
  input:'',
  imageUrl:'',
  box: {},
  route : 'signin',
  isSignIn : false,
  user:{
   id:'', 
   name: '',
   email: '',
   entries:0,
   joined: '' 
  }
}

class App extends Component {
  constructor(){
    super()
    this.state = initialState ;
  }

 
 loadUser = (data) =>{
  this.setState({ user: {
    id: data.id, 
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined
}

})

}

calculateFaceLocation = (data) => {
const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
const image = document.getElementById('inputimage')
const width = Number(image.width)
const height = Number(image.height)
return {
leftCol : clarifaiFace.left_col * width,
topRow: clarifaiFace.top_row * height,
rightCol : width - (clarifaiFace.right_col * width),
bottomRow : height - (clarifaiFace.bottom_row * height)
}
}

displayFaceBox =(box) =>{
  
  this.setState({box : box })
}

onInputChange = (event) =>{
this.setState({input: event.target.value})
};

onButtonSubmit= () => {
this.setState({ imageUrl : this.state.input })
fetch('http://localhost:3001/imageurl',{
        method:'post',
        headers:{'content-Type':'application/json'},
        body:JSON.stringify({
          input: this.state.input
          
        })
      })
  .then(response =>response.json())   
  .then(response => {
    if(response){
      fetch('http://localhost:3001/image',{
        method:'put',
        headers:{'content-Type':'application/json'},
        body:JSON.stringify({
          id: this.state.user.id
          
        })
    })
    .then(response =>response.json() )
    .then(count =>{
      this.setState({ user:{
        entries: count
      }})
    })
    .catch( err =>console.log(err))
    this.displayFaceBox(this.calculateFaceLocation(response))
  } })
   
    .catch( err => console.log(err))   
  
}


onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
  } else if (route === 'home') {
    this.setState({isSignIn: true})
  }
  this.setState({route: route});
}



render(){
  const {  imageUrl, box, route, isSignIn } =this.state ;
    return (
      <div className = 'App '>
        
        <Particles className='particles'
          params ={particlesOptions}
        />  
        
        <Navigation isSignIn={isSignIn} onRouteChange={this.onRouteChange}/>
       {route === 'home' 
        ? <div>
         <Logo/>
        <Rank 
          name={this.state.user.name }
          entries= {this.state.user.entries}
        />
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit} />
        
         <FaceRecognition box={ box } imageUrl={ imageUrl}/>
       </div>
       
        :(
          route === 'signin' 
          ? < Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : < Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )

       }
      </div>
    );
  }
}
export default App;
