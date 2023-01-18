import Comic from './components/Comic'
import SmartButton from './components/SmartButton'
import React, {useState, useEffect} from "react"
import "./App.css"

export default function App() {

  //console.log("call func: ", getMaxComicId())

  // Use end of URL to navigate to a specific comic strip
  // let defaultComicNumber
  // console.log("comicNumber: ", comicNumber)
  // if (typeof comicNumber === "undefined"){
  //   const comicIdStart = document.URL.lastIndexOf('/')
  //   const urlEnd = document.URL.slice(comicIdStart).replace('/','')
    
  //   if (!isNaN(+urlEnd)) {
  //     defaultComicNumber = +urlEnd
  //   } 
  //   console.log('defaultComicNumber: ', defaultComicNumber)
  // }

  // comicNumber is the only state that we need to change to change the comic strip.
  // The comicData state is automatically changed when change comicNumber, through useEffect calls.
  const [comicData, setComicData] = useState()
  const [comicNumber, setComicNumber] = useState()
  //const [firstRenderBool, setFirstRenderBool] = useState()
  const [maxComicId, setMaxComicId] = useState()

  //console.log(`App rendered. comicNumber: ${comicNumber}, maxComicId: ${maxComicId}`)


  // Effect that runs only on first render to get the max comic ID
  useEffect(() => {

    //console.log("useEffect: FIRST RENDER.")
    // Set max comic ID by going through our backend API
    fetch("/api/xkcd/maxComicId").then(
      response => {
        //console.log("response: ", response)
        return response.json()
      }
    ).then(
        data => {
          // console.log("data: ", data)
          // console.log("data.maxComicId: ", data.maxComicId)
          setMaxComicId(data.maxComicId)
        }
    )
  }, [])

  // Effect that is used to fetch the first comic once maxComicId has been set
  useEffect(() => {
    function extractComicIdFromUrl() {
      const comicIdStart = document.URL.lastIndexOf('/')
      const urlEnd = document.URL.slice(comicIdStart).replace('/','')
      const extractedId = +urlEnd
      // console.log("comicIdStart: ", comicIdStart)
      // console.log("urlEnd: ", urlEnd)
      // console.log("extractedId: ", extractedId)
      if (!isNaN(extractedId) && extractedId >= 1 && extractedId <= maxComicId) {
        return extractedId
      } else {
        return maxComicId
      }
    }
    // Trigger the last useEffect function to fetch and display the comic
    // console.log("extracted comicId: ", extractComicIdFromUrl())
    setComicNumber(extractComicIdFromUrl())

  }, [maxComicId])

  // Effect that runs whenever the comic number state changes
  // It is used to update the page when buttons are pressed
  useEffect(() => {
    
    // console.log('useEffect: pre-fetch comicData')
    if (typeof comicNumber !== 'undefined') {  // If initial API calls are complete
      // console.log('useEffect: fetch comicData')
      fetch(`/api/xkcd/${comicNumber}`).then(
          response => {
            return response.json()
          }
      ).then(
          data => {
            setComicData(data)
          }
      )
    }
  }, [comicNumber])


  function decrComicNumber() {
    setComicNumber((prevComicNumber) => prevComicNumber-1)
  }

  function incrComicNumber() {
    setComicNumber((prevComicNumber) => prevComicNumber+1)
  }

  function randomizeComicNumber() {
    setComicNumber(1+Math.floor(Math.random()*(maxComicId-1)))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>XKCD Comics</h1>
        { comicData &&
          <div className="button-box">
            <SmartButton key={1} processClick={decrComicNumber} enabled={comicNumber > 1} text="Previous"/>
            <SmartButton key={2} processClick={randomizeComicNumber} enabled={true} text="Random"/>
            <SmartButton key={3} processClick={incrComicNumber} enabled={comicNumber < maxComicId} text="Next"/>
          </div>
        }
        { comicData && 
          <Comic
            img={comicData.img}
            transcript={comicData.transcript}
            year={comicData.year}
            month={comicData.month}
            day={comicData.day}
            comicNumber={comicNumber}
          />
        }
      </header>
    </div>
  );
}