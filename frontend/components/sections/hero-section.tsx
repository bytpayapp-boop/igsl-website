'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Users, Award, HandHeart, Facebook, Youtube, X, MessageCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function HeroSection() {


  const serviceRef = useRef(null);
  const cardRef1= useRef(null)
   const cardRef2= useRef(null)
    const cardRef3= useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {

          if (entry.isIntersecting) {
            entry.target.classList.add('moveUp')
          }
    
      },
      { threshold: 0.5 }
    )
    
    if (serviceRef.current) {
      observer.observe(serviceRef.current)
    }

    // const cardObserver1 = new IntersectionObserver(([card])=>{
    
  
    //       if(card.isIntersecting){
    //         card.target.classList.add('animateCard1')
    //       }
       
      
    // },{threshold:1});

    // if(cardRef1.current){
    //   cardObserver1.observe(cardRef1.current)
    // }
    

    // //card 2

    // const cardObserver2 = new IntersectionObserver(([card])=>{
    
  
    //       if(card.isIntersecting){
    //         card.target.classList.add('animateCard2')
    //       }
       
      
    // },{threshold:1});

    // if(cardRef2.current){
    //   cardObserver2.observe(cardRef2.current)
    // }


    // //card 3

    // const cardObserver3 = new IntersectionObserver(([card])=>{
    
  
    //       if(card.isIntersecting){
    //         card.target.classList.add('animateCard3')
    //       }
       
      
    // },{threshold:1});

    // if(cardRef3.current){
    //   cardObserver3.observe(cardRef3.current)
    // }
    //return part
    return () => {
      if (serviceRef.current) {
        observer.unobserve(serviceRef.current)
      }
      // if(cardRef1.current){
      //   cardObserver1.unobserve(cardRef1.current)
      // }
      // if(cardRef2.current){
      //   cardObserver2.unobserve(cardRef2.current)


      // }
      // if(cardRef3.current){
      //   cardObserver3.unobserve(cardRef3.current)
      // }
    }
  }, [])
  const features = [
    {
      icon: FileText,
      title: 'Vital Documents',
      description: 'Access birth certificates and identification with ease.'
    },
    {
      icon: HandHeart,
      title: 'Community Service',
      description: 'Empowering our people through responsive governance.'
    },
    {
      icon: Award,
      title: 'Excellence & Progress',
      description: 'Building a stronger Nigeria, one community at a time.'
    }
  ]

  const router = useRouter()

  return (
    <section className="min-h-screen w-full -mt-20 pt-10 bg-white/80 dark:bg-gray-800 relative md:pl-10 overflow-hidden">
      {/* Background decorative elements - Nigerian flag colors */}
     
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-4 w-96 h-96 bg-gradient-to-br from-green-400 via-yellow-400 to-orange-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-10 right-20 w-full h-96 bg-gradient-to-tr from-green-600 via-green-600 to-orange-400 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <div className="space-y-8">
            <div
            style={{transform:'translate(-50%,-50%)',top:'30%',left:'24%'}}
             className='h-80 w-80 flex absolute  z-[5]'>
              <img src={'/coatOfArm.png'} className='opacity-10 object-cover'/>
            </div>
            <div className='z-[50] relative'>
              <p className="text-green-700 text-sm z-[50] font-medium mb-2">Welcome to</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 dark:text-gray-300 leading-tight mb-4">
                Igbo-Eze South <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-500 to-gray-700 dark:from-gray-200 dark:via-gray-400 dark:to-gray-100">Local Government</span>
              </h1>
              <p className="text-green-700 text-lg md:text-xl mt-4">
                Building a better future for our people...
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4 pt-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="rounded-lg border-[1.2px] border-green-600 hover:border shadow-sm hover:border-gray-600 bg-green-600/10  backdrop-blur-md p-4 hover:translate-x-[20px] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-green-600" style={{color: '#4ADE80'}} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-700 dark:text-gray-300 font-semibold text-lg">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

              

            {/* CTA Links */}
            <div className="absolute flex flex-col gap-3 p-6 px-8 bg-white cursor-pointer shadow-sm rounded-sm z-200 md:-mt-24 right-10 hover:shadow-lg transition-all">
            
              <Link
                href="/services"
                className="text-green-600 hover:text-green-700 transition-colors font-medium inline-flex items-center justify-between gap-2 px-4 py-2 rounded-lg hover:bg-green-50"
              >
                <span>Explore services</span>
                <span>→</span>
              </Link>
              
              <Link
                href="/anonymous-message"
                className="text-blue-600 hover:text-blue-700 transition-colors font-medium inline-flex items-center justify-between gap-2 px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Drop Message
                </span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Section */}
          <div className="relative h-full lg:flex items-center justify-center">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-transparent to-orange-500/20 rounded-3xl blur-2xl"></div>

            {/* Service Preview Cards */}
            <div 
            ref={serviceRef}
            className="relative space-y-6 w-full max-w-sm">
              <div ref={cardRef1}
              className="transform  opacity-90">
                <div 
                onClick={()=>router.push('/services/birth-certificate')}
                className="bg-gradient-to-tr from-green-900 to-green-500 hover:scale-[1.1] transition-all cursor-pointer rounded-xl p-6 text-white shadow-2xl border border-green-400/30">
                  <h3 className="text-xl font-bold mb-2">Birth Certificate</h3>
                  <p className="text-sm opacity-90">Official LG birth registration</p>
                </div>
              </div>

              <div ref={cardRef2}
              onClick={()=>router.push('/services/identification')}
              className="transform  opacity-90">
                <div className="bg-gradient-to-br cursor-pointer from-white/80 to-white hover:scale-[1.1] transition-all rounded-xl p-6 text-gray-800 shadow-2xl border border-yellow-400/30">
                  <h3 className="text-xl font-bold mb-2">Local Government ID</h3>
                  <p className="text-sm opacity-90">Your LG, your identity</p>
                </div>
              </div>

              <div ref={cardRef3}
              className="transform  opacity-90">
                <div className="bg-gradient-to-tr from-orange-800 to-yellow-600/90 cursor-pointer hover:scale-[1.1] transition-all to-green-500 rounded-xl p-6 text-white shadow-2xl border border-orange-400/30">
                  <h3 className="text-xl font-bold mb-2">Government Services</h3>
                  <p className="text-sm opacity-90">Our peoople-oriented services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
