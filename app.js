// Add an event listener for the form to select the number of days and weather details
const weatherForm = document.getElementById('weather-form');
function createMessage(isOutdoor, color, prefix, message) {
    const formattedMessage = `<br><strong style="color: ${color}">${prefix} ${message}</strong>`;
    return isOutdoor ? formattedMessage.replace("NOTE:", "WARNING:") : formattedMessage;
}
function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
}
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(errorMessage => errorMessage.remove());
}

function isWeatherCodePresent(weatherCodes, code) {
    return weatherCodes.includes(code);
}

weatherForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors();

    // Get the user inputs
    const city = document.getElementById('activity-city').value;
    const unit = document.getElementById('temp-unit').value;
    const numDays = parseInt(document.getElementById('num-days').value, 10);

    // Remove the weather form from the DOM to prepare for the next form
    weatherForm.remove();

    // Create a new form for activity details for each day
    const activityForm = document.createElement('form');
    activityForm.id = 'activity-form';
    activityForm.innerHTML = `
    <div class="container">
      <div id="activity-details"></div>
      <button class="submit-btn" type="submit">Submit</button>
    </div>
  `;
    document.body.appendChild(activityForm);


    // Add event listener for the activity form
    activityForm.addEventListener('submit', function (event) {
        event.preventDefault();
        clearErrors();
        // Get the weather conditions for all days
        getWeatherConditionsForAllDays(numDays, city, unit).then(weatherConditions => { // Clear previous weather results


            let allMessages = '';


            // Display weather conditions for each day
            weatherConditions.forEach((weatherCondition, index) => {
                if (!weatherCondition || !weatherCondition.current) { // Handle missing or invalid weather data for a day
                    allMessages += `<div>Day ${
                        index + 1
                    }: No weather data available.</div>`;
                    return;
                }
                const temperature = weatherCondition.current.temperature;
                const weatherCode = weatherCondition.current.weather_code;
                const uv_index = weatherCondition.current.uv_index;
                const humidity = weatherCondition.current.humidity;
                const desc = weatherCondition.current.weather_descriptions[0];
                const feelslike = weatherCondition.current.feelslike;
                const cloudover = weatherCondition.current.cloudover;
                const precip = weatherCondition.current.precip;
                const pressure = weatherCondition.current.pressure;
                const visibility = weatherCondition.current.visibility;
                const windspeed = weatherCondition.current.windspeed;

                // Weather codes for different weather conditions
                const snowyCodes = [395, 338, 326];
                const rainyCodes = [389, 359, 356];
                const drizzleCodes = [353, 263];
                const thunderstormCodes = [377];
                const sleetCodes = [365, 317, 314];
                const blizzardCode = 230;
                const fogCode = 248;


                // User selections
              
               const activityTime = document.getElementById(`activity-time-${index + 1}`).value;

                const activityDate = document.getElementById(`activity-date-${
                    index + 1
                }`).value;
                const activityType = document.getElementById(`activity-type-${
                    index + 1
                }`).value;
                const activityName = document.getElementById(`activity-name-${
                    index + 1
                }`).value;

                if (activityType === "outdoor") {
                    let outdoorMessage = `<div>Day ${
                        index + 1
                    }: The weather on ${activityDate} is expected to be ${desc}. Enjoy your ${activityType} activity "${activityName}"!</div>`;

                    if (temperature >= 90) {
                        outdoorMessage += createMessage(true, "red", "WARNING:", "The temperature is above 90 degrees. Take necessary precautions for outdoor activities.");
                    }
                    if (uv_index >= 7) {
                        outdoorMessage += createMessage(true, "red", "WARNING:", "The UV index is above 7 during this time. Take necessary precautions for outdoor activities.");
                    }
                    if (humidity >= 70) {
                        outdoorMessage += createMessage(true, "red", "WARNING:", "The humidity is above 70% during this time. Take necessary precautions for outdoor activities.");
                    }
                    if (windspeed >= 32) {
                        outdoorMessage += createMessage(true, "red", "WARNING:", "The wind speed is above 32 km/hr during this time. Take necessary precautions for outdoor activities.");
                    }
                    if (visibility < 3) {
                        outdoorMessage += createMessage(true, "red", "WARNING:", "The visibility is less than 3 miles during this time. Take necessary precautions for outdoor activities.");
                    }

                    if (isWeatherCodePresent(snowyCodes, weatherCode)) {
                        outdoorMessage += createMessage(true, "red", "WARNING:", "There is a good chance it might snow. Take necessary precautions for outdoor activities.");
                    }
                    if (isWeatherCodePresent(rainyCodes, weatherCode)) {
                        outdoorMessage += createMessage(true, "red", "WARNING:", "There is a good chance it might rain. Take necessary precautions for outdoor activities.");
                    }
                    if (isWeatherCodePresent(drizzleCodes, weatherCode)) {
                        outdoorMessage += createMessage(true, "red", "WARNING:", "There is a good chance of rain drizzle during this time. Take necessary precautions for outdoor activities.");
                    }
                    if (isWeatherCodePresent(thunderstormCodes, weatherCode)) {
                        outdoorMessage += createMessage(true, "red", "WARNING:", "There is a good chance of a thunderstorm during this time! Take necessary precautions for outdoor activities.");
                    }
                    if (isWeatherCodePresent(sleetCodes, weatherCode)) {
                        outdoorMessage += createMessage(true, "red", "WARNING:", "There is a good chance of sleet showers during this time. Take necessary precautions for outdoor activities.");
                    }

                    allMessages += outdoorMessage;
                }

                // Check for indoor activities
                if (activityType === "indoor") {
                    let indoorMessage = `<div>Day ${
                        index + 1
                    }: The weather on ${activityDate} is expected to be ${desc}. Enjoy your ${activityType} activity "${activityName}"!</div>`;

                    if (temperature >= 90) {
                        indoorMessage += createMessage(false, "orange", "NOTE:", "The temperature is above 90 degrees. Take necessary precautions for indoor activities.");
                    }
                    if (uv_index >= 7) {
                        indoorMessage += createMessage(false, "orange", "NOTE:", "The UV index is above 7 during this time. Take necessary precautions for indoor activities.");
                    }
                    if (humidity >= 70) {
                        indoorMessage += createMessage(false, "orange", "NOTE:", "The humidity is above 70% during this time. Take necessary precautions for indoor activities.");
                    }
                    if (windspeed >= 32) {
                        indoorMessage += createMessage(false, "orange", "NOTE:", "The wind speed is above 32 km/hr during this time. Take necessary precautions for your trip to your indoor activities.");
                    }
                    if (visibility < 3) {
                        indoorMessage += createMessage(false, "orange", "NOTE:", "The visibility is less than 3 miles during this time. Take necessary precautions for your trip to your indoor activities.");
                    }

                    allMessages += indoorMessage;


                    // Rest of your weather handling code...
                }
            });
            const weatherResult = document.getElementById('weather-result');


            weatherResult.innerHTML = allMessages;
        }).catch(error => { // Handle any errors that might occur during the fetch process
            console.error('Error fetching weather data:', error);
        });
    });

    // Generate input fields for each day
    const activityDetailsDiv = document.getElementById('activity-details');
    activityDetailsDiv.innerHTML = '';

    for (let i = 0; i < numDays; i++) {
        const dayNumber = i + 1;
        const inputGroup = `
      <div class="input-group">
        <label for="activity-date-${dayNumber}">Day ${dayNumber} Date:</label>
        <input type="date" id="activity-date-${dayNumber}">
        <input type="time" id="activity-time-${dayNumber}">
      </div>
      <div class="input-group">
        <label for="activity-name-${dayNumber}">Day ${dayNumber} Activity Name:</label>
        <input type="text" id="activity-name-${dayNumber}" placeholder="Enter activity name">
      </div>
      <div class="input-group">
        <label for="activity-type-${dayNumber}">Day ${dayNumber} Activity Type:</label>
        <select id="activity-type-${dayNumber}">
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>
      </div>
      <!-- Add more input fields if needed -->
    `;
        activityDetailsDiv.innerHTML += inputGroup;
    }
});

