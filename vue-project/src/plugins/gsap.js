import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({
  duration: 0.6,
  ease: 'power2.out'
})

export { gsap, ScrollTrigger }