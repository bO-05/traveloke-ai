// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
  pointsOfInterestPrompt: any
  itinerary: any
}

type Error = {
  message: string
}

const GPT_KEY = process.env.GPT_API_KEY

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${GPT_KEY}`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | Error>) {
  let days = 4,
    place = 'indonesia',
    month = 'March'
  if (req.body) {
    let body = JSON.parse(req.body)
    days = body.days
    place = body.place
    month = body.month
  }

  const parts = place.split(' ')

  if (parts.length > 10) {
    throw new Error('please reduce size of request')
  }

  if (days > 15) {
    days = 15
  }

  let whenPrompt =
    month == 'winter' || month == 'summer' || month == 'spring' || month == 'autumn'
      ? `in ${month}`
      : `in the month of ${month}`

  let basePrompt = `what is an ideal itinerary for ${days} days ${whenPrompt} in ${place}?`
  console.log('Prompt', basePrompt)

  try {
    /* const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: basePrompt,
        temperature: 0,
        max_tokens: 550
      })
    })*/
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful tourist guide in Indonesia, that also thinks about the weather and time of the season for the suggestions.'
          },
          {
            role: 'user',
            content: basePrompt
          }
        ],
        max_tokens: 1200
      })
    })

    const itinerary = await response.json()
    const pointsOfInterestPrompt =
      'Extract the points of interest out of this text, with no additional words, separated by commas: ' +
      itinerary.choices[0].message.content
    console.log('pointsOfInterestPrompt', pointsOfInterestPrompt)
    res.status(200).json({
      message: 'success',
      pointsOfInterestPrompt,
      itinerary: itinerary.choices[0].message.content
    })
  } catch (err) {
    console.log('error: ', err)
  }
}
