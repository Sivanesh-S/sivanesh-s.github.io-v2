// Components

let landing = document.querySelector('#landing')
let projects = document.querySelector('#projects')
let about = document.querySelector('#about')
let contact = document.querySelector('#contact')
let menu = document.querySelector('.menu')

{
    // landing.style.backgroundColor = '#333'
    document.body.style.transition = 'background-color 1s ease'
}

// Animated background
let isAnimating = true, previous = 0, phase = 0, outside = true

let scrollFunction = event => {
    if(event.pageY < window.innerHeight) {
        phase = 1
    }
    else if(event.pageY < window.innerHeight * 2) phase = 1
    else if(event.pageY < window.innerHeight * 3) phase  = 2
    else phase = 4

    if(previous != phase) {

        document.body.style.backgroundColor = randomColor({
            luminosity: 'light'
        })
    }

    if(event.pageY > window.innerHeight - 10 && outside) {
        document.querySelectorAll('.menu a').forEach(item => {
            item.classList.remove('a')
            item.classList.add('menu-blocked')
        })
        console.log('Added')
        outside = !outside
    } 
    
    if(event.pageY < window.innerHeight - 10 && !outside) {
        console.log('came here')
        document.querySelectorAll('.menu a').forEach(item => {
            item.classList.add('a')
            item.classList.remove('menu-blocked')
        })
        outside = !outside

    }



    previous = phase 
}

document.addEventListener('scroll', scrollFunction)
document.addEventListener('touchmove', scrollFunction)

// Typed JS
var type = new Typed('#job', {
    strings: ['Full Stack Developer', 'Front End Developer', 'Back End Developer'],
    typeSpeed: 30,
    loop: true
})

// Page 2 
// Projects

document.querySelector('#project-list').addEventListener('click', event => {
    if (event.target.localName == 'a') {
        var a = event.target.id.split('-')[0]
        console.log(a)
        clearAll()
        document.querySelector(`#${a}-contents`).style.display = 'inherit'
        document.querySelector(`#${a}-menu`).style.color = 'crimson'
    }
})

function clearAll() {
    document.querySelectorAll('#gst-contents, #budget-contents, #xo-contents, #chatterax-contents')
    .forEach(item => {
        item.style.display = 'none'
    })
    
    document.querySelectorAll('#chatterax-menu, #budget-menu, #gst-menu, #xo-menu').forEach(item => item.style.color = 'rgb(11, 184, 11)')
}


{
    clearAll()
    document.querySelector('#project-info').style.overflowY = 'scroll'
    document.querySelector('#chatterax-contents').style.display = 'block'
    document.querySelector('#chatterax-menu').style.color = 'crimson'
}

// window.scrollBy({
//     top: window.innerHeight, // could be negative value
//     left: 0,
//     behavior: 'smooth'
// });


// Contact random color 

// let contacts = document.querySelectorAll('#contact div')
// let contactColor = randomColor({
//     hue: 'purple',
//     luminosity: 'light'
// })
// // contacts.forEach(item => {
// //     item.style.backgroundColor = contactColor
// // })


document.querySelector('.menu-landing').addEventListener('click', event => {
    if(event.target.localName == 'a') {
        if(event.target.id == 'home-menu') {
            window.scrollTo({
                top: 0, // could be negative value
                left: 0,
                behavior: 'smooth'
            });
        } else if(event.target.id == 'projects-menu') {
            window.scrollTo({
                top: window.innerHeight,
                left: 0,
                behavior: 'smooth'
            })
        } else if(event.target.id == 'about-menu') {
            window.scrollTo({
                top: window.innerHeight * 2,
                left: 0,
                behavior: 'smooth'
            })
        } else if(event.target.id == 'contact-menu') {
            window.scrollTo({
                top: window.innerHeight * 3,
                left: 0,
                behavior: 'smooth'
            })
        }
        
    }
})