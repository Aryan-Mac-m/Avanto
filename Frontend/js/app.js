let generatedOTP = "1234";
let map, marker;
let resendTimer = null;
let currentLocation = null;

// SHOW LOGIN - Transition from intro to login
function showLogin() {
    const introSection = document.getElementById("introSection");
    const loginBox = document.getElementById("loginBox");
    
    // Add fade-out animation to intro
    introSection.classList.add("fade-out");
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        introSection.style.display = "none";
        loginBox.classList.remove("hidden");
    }, 500);
}

// SHOW INTRO - Go back to intro from login
function showIntro() {
    const introSection = document.getElementById("introSection");
    const loginBox = document.getElementById("loginBox");
    
    loginBox.classList.add("hidden");
    introSection.style.display = "flex";
    introSection.classList.remove("fade-out");
    
    // Reset login form
    document.getElementById("phone").value = "";
    document.getElementById("otpBox").classList.add("hidden");
    resetOTPInputs();
}

// Helper function to show loading state on button
function showButtonLoading(buttonId) {
    const btn = document.getElementById(buttonId);
    const btnText = btn.querySelector(".btn-text");
    const btnLoader = btn.querySelector(".btn-loader");
    
    btn.disabled = true;
    btnText.classList.add("hidden");
    btnLoader.classList.remove("hidden");
}

// Helper function to hide loading state on button
function hideButtonLoading(buttonId) {
    const btn = document.getElementById(buttonId);
    const btnText = btn.querySelector(".btn-text");
    const btnLoader = btn.querySelector(".btn-loader");
    
    btn.disabled = false;
    btnText.classList.remove("hidden");
    btnLoader.classList.add("hidden");
}

// SEND OTP
function sendOTP() {
    const phone = document.getElementById("phone").value.trim();

    if (phone === "" || phone.length < 10) {
        alert("Please enter a valid 10-digit phone number");
        return;
    }

    // Show loading state
    showButtonLoading("sendOtpBtn");

    // Simulate API call delay
    setTimeout(() => {
        generatedOTP = "1234"; // demo OTP
        alert("Your OTP is: 1234"); // demo OTP
        
        // Update phone display in OTP section
        const formattedPhone = "+91 " + phone.slice(0, 5) + " " + phone.slice(5);
        document.getElementById("otpPhoneDisplay").textContent = formattedPhone;
        
        // Hide loading and show OTP section
        hideButtonLoading("sendOtpBtn");
        document.getElementById("otpBox").classList.remove("hidden");
        
        // Focus first OTP input
        const firstOtpInput = document.querySelector(".otp-input[data-index='0']");
        if (firstOtpInput) {
            firstOtpInput.focus();
        }
        
        // Start resend timer
        startResendTimer();
        
        // Initialize OTP input handling
        initializeOTPInputs();
    }, 1500);
}

// Initialize OTP input boxes
function initializeOTPInputs() {
    const otpInputs = document.querySelectorAll(".otp-input");
    
    otpInputs.forEach((input, index) => {
        // Remove old event listeners by cloning
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        
        newInput.addEventListener("input", function(e) {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, "");
            
            if (this.value.length === 1) {
                this.classList.add("filled");
                
                // Move to next input
                if (index < otpInputs.length - 1) {
                    const nextInput = document.querySelector(`.otp-input[data-index="${index + 1}"]`);
                    if (nextInput) {
                        nextInput.focus();
                    }
                }
                
                // Update hidden OTP field
                updateOTPField();
            } else {
                this.classList.remove("filled");
            }
        });
        
        newInput.addEventListener("keydown", function(e) {
            // Handle backspace
            if (e.key === "Backspace" && this.value === "") {
                if (index > 0) {
                    const prevInput = document.querySelector(`.otp-input[data-index="${index - 1}"]`);
                    if (prevInput) {
                        prevInput.focus();
                        prevInput.value = "";
                        prevInput.classList.remove("filled");
                        updateOTPField();
                    }
                }
            }
        });
        
        newInput.addEventListener("paste", function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
            
            if (pastedData) {
                otpInputs.forEach((inp, i) => {
                    if (pastedData[i]) {
                        inp.value = pastedData[i];
                        inp.classList.add("filled");
                    }
                });
                updateOTPField();
                
                // Focus last filled input or first empty
                const lastFilledIndex = Math.min(pastedData.length, 3);
                const focusInput = document.querySelector(`.otp-input[data-index="${lastFilledIndex}"]`);
                if (focusInput) {
                    focusInput.focus();
                }
            }
        });
    });
}

// Update hidden OTP field from input boxes
function updateOTPField() {
    const otpInputs = document.querySelectorAll(".otp-input");
    let otp = "";
    otpInputs.forEach(input => {
        otp += input.value;
    });
    document.getElementById("otp").value = otp;
}

// Reset OTP inputs
function resetOTPInputs() {
    const otpInputs = document.querySelectorAll(".otp-input");
    otpInputs.forEach(input => {
        input.value = "";
        input.classList.remove("filled");
    });
    document.getElementById("otp").value = "";
}

// Start resend timer
function startResendTimer() {
    const resendBtn = document.getElementById("resendBtn");
    const timerSpan = document.getElementById("timer");
    let seconds = 30;
    
    resendBtn.disabled = true;
    timerSpan.textContent = `(30s)`;
    
    if (resendTimer) {
        clearInterval(resendTimer);
    }
    
    resendTimer = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            timerSpan.textContent = `(${seconds}s)`;
        } else {
            clearInterval(resendTimer);
            resendBtn.disabled = false;
            timerSpan.textContent = "";
        }
    }, 1000);
}

