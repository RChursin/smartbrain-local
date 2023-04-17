import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import ParticlesBg from 'particles-bg';
import './App.css';
import 'tachyons';

const returnClarifaiRequestOptions = (imageUrl) => {
const PAT = 'a69ee9872baf42e29b59e1196d9b46e7';
const USER_ID = 'ganstacoder';
const APP_ID = 'my-first-application';
const IMAGE_URL = imageUrl;

const  raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
        ]
});
const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};
return requestOptions
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.onButtonSubmit = this.onButtonSubmit.bind(this);
        this.calculateFaceLocation = this.calculateFaceLocation.bind(this);
        this.displayFaceBox = this.displayFaceBox.bind(this);
    }

    calculateFaceLocation(data) {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox(box) {
        console.log(box);
        this.setState({ box: box });
    }

    onInputChange(event) {
        this.setState({ input: event.target.value });
    }

    onButtonSubmit() {
        this.setState({ imageUrl: this.state.input });
        // app.models.predict('face-detection', this.state.input)
        fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", returnClarifaiRequestOptions(this.state.input))
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(error => console.log('error', error));
    }

    onRouteChange = (route) => {
        this.setState({ route: route });
    }


    render() {
        return (
            <div className="App">
                <ParticlesBg color="#FFFFFF" type="cobweb" bg={true} />
                <Navigation onRouteChange={this.onRouteChange}/>
                { this.state.route === 'signin'
                    ? <Signin onRouteChange={this.onRouteChange}/>
                    : <div>
                    <Logo />
                    <Rank />
                    <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                    <FaceRecognition box={this.state.box} imageUrl={this.state.input} />
                    </div>
                }
            </div>
        );
    }
}

export default App;
