document.querySelector('#menu').addEventListener('click', () => {
    
    document.querySelector('#page1').classList.toggle('body-flip')
    document.querySelector('#sidebar').classList.toggle('sidebar-toggle')
    document.querySelector('#sidebar ul').classList.toggle('sidebar-toggle-ul')
})

console.log('he')

var isAnimating = false

document.querySelector('#page1').addEventListener('scroll', () => {
    console.log('Scroll function called')
    if(!isAnimating) {
        isAnimating = true
        console.log('animation is made')
        isAnimating = false;
    }
})

console.log(window.innerHeight, window.innerWidth)


// Page 2 
    // Projects

document.querySelector('#project-list').addEventListener('click', event => {
    if(event.target.localName == 'a') {
        var a = event.target.id.split('-')[0]
        clearAll()
        document.querySelectorAll(`#${a}-contents, #${a}-main`).forEach(item => {
            item.style.display = 'inherit'
        })
        document.querySelector(`#${a}-menu`).style.color = 'crimson'
    }
})

function clearAll() {
    document.querySelectorAll('#gst-main, #gst-contents, #budget-main, #budget-contents, #xo-main, #xo-xontents, #chatterax-main, #chatterax-contents')
        .forEach(item => {
            item.style.display = 'none'
        })

    document.querySelectorAll('#chatterax-menu, #budget-menu, #gst-menu, #xo-menu').forEach(item => item.style.color = 'rgb(11, 184, 11)')
}


{
    document.querySelectorAll('#chatterax-main, #chatterax-contents').forEach(item => item.style.display = 'inherit')
    document.querySelector('#chatterax-menu').style.color = 'crimson'
}

function scrolled() {
    console.log('Scrollm works wohoo')
}