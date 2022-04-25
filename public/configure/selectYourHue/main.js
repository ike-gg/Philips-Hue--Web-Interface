let hueElements;
let selectedHue;

let configureBox = document.querySelector('.configureBox');

configureBox.animate(animateShowUpKeyFrames, animationOptions);

const getDevices = async () => {
    const response = await fetch('/hueApi/getLocalDevices', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if (data.status == "notFound") {
        document.querySelector(".hueList").innerHTML = "Hue not found, enter ip address manually."
    } else {
        document.querySelector(".hueList").innerHTML = `<div class="hueElement" data-ip="${data.ip}">⏤<span class="hueName">${data.name}</span><span class="hueAddress">${data.ip}</span></div>`;
        hueElements = document.querySelectorAll('.hueElement');
        hueElements.forEach(e => {
            e.addEventListener('click', () => {
                selectedHue = e.dataset.ip;
                hueElements.forEach(element => {
                    element.classList.remove('hueSelected')
                })
                e.classList.add('hueSelected');
                document.querySelector('#nextButton').classList.remove('disabled');
            })
        })
    }
}
getDevices();

let manuallyAddress = () => {
    let temp = prompt("Enter IP address of your Philips Hue:");
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(temp)) {
        selectedHue = temp;
        document.querySelector('#nextButton').classList.remove('disabled');
        document.querySelector(".hueList").innerHTML = `<div class="hueElement hueSelected">⏤<span class="hueName">Hue (Manually)</span><span class="hueAddress">${selectedHue}</span></div>`;
    } else {
        alert("Enter valid IP address.");
        manuallyAddress();
    }
}

document.querySelector('#manuallyAddress').addEventListener('click', manuallyAddress);

let authoriseInterval;

document.querySelector('#nextButton').addEventListener('click', async (e) => {
    if (!e.target.classList.contains('disabled')) {
        document.querySelector(".pressHueContainer").style.display = "flex";
        document.querySelector('.pressHueContainer').animate(animateShowUpKeyFrames, animationOptions)
        authoriseInterval = setInterval( async () => {
            let body = {
                hueIp: selectedHue
            }
            const response = await fetch('/hueApi/authHue', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (data.status == "auth") {
                location.href = `${location.origin}/configure/you`;
            }
        }, 3000)
    }
})