'use client'

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Home() {
  const [request, setRequest] = useState<{ days?: string; place?: string; month?: string }>({})
  let [itinerary, setItinerary] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  async function hitAPI() {
    try {
      if (!request.month || !request.days || !request.place) return

      if (!request.place) {
        console.log('No place?')
        setMessage('Please select an your travel destination!')
        return
      }

      if (!request.month) {
        console.log('No month?')
        setMessage('Please select an arrival month!')
        return
      }

      if (!request.days) {
        console.log('No date?')
        setMessage('Please select your holiday duration')
        return
      }

      setMessage('Getting suggestions...')
      setLoading(true)
      setItinerary('')

      setTimeout(() => {
        if (!loading) return
        setMessage('Just a minute ...')
      }, 7000)

      setTimeout(() => {
        if (!loading) return
        setMessage('Almost there ...')
      }, 15000)

      const response = await fetch('/api/get-itinerary', {
        method: 'POST',
        body: JSON.stringify({
          days: request.days,
          place: request.place,
          month: request.month
        })
      })
      const json = await response.json()

      const response2 = await fetch('/api/get-points-of-interest', {
        method: 'POST',
        body: JSON.stringify({
          pointsOfInterestPrompt: json.pointsOfInterestPrompt
        })
      })
      const json2 = await response2.json()

      let pointsOfInterest = JSON.parse(json2.pointsOfInterest)
      let itinerary = json.itinerary

      pointsOfInterest.map((point) => {
        // itinerary = itinerary.replace(point, `<a target="_blank" rel="no-opener" href="https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.place)}">${point}</a>`)
        itinerary = itinerary.replace(
          point,
          `[${point}](https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.place)})`
        )
      })

      setItinerary(itinerary)
      setLoading(false)
    } catch (err) {
      console.log('error: ', err)
      setMessage('')
    }
  }

  let days = itinerary.split('Day')

  if (days.length > 1) {
    days.shift()
  } else {
    days[0] = '1' + days[0]
  }

  return (
    <main>
      <div className="app-container">
        <div className="header">
          <h1 style={styles.header} className="hero-header">
            What to do in Indonesia?
          </h1>
          <p style={styles.subheader} className="hero-subheader">
            <a target="_blank" rel="no-opener noreferrer" href="https://twitter.com/async_dime">
              by @async_dime
            </a>
          </p>
        </div>
        <div style={styles.formContainer} className="form-container">
          <input
            required
            style={styles.input}
            placeholder="Where do you want to go in Indonesia?"
            onChange={(e) =>
              setRequest((request) => ({
                ...request,
                place: e.target.value
              }))
            }
          />
          <select
            style={styles.input}
            onChange={(e) => setRequest((request) => ({ ...request, month: e.target.value }))}
          >
            <option value="">When are you arriving?</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
          <input
            type="number"
            style={styles.input}
            placeholder="How many days are you staying?"
            onChange={(e) =>
              setRequest((request) => ({
                ...request,
                days: e.target.value
              }))
            }
          />
          <button className="input-button" onClick={hitAPI}>
            Make my simple itinerary 💡
          </button>
        </div>
        <div className="results-container">
          {loading && <p>{message}</p>}
          {itinerary &&
            days.map((day, index) => (
              // <p
              //   key={index}
              //   style={{marginBottom: '20px'}}
              //   dangerouslySetInnerHTML={{__html: `Day ${day}`}}
              // />
              <div style={{ marginBottom: '30px' }} key={index}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: (props) => {
                      return (
                        <a target="_blank" rel="no-opener noreferrer" href={props.href}>
                          {props.children}
                        </a>
                      )
                    }
                  }}
                >
                  {`Day ${day}`}
                </ReactMarkdown>
              </div>
            ))}
          {itinerary && <div style={{ marginBottom: '30px' }}></div>}
        </div>
      </div>
    </main>
  )
}

const styles = {
  header: {
    textAlign: 'center' as 'center',
    marginTop: '60px',
    color: '#fff',
    fontWeight: '900',
    fontFamily: 'Poppins',
    fontSize: '68px',
    textShadow: '0 0 3px #a5a5a5'
  },
  subheader: {
    right: '15px',
    bottom: '-14px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '500'
  },
  input: {
    padding: '10px 14px',
    marginBottom: '4px',
    outline: 'none',
    fontSize: '16px',
    width: '100%',
    borderRadius: '8px',
    border: 'none',
    color: '#727272'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    margin: '35px auto 0px',
    padding: '20px',
    boxShadow: '0px 0px 12px rgba(5, 105, 135, .5)',
    borderRadius: '10px'
  },
  result: {
    color: 'white'
  }
}