function getWeatherConditionsForAllDays(numDays, city, unit) {
    const weatherPromises = [];

    for (let i = 1; i <= numDays; i++) {
        const activityDate = document.getElementById(`activity-date-${i}`).value;
        const selectedDate = new Date(activityDate);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(currentDate.getDate() + 7);
        if (selectedDate > sevenDaysFromNow) {
            displayError('Error: Date must be in the nearest seven days.');
            // Reject the promise with an error message
            return Promise.reject('Date must be in the nearest seven days.');
        }

        // Check if the date is in the past
        if (selectedDate <= currentDate) {
            console.log(currentDate);
            console.log(selectedDate);
            displayError('Error: Date must be in the future.');
            // Reject the promise with an error message
            return Promise.reject('Date must be in the future.');
        }

        // Check if the date is in the future
        const promise = getWeatherCondition(city, unit);
        weatherPromises.push(promise);
       
    }


    return Promise.all(weatherPromises).then(weatherConditions => { // Log the weather conditions array
        console.log(weatherConditions);

        return weatherConditions;
    }).catch(error => { // Handle any errors that might occur during the fetch process
        console.error('Error fetching weather data:', error);
    });
}

function getWeatherCondition(city, unit) {
    let params = new URLSearchParams({access_key: 'd171684972b38dd430db2f91c3564710', query: city, units: unit});

    const url = `http://api.weatherstack.com/current?${params}`;
    //const url = `http://localhost:3000/weather?city=${city}&unit=${unit}`;

    return fetch(url).then(res => res.json()).then(weatherCondition => { // console.log(weatherCondition);
        return weatherCondition;
    });
}
