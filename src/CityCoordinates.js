import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import './index.css'; // Import your CSS file
import Notification1 from './Notification1';
import InputSlider from 'react-input-slider'; // Import the slider component
import ExploreIcon from '@mui/icons-material/Explore';
import PersonPinCircleRoundedIcon from '@mui/icons-material/PersonPinCircleRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';


function CityCoordinates() {
  const [cityName, setCityName] = useState('');
  const [desLatitude, setDesLatitude] = useState(null);
  const [desLongitude, setDesLongitude] = useState(null);
  const [srcLatitude, setSrcLatitude] = useState(null);
  const [srcLongitude, setSrcLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [myLocationName,setMyLocationName]= useState("");
  const [myLocationCityName,setMyLocationCityName]= useState("");
  const [desLocationName,setDesLocationName]= useState("");
  const [desLocationCityName,setDesLocationCityName]= useState("");
  const [disError, setDisError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [thresholdDistance, setThresholdDistance] = useState(10); // Initial threshold distance

  const apiKey = '64bd257a6829dd4339154ca8a4d60a4f'; // Replace with your actual API key
 

  const sliderRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(getDistance, 1 * 1000); // 5 minutes in milliseconds
    return () => {
      clearInterval(interval);
    };
  });
  useEffect(() => {
    getMyLocationCoordinates();
    getMyLocationName();
    
    console.log("expensive")
   },[]);
  
  useEffect(() => {
    const interval = setInterval(getMyLocationCoordinates, 1 * 1000); // 5 minutes in milliseconds
    return () => {
      clearInterval(interval);
    };
  });
  useEffect(() => {
    const interval = setInterval(getMyLocationName, 120 * 1000); // 2 minutes in milliseconds
    return () => {
      clearInterval(interval);
    };
  });   
  useEffect(() => {
    if (desLatitude !== null && desLongitude !== null) {
      getDesLocationName();
    }
  }, [desLatitude, desLongitude]);
  
  useEffect(() => {
    if (srcLatitude !== null && srcLongitude !== null) {
      getMyLocationName();
    }
  }, [srcLatitude, srcLongitude]);

  useEffect(() => {
    const sliderElement = sliderRef.current;

    if (sliderElement) { // Check if sliderElement is defined
      const preventDefaultTouch = (e) => {
        e.preventDefault();
      };

      sliderElement.addEventListener('touchmove', preventDefaultTouch, { passive: false });

      return () => {
        sliderElement.removeEventListener('touchmove', preventDefaultTouch);
      };
    }
  }, []);
  // useEffect(() => {
  //   var config = {
  //     method: 'get',
  //     url: `https://api.geoapify.com/v1/geocode/autocomplete?text=${cityName}&apiKey=e1ad627312d34d30936262d583fa39b5`,
  //     headers: {},
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       console.log('response.data');
  //       console.log(response.data);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }, [cityName]);



const getMyLocationCoordinates = () =>{
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("navigator called")
        setSrcLatitude(position.coords.latitude);
        setSrcLongitude(position.coords.longitude);
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}
  
  const handleCityNameChange = (event) => {
    setCityName(event.target.value);
  };

  const handleThresholdChange = (event) => {
    setThresholdDistance(event.target.value);
  };

  const handleSliderChange = (value) => {
    setThresholdDistance(value);
  };
const getMyLocationName=()=>{

var config = {
  method: 'get',
  url: `https://api.geoapify.com/v1/geocode/reverse?lat=${srcLatitude}&lon=${srcLongitude}&apiKey=e1ad627312d34d30936262d583fa39b5`,
  headers: { }
};

axios(config)
.then(function (response) {
  console.log("location name")
  setMyLocationName(response.data.features[0]?.properties?.address_line1);
  setMyLocationCityName(response.data.features[0]?.properties?.city);
})
.catch(function (error) {
  console.log(error);
});

}
const getDesLocationName=()=>{

  var config = {
    method: 'get',
    url: `https://api.geoapify.com/v1/geocode/reverse?lat=${desLatitude}&lon=${desLongitude}&apiKey=e1ad627312d34d30936262d583fa39b5`,
    headers: { }
  };
  
  axios(config)
  .then(function (response) {
    console.log("deslocation name")
    setDesLocationName(response.data.features[0]?.properties?.address_line1);
    setDesLocationCityName(response.data.features[0]?.properties?.city);
  })
  .catch(function (error) {
    console.log(error);
  });
  
  }

  const getCoordinates = () => {
    setError(null);

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    console.log('im called');
    axios
      .get(apiUrl)
      .then((response) => {
        setDesLatitude(response.data.coord.lat);
        setDesLongitude(response.data.coord.lon);
      })
      .catch((error) => {
        setError(error.message);
      });
      getDesLocationName()
  };

  const getDistance = () => {
    if (desLatitude !== null && desLongitude !== null) {
      const R = 6371; // Earth's radius in kilometers
      const lat1 = parseFloat(srcLatitude);
      const lon1 = parseFloat(srcLongitude);
      const lat2 = parseFloat(desLatitude);
      const lon2 = parseFloat(desLongitude);

      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const calculatedDistance = R * c;
      console.log('Current distance is: ', calculatedDistance);
      setDistance(calculatedDistance.toFixed(2));
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">WakeUpWay</h1>
     <div className='input-container'>
      <input
        className="app-input"
        type="text"
        id="cityName"
        value={cityName}
        onChange={handleCityNameChange}
        placeholder='Where are you heading to?'
      />

      
        <ExploreIcon className="app-button" onClick={getCoordinates}/>
      
      </div>

      {desLatitude == null &&desLongitude == null ? <p className='tagline'>The " I'm Almost There " Alarm Clock.</p>:null}

      {myLocationName !== null &&myLocationCityName !== null&&desLatitude !== null &&desLongitude !== null ? (
      <div className='my-location-container'>
        <PersonPinCircleRoundedIcon color='primary' fontSize="large" className='my-location-icon'/>
        <div className='my-location-name-container'>
          <p className='my-location-name'>{myLocationName}</p>
          <p className='my-location-city-name'>{myLocationCityName}</p>
        </div>
        </div>
      ) : (
        <p className="app-error">
          {error ? `Error: ${error}` : ''}
        </p>
      )}

      {/* <h1 className="app-title">When should I wake you up?</h1> */}
      {/* Input field */}
       

      {/* Slider */}
      {desLatitude !== null && desLongitude !== null ? (
      <div className="app-slider"  ref={sliderRef}>
      
        <InputSlider
          
          id="thresholdSlider"
          axis="y"
          y={distance !== null ? distance - thresholdDistance : 0}
          ymin={0}
          ymax={distance || 50} // Adjust the maximum value as needed
          onChange={({ y }) => handleSliderChange(y)}
        />
        <div>
        <p style={{paddingLeft:"10px",fontSize:".6rem",translate:"1rem"}}>Wake me up when I'm</p>
        <div style={{display:"flex"}}>
        <input dir='rtl' style={{border:"none",outline:"none",width:"3rem",marginLeft:"1rem",fontSize:"24px",color:"#007bff",background:"none",fontWeight:"700",marginTop:"-1rem"}} value={thresholdDistance} type='number' max={distance} onChange={handleThresholdChange}></input>
        <p style={{marginTop:".1rem"}}>km</p>
        </div>
        </div>
      </div>):null}

      {distance !== null ? (
        
        <p className="app-distance">{distance}km</p>
      ) : (
        <p className="app-error">
          {disError ? `Error: ${disError}` : ''}
        </p>
      )}
      {desLatitude !== null && desLongitude !== null ? (
        <div className='des-location-container'>
        <PlaceRoundedIcon color='secondary' fontSize="large" className='my-location-icon'/>
        <div className='my-location-name-container'>
          <p className='my-location-name'>{desLocationName}</p>
          <p className='my-location-city-name'>{desLocationCityName}</p>
        </div>
        </div>
      ) : (
        <p className="app-error">
          {error ? `Error: ${error}` : null}
        </p>
      )}

      {distance != null && distance < thresholdDistance ? (
        <div>
         <p className="app-message">You have arrived</p>
        <Notification1 />
        </div>
      ) : null}
    </div>
  );
}

export default CityCoordinates;
