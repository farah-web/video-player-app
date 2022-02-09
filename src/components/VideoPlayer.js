import React, { useState, useRef } from 'react'
import '../App.css';
import RealPlayer from 'react-player'
import AppBar from '@mui/material/AppBar'
import ToolBar from '@mui/material/Toolbar'
import { Typography } from '@mui/material';
import { Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PlayerControls from './PlayerControls'
import screenfull from 'screenfull';
import { Grid } from '@mui/material';
import Paper from '@mui/material/Paper';


const useStyles = makeStyles({
  playerWrapper: {
    width: "100%",
    position: "relative"
  },
})

export const VideoPlayer = () => {
  const [state, setState] = useState({
    playing: true,
    muted: true,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
  });
  const [timeDisplayFormat, setTimeDisplayFormat] = useState('normal');
  const [bookmarks, setBookmarks] = useState([]);
  const [counter, setCounter] = useState(0);

  const playerRef = useRef(null)
  const playerContainerRef = useRef(null)
  const canvasRef = useRef(null)
  const controlsRef = useRef(null)

  const { playing, muted, volume, playbackRate, played, seeking } = state

  const format = (miliseconds) => {
    if (isNaN(miliseconds)) {
      return "00:00"
    }
    const date = new Date(miliseconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, '0')
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
    }
    return `${mm}:${ss}`

  }
  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing })
  }

  const handleMute = () => {
    setState({ ...state, muted: !state.muted })
  }

  const handleRewind = () => {
    // console.log('Rewind', playerRef.current.getCurrentTime())
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
  }

  const handleFastForward = () => {
    // console.log('Fast forward', playerRef.current.getCurrentTime())
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)
  }

  //the rate parameter comes from the playerControl after mapping and getting the rate
  const handlePlayBackRateChange = (rate) => {
    //  console.log('rate', rate)
    setState({ ...state, playbackRate: rate })
  }

  // event and newValue(valueLabelDisplay) are the values passed by the slider itself while seeking(moving) it
  //parseFloat() parses a string and returns the first number
  const handleVolumeChange = (e, newValue) => {
    //console.log('Vol change',newValue)
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: state.newValue === 0 ? true : false
    })
  }

  const handleVolumeSeekUp = (e, newValue) => {
    // console.log('Vol change seek',newValue)
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: state.newValue === 0 ? true : false
    })
  }
  const toggleFullScreen = () => {
    screenfull.toggle(playerContainerRef.current)
  }

  //here changeState means that the state changes when time increases in player. An obj with following values is displayed
  //{playedSeconds: 53.764041, played: 0.09013640732605373, loadedSeconds: 80.91, loaded: 0.13564710875715252}

  const handleProgress = (changeState) => {
    if (counter > 3) {
      controlsRef.current.style.visibility = "hidden";
      setCounter(0)
    }

    if (controlsRef.current.style.visibility === "visible") {
      setCounter(counter + 1)
    }

    if (!seeking) {
      setState({ ...state, ...changeState })
    }
  }

  const handleSeekChange = (e, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) })
  }

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true })
  }

  const handleSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false })
    playerRef.current.seekTo(newValue / 100)
  }

  const handleChangeDisplayFormat = () => {
    setTimeDisplayFormat(timeDisplayFormat === 'normal' ? 'remaining' : 'normal')
  }

  const addBookMark = () => {
    const canvas = canvasRef.current;
    // by defining 160 width and 90 height, we get the aspect ration of 16:9
    canvas.width = 160
    canvas.height = 90

    const ctx = canvas.getContext('2d');
    ctx.drawImage(playerRef.current.getInternalPlayer(), 0, 0, canvas.width, canvas.height)

    const imageURL = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;
    setBookmarks([...bookmarks, { time: currentTime, display: elapsedTime, image: imageURL }])
  }

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = 'visible';
    console.log('inside handle mouce move')
    setCounter(0)
  }

  const classes = useStyles();
  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : "00:00"
  const duration = playerRef.current ? playerRef.current.getDuration() : "00:00"

  //format function wrriten up is to format the seconds stored in currentTime into hours, minutes and seconds
  const elapsedTime = timeDisplayFormat === 'normal'
    ? format(currentTime)
    : `${format(duration - currentTime)}`

  const totalDuration = format(duration);

  return (
    <>
      <AppBar position='fixed'>
        <ToolBar>
          <Typography variant='h6'>React Video Player</Typography>
        </ToolBar>
      </AppBar>
      <ToolBar />
      <Container maxWidth='md'>
        <div
          ref={playerContainerRef}
          className={classes.playerWrapper}
          onMouseMove={handleMouseMove}
        >

          <RealPlayer
            ref={playerRef}
            width={'100%'}
            height={'100%'}
            url='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
            muted={muted}// initial value should be true otherwise the video wont run
            playing={playing} //initial value is false
            volume={volume}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            config={{
              file: {
                attributes: {
                  crossOrigin: 'anonymous',
                  controlsList: 'nodownload',
                  onContextMenu:e => e.preventDefault()
                },
              },
            }}
            
          />
          <PlayerControls
            ref={controlsRef}
            onPlayPause={handlePlayPause}
            playing={playing}
            onRewind={handleRewind}
            onFastForward={handleFastForward}
            muted={muted}
            onMute={handleMute}
            onVolumeChange={handleVolumeChange}
            onVolumeSeekUp={handleVolumeSeekUp}
            volume={volume}
            playbackRate={playbackRate}
            onPlaybackRateChange={handlePlayBackRateChange}
            onToggleFullScreen={toggleFullScreen}
            played={played}
            onSeek={handleSeekChange}
            onSeekMouseDown={handleSeekMouseDown}
            onSeekMouseUp={handleSeekMouseUp}
            elapsedTime={elapsedTime}
            totalDuration={totalDuration}
            onChangeDisplayFormat={handleChangeDisplayFormat}
            onBookMark={addBookMark}

          />
        </div>
        <Grid container style={{ marginTop: 20 }} spacing={3}>
          {bookmarks.map((bookmark, index) =>
          (<Grid item key={index}>
            {/* <Paper> */}
            <Paper onClick={() => playerRef.current.seekTo(bookmark.time)}>
              <img src={bookmark.image} crossOrigin='anonymous' alt="bookmark" />
              <Typography>Bookmark at {bookmark.display}</Typography>
            </Paper>
          </Grid>)
          )}
        </Grid>
        {/* here canvas is used to capture the image of the video */}
        <canvas ref={canvasRef} />
      </Container>
    </>
  );
}

export default VideoPlayer;

