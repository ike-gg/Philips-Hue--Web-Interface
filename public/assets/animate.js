let animateShowUpKeyFrames = [
    { opacity: "0", transform: "translateY(-50px)" },
    { opacity: "1", transform: "translateY(0px)" }
]
let animateShowUpKeyFramesLess = [
    { opacity: "0", transform: "translateY(-20px)" },
    { opacity: "1", transform: "translateY(0px)" }
]
let animateHideKeyFrames = [
    { opacity: "1", transform: "translateY(0px)" },
    { opacity: "0", transform: "translateY(50px)" }
]
let animateHideKeyFramesLess = [
    { opacity: "1", transform: "translateY(0px)" },
    { opacity: "0", transform: "translateY(20px)" }
]
let animationOptions = {
    easing: 'cubic-bezier(.4,0,.55,.99)',
    duration: 500,
    fill: "both",
}
let animationOptionsFaster = {
    easing: 'cubic-bezier(.4,0,.55,.99)',
    duration: 300,
    fill: "both",
}