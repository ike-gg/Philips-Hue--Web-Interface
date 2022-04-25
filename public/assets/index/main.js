let lightsGroup;
let lights;
let lightsInterval;
let changingColor = {};

//debug mode disables interval of fetching status of lights every second.
//also, debug mode dont require launched backend.
let debugMode = false;

//init color picker
let colorPicker = new iro.ColorPicker('#picker', {
    wheelLightness: false,
    layoutDirection: 'horizontal',
    id: 'picker',
    width: 250,
    margin: 30,
    padding: 10,
    layout: [
        {
            component: iro.ui.Wheel,
            options: {
                sliderType: 'hue'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'saturation'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'alpha',
                layoutDirection: 'vertical', 
            }
        }
    ]
});

document.querySelector('.lightSettingsContainer').addEventListener('mouseup', async () => {
    if (Object.keys(changingColor).length > 0) {
        let trueHue = colorPicker.color.$.h * 182;
        let trueSat = colorPicker.color.$.s * 2.54;
        trueSat = trueSat.toFixed(0);
        let trueBri = (colorPicker.color.$.a * 100 ) * 2.54;
        trueBri = trueBri.toFixed(0);
        console.log(`h ${trueHue} s ${trueSat} b ${trueBri}`);
        let body = {
            type: changingColor.type,
            id: changingColor.id,
            hue: Number(trueHue),
            sat: Number(trueSat),
            bri: Number(trueBri)
        }
        const response = await fetch('/hueApi/lightsChange', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (data.status == "ok") {
            lights = data.lights;
            console.log(lights);
        } else if (data.status == "error") {
            console.error("Something went wrong, details below (fetching status of lights paused)")
            console.error(data.error);
            alert("Something went wrong! Check browser console for more details.");
        }
    }
})

document.querySelector('.lightSettingsContainer').addEventListener('touchend', async () => {
    let trueHue = colorPicker.color.$.h * 182;
    let trueSat = colorPicker.color.$.s * 2.54;
    trueSat = trueSat.toFixed(0);
    let trueBri = (colorPicker.color.$.a * 100 ) * 2.54;
    trueBri = trueBri.toFixed(0);
    console.log(`h ${trueHue} s ${trueSat} b ${trueBri}`);
    let body = {
        type: changingColor.type,
        id: changingColor.id,
        hue: Number(trueHue),
        sat: Number(trueSat),
        bri: Number(trueBri)
    }
    const response = await fetch('/hueApi/lightsChange', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    if (data.status == "ok") {
        lights = data.lights;
        console.log(lights);
    } else if (data.status == "error") {
        console.error("Something went wrong, details below (fetching status of lights paused)")
        console.error(data.error);
        alert("Something went wrong! Check browser console for more details.");
    }
})

let newColorDialog = (id, isItGroup) => {
    let container = document.querySelector('.lightSettingsContainer');
    let box = document.querySelector('.lightSettingsBox');
    container.style.display = "flex";
    box.animate(animateShowUpKeyFrames, animationOptionsFaster);
    if (isItGroup) {
        document.querySelector('.lightSettingsName').textContent = lightsGroup[id].name;
        changingColor = {
            type: 'group',
            id
        }
    } else {
        document.querySelector('.lightSettingsName').textContent = lights[id].name;
        changingColor = {
            type: 'light',
            id
        }
    }
}

let miniAlert = (miniAlertText) => {
    let miniAlertElement = document.querySelector('.miniAlert');
    miniAlertElement.innerHTML = miniAlertText;
    miniAlertElement.style.display = "block";
    miniAlertElement.animate(animateShowUpKeyFrames, animationOptions);
    setTimeout(() => {
        miniAlertElement.animate(animateHideKeyFrames, animationOptions);
        setTimeout(() => {
            miniAlertElement.style.display = "none";
        }, animationOptions.duration);
    }, 2000);

}

let render = async () => {
    const response = await fetch('/hueApi/lights', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    if (data.status == "ok") {
        lights = data.lights;
        console.log(lights);
    } else if (data.status == "error") {
        console.error("Something went wrong, details below (fetching status of lights paused)")
        console.error(data.error);
        alert("Something went wrong! Check browser console for more details.");
        lightsInterval = clearInterval();
    }
    for (light in lights) {
        if (!lights[light].state.on) {
            document.querySelector(`[data-lightid="${light}"]`).classList.add('turnedOff');
        } else {
            document.querySelector(`[data-lightid="${light}"]`).classList.remove('turnedOff');
        }
        document.querySelector(`[data-lightid="${light}"] > .lightName`).textContent = lights[light].name;
        let hHue = lights[light].state.hue;
        let lHue = lights[light].state.bri;
        hHue = hHue / 65535;
        lHue = lHue / 256;
        if (lHue < 0.25) {
            lHue = 0.25;
        } else if (lHue > 0.9) {
            lHue = 0.9;
        }
        document.querySelector(`[data-lightid="${light}"]`).style.backgroundColor = `rgb(${hslToRgb(hHue, 0.7, lHue)})`
        document.querySelector(`[data-lightid="${light}"]`).style.boxShadow = `0px 2px 12px -2px rgb(${hslToRgb(hHue, 0.7, lHue)})`
        let lightnessHue = lights[light].state.bri;
        lightnessHue /= 254;
        lightnessHue *= 100;
        lightnessHue = Math.floor(lightnessHue);
        //make text more readable on differenct colored backgrounds 
        if (lightnessHue < 50) {
            document.querySelector(`[data-lightid="${light}"] > .lightName`).classList.remove('lighter')
            document.querySelector(`[data-lightid="${light}"] > .lightBrightness`).classList.remove('lighter')
            document.querySelector(`[data-lightid="${light}"] > .lightName`).classList.add('darker')
            document.querySelector(`[data-lightid="${light}"] > .lightBrightness`).classList.add('darker')
        } else {
            document.querySelector(`[data-lightid="${light}"] > .lightName`).classList.remove('darker')
            document.querySelector(`[data-lightid="${light}"] > .lightBrightness`).classList.remove('darker')
            document.querySelector(`[data-lightid="${light}"] > .lightName`).classList.add('lighter')
            document.querySelector(`[data-lightid="${light}"] > .lightBrightness`).classList.add('lighter')
        }

        document.querySelector(`[data-lightid="${light}"] > .lightBrightness`).textContent = `${lightnessHue}%`
    }
}

let firstRender = async () => {
    let htmlCode = "";
    console.log(lightsGroup);
    for (lights in lightsGroup) {
        htmlCode += `<div class="groupLightsName glowing animateOnStart">${lightsGroup[lights].name}<button class="tertiaryButton turnAllLights" data-groupid="${lights}">Turn on all lights</button><button class="tertiaryButton changeColorOfAllLights" data-groupid="${lights}">Change color of all lights</button></div><div class="containerForLightsInGroup animateOnStart">`;
        for (light of lightsGroup[lights].lights) {
            htmlCode += `<div class="light" data-lightid="${light}"><div class="lightName">Hue Light ${light}</div><div class="lightBrightness"></div><div class="lightDetails"><img src="./assets/arrow.png"></div></div>`
        }
        htmlCode += "</div>";
        if (!debugMode) {
            document.querySelector('.containerGroupLights').innerHTML = htmlCode;
        }
    }
    
    let delayCounter = 50;
    document.querySelectorAll('.animateOnStart').forEach(element => {
        setTimeout(() => {
            element.animate(animateShowUpKeyFramesLess, animationOptionsFaster);
        }, delayCounter);
        delayCounter += 200;
    });

    document.querySelectorAll('.light').forEach(light => {
        light.addEventListener("click", async () => {
            if (light.classList.contains('turnedOff')) {
                const response = await fetch(`/hueApi/turnOnLight/?light=${light.dataset.lightid}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.status == "ok") {
                    light.classList.remove('turnedOff');
                }
            } else {
                const response = await fetch(`/hueApi/turnOffLight/?light=${light.dataset.lightid}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.status == "ok") {
                    light.classList.add('turnedOff');
                }   
            }
        })
    })

    document.querySelectorAll('.lightDetails').forEach(detailsButton => {
        detailsButton.addEventListener('click', e => {
            e.stopPropagation();
            newColorDialog(detailsButton.parentElement.dataset.lightid, false);
        })
    })

    document.querySelectorAll('.turnAllLights').forEach(button => {
        button.addEventListener('click', async () => {
            if (button.textContent.includes('off')) {
                const response = await fetch(`/hueApi/turnOffAllLights?group=${button.dataset.groupid}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.status == "ok") {
                    button.textContent = "Turn on all lights";
                } else if (data.status == "error") {
                    console.error(data.error);
                    alert("Something went wrong! Check browser console for more details.");
                }
            } else if (button.textContent.includes('on')) {
                const response = await fetch(`/hueApi/turnOnAllLights?group=${button.dataset.groupid}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.status == "ok") {
                    button.textContent = "Turn off all lights";
                } else if (data.status == "error") {
                    console.error(data.error);
                    alert("Something went wrong! Check browser console for more details.");
                }
            }
            
        })
    })

    document.querySelectorAll('.changeColorOfAllLights').forEach(button => {
        button.addEventListener('click', () => {
            newColorDialog(button.dataset.groupid, true);
        })
    })

    if (!debugMode) {
        lightsInterval = setInterval(render, 1000);
        render();
    }
}

document.querySelector('#closeColorBox').addEventListener('click', () => {
    let container = document.querySelector('.lightSettingsContainer');
    let box = document.querySelector('.lightSettingsBox');
    box.animate(animateHideKeyFrames, animationOptionsFaster);
    setTimeout(() => {
        container.style.display = "none";
    }, animationOptionsFaster.duration);
    changingColor = {};
});

document.querySelectorAll(".navElement").forEach(element => {
    element.addEventListener('click', () => {
        document.querySelectorAll(".navElement").forEach(e => {
            e.classList.remove('navElementActive');
        })
        element.classList.add('navElementActive');
        document.querySelectorAll('section').forEach(e => {
            e.animate(animateHideKeyFrames, animationOptionsFaster);
            setTimeout(() => {
                e.style.display = "none"
            }, animationOptionsFaster.duration);
        });
        setTimeout(() => {
            document.querySelector(`.${element.dataset.section}`).style.display = "block";
            document.querySelector(`.${element.dataset.section}`).animate(animateShowUpKeyFrames, animationOptionsFaster);
        }, animationOptionsFaster.duration);
    })
});

(async () => {
    if (debugMode) {
        firstRender();
    } else {
        const response = await fetch('/hueApi/checkStatus', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        if (data.status == "firstLaunch") {
            location.href = `${location.origin}/configure`;
        } else if (data.status == "ok") {
            console.log("Successfully requested hue.");
            console.log(data.lights);
            lightsGroup = data.lights;
            miniAlert(`Hello ${data.user}!`);
            firstRender();
        } else if (data.status == "error") {
            console.error(data.error);
            alert("Something went wrong! Check browser console for more details.");
        }
    }
})();

