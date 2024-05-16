# Speech to Text App

This is a simple speech to text application with a UI to record the audio and API to transcribe the recorded audio

## Setup

### Client

- Go to client folder
- Run `npm install`
- Run `npm run dev`

### Server (On a separated terminal)

- Go to server folder
- Run `npm install`
- Copy the .env.example file content
- Create a new file name with .env and paste the copied values
- Replace --API-HERE-- with your deepgram API key
- Run `npm run dev`

## Workflow with screenshots

On first Load of Application![permissions image](screenshots/firstLoad.png)

On Clicking on Start![alt text](screenshots/recording.png)

On stopping of recording![alt text](screenshots/recordingStopped.png)

On processing of Recording![alt text](screenshots/processing.png)

After processing is done![alt text](screenshots/completed.png)