// Resend OTP
function resendOTP() {
    const phone = document.getElementById("phone").value;
    
    // Show loading
    const resendBtn = document.getElementById("resendBtn");
    const originalText = resendBtn.innerHTML;
    resendBtn.innerHTML = "Sending...";
    resendBtn.disabled = true;
    
    setTimeout(() => {
        generatedOTP = "1234"; // new demo OTP
        alert("New OTP sent: 1234");
        
        // Reset OTP inputs
        resetOTPInputs();
        
        // Restore button and start timer
        resendBtn.innerHTML = originalText;
        startResendTimer();
    }, 1500);
}

// VERIFY OTP
function verifyOTP() {
    const otp = document.getElementById("otp").value;

    if (otp.length !== 4) {
        alert("Please enter all 4 digits of the OTP");
        return;
    }

    // Show loading state
    showButtonLoading("verifyBtn");

    // Simulate verification delay
    setTimeout(() => {
        if (otp === generatedOTP) {
            hideButtonLoading("verifyBtn");
            document.getElementById("loginBox").style.display = "none";
            document.getElementById("mapSection").classList.remove("hidden");
            initMap();
        } else {
            hideButtonLoading("verifyBtn");
            alert("Invalid OTP. Please try again.");
            resetOTPInputs();
            const firstInput = document.querySelector(".otp-input[data-index='0']");
            if (firstInput) {
                firstInput.focus();
            }
        }
    }, 1500);
}

// INIT MAP
function initMap() {
    map = L.map('map').setView([28.6139, 77.2090], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([28.6139, 77.2090])
        .addTo(map)
        .bindPopup("Default Location")
        .openPopup();
}

// USE MY LOCATION
function useMyLocation() {
    // Show loading indicator
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Locating...";
    btn.disabled = true;

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        btn.innerText = originalText;
        btn.disabled = false;
        return;
    }

    navigator.geolocation.getCurrentPosition(
        pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            
            // Get address from coordinates
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then(res => res.json())
                .then(data => {
                    const address = data.address;
                    let locationName = "";
                    
                    if (address.city) {
                        locationName = address.city;
                    } else if (address.town) {
                        locationName = address.town;
                    } else if (address.village) {
                        locationName = address.village;
                    } else if (address.state) {
                        locationName = address.state;
                    } else {
                        locationName = "Your Location";
                    }
                    
                    // Add country if different
                    if (address.country && address.country !== "India") {
                        locationName += ", " + address.country;
                    }
                    
                    currentLocation = locationName;
                    
                    map.setView([lat, lng], 14);
                    marker.setLatLng([lat, lng]).bindPopup(locationName).openPopup();
                    
                    // Update input field
                    document.getElementById("locationInput").value = locationName;
                    
                    // Reset button
                    btn.innerText = originalText;
                    btn.disabled = false;
                    
                    // Ask user to confirm location
                    setTimeout(() => {
                        if (confirm(`Confirm your location: ${locationName}?`)) {
                            confirmAndContinue();
                        }
                    }, 500);
                })
                .catch(err => {
                    console.error("Reverse geocoding error:", err);
                    map.setView([lat, lng], 14);
                    marker.setLatLng([lat, lng]).bindPopup("Your Location").openPopup();
                    document.getElementById("locationInput").value = "Your Location";
                    currentLocation = "Your Location";
                    
                    btn.innerText = originalText;
                    btn.disabled = false;
                    
                    setTimeout(() => {
                        if (confirm("Confirm your location?")) {
                            confirmAndContinue();
                        }
                    }, 500);
                });
        },
        err => {
            let errorMsg = "Unable to retrieve your location";
            if (err.code === 1) {
                errorMsg = "Location access denied. Please enable location permissions.";
            } else if (err.code === 2) {
                errorMsg = "Location unavailable. Please try again.";
            } else if (err.code === 3) {
                errorMsg = "Location request timed out. Please try again.";
            }
            alert(errorMsg);
            
            // Reset button
            btn.innerText = originalText;
            btn.disabled = false;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// SEARCH LOCATION
function searchLocation() {
    const location = document.getElementById("locationInput").value.trim();
    
    if (!location) {
        alert("Please enter a location");
        return;
    }

    // Show loading state
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Searching...";
    btn.disabled = true;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                
                map.setView([lat, lon], 13);
                marker.setLatLng([lat, lon])
                      .bindPopup(location)
                      .openPopup();
                
                currentLocation = location;
                
                // Reset button
                btn.innerText = originalText;
                btn.disabled = false;
                
                // Ask user to confirm location
                setTimeout(() => {
                    if (confirm(`Confirm your location: ${location}?`)) {
                        confirmAndContinue();
                    }
                }, 500);
            } else {
                alert("Location not found. Please try a different search term.");
                btn.innerText = originalText;
                btn.disabled = false;
            }
        })
        .catch(err => {
            console.error("Search error:", err);
            alert("Error searching for location. Please try again.");
            btn.innerText = originalText;
            btn.disabled = false;
        });
}

// Confirm and continue to home page
function confirmAndContinue() {
    // Save location to localStorage
    localStorage.setItem('userLocation', currentLocation);
    
    // Show success message
    alert(`Location confirmed: ${currentLocation}. Redirecting to home page...`);
    
    // Redirect to home page
    window.location.href = 'home.html';
}

// Handle Enter key in location input
document.addEventListener("DOMContentLoaded", function() {
    const locationInput = document.getElementById("locationInput");
    if (locationInput) {
        locationInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                searchLocation();
            }
        });
    }
});

