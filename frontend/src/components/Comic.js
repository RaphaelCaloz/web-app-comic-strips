import React, {useState, useEffect} from "react"

export default function Comic(props) {

    const [numViews, setNumViews] = useState()

    // Get this comic's views and increment them
    useEffect(() => {
        // console.log("props.comicNumber: ", props.comicNumber)
        // console.log(`/api/psql/comicViews/${props.comicNumber}`)
        fetch(`/api/psql/comicViews/${props.comicNumber}`).then(
            response => {
                // console.log("response: ", response)
                return response.json()
            }
        ).then(
            data => {
                // console.log("data: ", data)
                // console.log("Comic numViews: ", data.comicViews)
                setNumViews(data.comicViews+1)
            }
        ).then(_ => {
            fetch(`/api/psql/incrementComicViews/${props.comicNumber}`).then(
                response => {
                    // console.log("response: ", response)
                    return response.json()
                }
            )
        })
    }, [props.comicNumber])

    // Format the date
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    const date = `${months[props.month-1]} ${props.day}, ${props.year}`

    // Clean up transcript
    // console.log("props.transcript: ", props.transcript)
    const processedTranscript = props.transcript.replaceAll('[[', '').replaceAll(']]','').replaceAll('{{', '').replaceAll('}}', '')
    const transcriptLinesArray = processedTranscript.split('\n')
    // console.log("transcriptLinesArray: ", transcriptLinesArray)
    const transcriptElements = transcriptLinesArray.map((line) => (<span>{line}<br></br></span>))

    return (
        <div className="comic-box">
            <img className="comic-img" src={props.img} alt="comic strip"></img>
            <h3>{"Posted on " + date}</h3>
            {(numViews) && (<h3>{numViews + (numViews > 1 ? " views": " view")}</h3>)}
            <h4 className="transcript">{transcriptElements}</h4>
        </div>
    )
}