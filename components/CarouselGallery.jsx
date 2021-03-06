import Image from "next/image"
import {BsFillArrowLeftCircleFill} from "react-icons/bs"
import gsap from "gsap"
import {useEffect,useRef} from "react"
import {photos} from "./photos"

export const CarouselGallery = () => {

  const carousel = useRef(null);

  let isAnimating = false
  let prevSlideFinished = false

  let middleIndex;
  let baseZIndex = 40;
  let scaleRatio = 10;

  useEffect(() => {
    
    if(carousel){

      gsap.to(".carousel-container",{
        duration: 0,
        css:{display: "block"}
      })

      gsap.from([".prev ",".next"],{
        delay: .5,
        opacity: 0,
        y:50
      })

      gsap.to(carousel.children, {
        top:'40%',
        left:'50%',
        xPercent:-50,
        yPercent:-50,
        duration:0,
      })
      middleIndex = Math.ceil(carousel.childNodes.length / 2);
      const midElement = carousel.children[middleIndex - 1];
      gsap.to(midElement, {
        duration: 0,
        zIndex: baseZIndex,
      })
      positionLeftNodes(middleIndex)
      positionRightNodes(middleIndex)
    }
  },[])

  

  const positionLeftNodes = (MidIndex) => {
    let countingForwards = 0;
    let tempZIndex = 0;
    for (let index = MidIndex - 1; index>= 0; index--) {
      tempZIndex -= 1;
      countingForwards++;
      const leftNodes = carousel.children[index - 1 ];
      if(leftNodes){
        gsap.to(leftNodes,{
          duration: 0,
          zIndex: tempZIndex,
          x: -(80 * countingForwards),
          scale: `0.${scaleRatio - countingForwards}`
        })
      }
      
    }
  }

  const positionRightNodes = (MidIndex) => {
    const carouselLength = carousel.children.length
    let countingForwards = 0;
    let tempZIndex = baseZIndex;
    for (let index = MidIndex; index < carouselLength; index++) {
      tempZIndex -= 1;
      countingForwards++;
      const rightNodes = carousel.children[index];
      if(rightNodes){
        gsap.to(rightNodes,{
          duration: 0,
          zIndex: tempZIndex,
          x: (80 * countingForwards),
          scale: `0.${scaleRatio - countingForwards}`
        })
      }
    }
  }
  
  const next = () => {
    if(!isAnimating){
      prevSlideFinished = false;
      if(middleIndex > 1){
        isAnimating = true;
        moveLeftSideAlongWithMainElement()
        moveRemainingRightSide()
      }
    }
  }

  const moveLeftSideAlongWithMainElement = () => {
    for (let index = 0; index <=middleIndex; index++) {
      const element = carousel.children[index]
      const prevElement = carousel.children[index - 1]

      //getting current style_values
      const currentTranslateXValue =  gsap.getProperty(element, 'translateX')
      const currentZIndex = gsap.getProperty(element, 'zIndex')
      const currentScale = gsap.getProperty(element, 'scale')

      if(currentZIndex === baseZIndex){
        //we found main element
        gsap.to(element, {
          duration: .3,
          zIndex: currentZIndex - 1,
          x: 80,
          scale: '0.9'
        });
        //update previous z-index to be main
        gsap.to(prevElement,{
          duration: .3,
          zIndex: baseZIndex
        })
        //update middle index
        middleIndex = index;
      }else{
        //move all the remaining elements to right

        gsap.to(element,{
          duration: .3,
          zIndex: (currentZIndex + 1),
          x: currentTranslateXValue + 80,
          scale: parseFloat((currentScale + 0.1).toFixed(1)),
        })

      }
    }
  }

  const moveRemainingRightSide = () => {
    const length = carousel.children.length;
     for(let index = middleIndex; index < length; index++) {
      const element = carousel.children[index]
      const currentTranslateXValue = gsap.getProperty(element, 'translateX')
      const currentZIndex = gsap.getProperty(element, 'zIndex')
      const currentScale = gsap.getProperty(element, 'scale')

      gsap.to(element,{
        duration: .3,
        zIndex: currentZIndex - 1,
        x: currentTranslateXValue + 80,
        scale: parseFloat((currentScale - 0.1).toFixed(1)),
        onComplete: () => (isAnimating = false),
      })
    }
  }
 
  const previous = () => {
    if((middleIndex < carousel.children.length -1 && !isAnimating)){
    isAnimating = true;
      moveRightSideAlongWithMainElement()
      moveRemainingLeftSide()
    }
  }

  const moveRightSideAlongWithMainElement = () => {
    for (let index = middleIndex; index >= 0; index--) {
      const element = carousel.children[index]
      const nextElement = carousel.children[index + 1]

      //getting current style_values
      const currentTranslateXValue =  gsap.getProperty(element, 'translateX')
      const currentZIndex = gsap.getProperty(element, 'zIndex')
      const currentScale = gsap.getProperty(element, 'scale')

      if(currentZIndex === baseZIndex){
        //we found main element
        gsap.to(element, {
          duration: .3,
          zIndex: -1,
          x: currentTranslateXValue - 80,
          scale: parseFloat((currentScale - 0.1).toFixed(1))
        });
        //update next element z-index to be main
        gsap.to(nextElement,{
          duration: .3,
          zIndex: baseZIndex,
          x:currentTranslateXValue,
          scale:parseFloat(currentScale.toFixed(1))
        })
        //update middle index
        middleIndex = index + 1;
      }else{
        //move all the remaining elements to left

        gsap.to(element,{
          duration: .3,
          zIndex: (currentZIndex - 1),
          x: currentTranslateXValue - 80,
          scale: parseFloat((currentScale - 0.1).toFixed(1)),
          onComplete: () => {
            isAnimating = false;
            if(noMoreElements(carousel)){
              prevSlideFinished = true
            }else{
              prevSlideFinished = false
            }
          }
        })

      }
    }
  }

  const moveRemainingLeftSide = () => {
    let tempZIndex = baseZIndex;
     const length = carousel.children.length;
    for(let index = middleIndex + 1; index < length; index++) {
      const element = carousel.children[index]
      const currentTranslateXValue = gsap.getProperty(element, 'translateX')
      const currentScale = gsap.getProperty(element, 'scale')
      tempZIndex--;

      gsap.to(element,{
        duration: .3,
        zIndex: tempZIndex,
        x: currentTranslateXValue - 80,
        scale: parseFloat((currentScale + 0.1).toFixed(1)),
      })
    }

  }

  const noMoreElements = (carouselEl) => {
    return (carouselEl?.children[middleIndex + 1] === undefined)
  }

  return (
            <div className="hidden carousel-container max-w-[1500px] h-[500px] my-[10%] md:my-[25%] lg:my-[10%] mx-auto overflow-hidden relative">
              <div ref={(el) => carousel = el} className="carousel relative w-[inherit] h-[inherit] z-[1]">
                {photos.map((photo, index) => (
                  <figure key={index} className="carousel__item item w-[275px] h-[175px] md:w-[450px] md:h-[300px] lg:w-[650px] lg:h-[400px] top-[50%] left-[50%] -translate-x-1/2">
                    <Image className={"w-full h-full object-cover block"} src={photo.src} alt={photo.title}></Image>
                      <div className="title absolute z-20 uppercase top-[85%] right-[18%] font-lg text-white font-bold shadow-md rounded-lg font-[13px] bottom-1 tracking-widest antialiased">
                        {photo.title}
                      </div>
                  </figure>
                ))}
                
              </div>
              <button disabled={isAnimating || prevSlideFinished} onClick={() => previous()} className="prev top-[35%] left-[5%] -translate-x-1/2 -translate-y-1/2 absolute cursor-pointer z-50 disabled:opacity-10 disabled:cursor-default">
                <BsFillArrowLeftCircleFill className={"absolute w-[50px] h-[50px] text-zinc-600 hover:text-zinc-500 transition"}/>
              </button>
              <button disabled={isAnimating || middleIndex <= 1} onClick={() => next()} className="next w-[35px] h-[35px] lg:w-[50px] lg:h-[50px] top-[35%] right-[5%] -translate-x-1/2 -translate-y-1/2 absolute cursor-pointer z-50 disabled:opacity-10 disabled:cursor-default">
                <BsFillArrowLeftCircleFill className={"absolute w-[50px] h-[50px] text-zinc-600 hover:text-zinc-500 rotate-180 transition"}/>
              </button>
            </div>
  )
}
