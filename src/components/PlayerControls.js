//to enable the playerControls to access controlsRef we use forwardRef
//forwardRef enables the child component reference
//whatever custom compnents we have given if we want to add REF to it we use forwardRef
import React, { useState,forwardRef } from 'react'
import '../App.css';
import { Typography } from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import { Grid } from '@mui/material';
import { Button } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';    
import IconButton from '@mui/material/IconButton'
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';


const useStyles = makeStyles({

    controlWrapper: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    controlIcons: {
        color: '#777',
        fontSize: 50,
        transform: 'scale(0.9)',
        "&:hover": {
            color: '#fff',
            transform: 'scale(1)',
        },
        bottomIcons: {
            color: '#eeeee4',
            transform: 'scale(0.9)',
            "&:hover": {
                color: '#fff',
                transform: 'scale(1)',
            },
        },
        volumeSlider: {
            width: 100,
        },
    }
})

function ValueLabelComponent(props) {
    const { children, value } = props;

    return (
        <Tooltip enterTouchDelay={0} placement="top" title={value}>
            {children}
        </Tooltip>
    );
}

const PrettoSlider = styled(Slider)({
    color: '#52af77',
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#52af77',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});

const PlayerControls = forwardRef(({
    onPlayPause,
    playing,
    onRewind,
    onFastForward,
    muted,
    onMute,
    onVolumeChange,
    onVolumeSeekUp,
    volume,
    playbackRate,
    onPlaybackRateChange,
    onToggleFullScreen,
    played,
    onSeek,
    onSeekMouseDown,
    onSeekMouseUp,
    elapsedTime,
    totalDuration,
    onChangeDisplayFormat,
    onBookMark,
},ref) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClickPopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return <>

        <div className={classes.controlWrapper} ref={ref}>
            {/* TOP CONTROLS ARE VIDEO TITLE AND BOOKMARK */}
            <Grid
                container
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                style={{ padding: 16 }}
            >
                <Grid item>
                    <Typography
                        variant='h5'
                        style={{ color: '#fff' }}
                    >Video Title
                    </Typography>
                </Grid>

                <Grid item>
                    <Button onClick={onBookMark}
                        variant='contained'
                        color='primary'
                        startIcon={<BookmarkIcon />}
                    >Bookmark
                    </Button>
                </Grid>
            </Grid>
            {/* MIDDLE CONTROLS ARE Rewind, Play, FastForward  */}
            <Grid
                container
                direction='row'
                alignItems='center'
                justifyContent='center'
            >
                <IconButton onClick={onRewind} className={classes.controlIcons} aria-label='rewind'>
                    <FastRewindIcon fontSize='large' />
                </IconButton>

                <IconButton onClick={onPlayPause} className={classes.controlIcons} aria-label='play'>
                    {playing ? <PauseIcon fontSize='large' /> : <PlayArrowIcon fontSize='large' />}
                </IconButton>

                <IconButton onClick={onFastForward} className={classes.controlIcons} aria-label='forward'>
                    <FastForwardIcon fontSize='large' />
                </IconButton>
            </Grid>
            {/* BOTTOM CONTROLS ARE Video-Slider, play/pause, volume, fastforward-Rate, full-screen  */}
            <Grid
                container
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                style={{ padding: 16 }}
            >
                <Grid item xs={12}>
                    <PrettoSlider
                        min={0}
                        max={100}
                        value={parseInt(played * 100)}
                        valueLabelDisplay="auto"
                       // ValueLabelComponent={ValueLabelComponent}
                       ValueLabelComponent={(props)=>(
                       <ValueLabelComponent{...props}value={elapsedTime}/>
                       )}
                        onChange={onSeek}
                        onChangeCommitted={onSeekMouseUp}
                        onMouseDown={onSeekMouseDown}

                    />
                </Grid>

                <Grid item>

                    <Box sx={{ width: 300 }}>
                        <Stack spacing={1} direction="row" alignItems="center">

                            <IconButton onClick={onPlayPause} className={classes.bottomIcons}>
                                {playing ? <PauseIcon fontSize='large' /> : <PlayArrowIcon fontSize='large' />}
                            </IconButton>

                            <IconButton onClick={onMute} className={classes.bottomIcons}>
                                {muted ? <VolumeOffIcon fontSize='large' /> : <VolumeUpIcon fontSize='large' />}
                            </IconButton>

                            <Slider className={classes.volumeSlider}
                                size="small"
                                aria-label="Small"
                                valueLabelDisplay="auto"
                                min={0}
                                max={100}
                                value={volume * 100}
                                onChange={onVolumeChange}
                                //onChangeCommited - Callback function that is fired when the mouseup is triggered. Usually used with slider
                                onChangeCommited={onVolumeSeekUp}
                            />
                            <Button onClick={onChangeDisplayFormat} variant='text' style={{ color: '#fff' }}>
                                <Typography>{elapsedTime}/{totalDuration}</Typography>
                            </Button>
                        </Stack>
                    </Box>
                </Grid>

                <Grid item>
                    <Button onClick={handleClickPopover} variant='text' style={{ color: '#fff' }} className={classes.bottomIcons}>
                        <Typography>{playbackRate}<small>x</small></Typography>
                    </Button>

                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Grid container direction='column-reverse'>
                            {
                                [0.5, 1, 1.5, 2].map((rate, index) =>
                                    <Button onClick={() => onPlaybackRateChange(rate)} variant='text' key={index}>
                                        <Typography color={rate === playbackRate ? 'secondary' : 'default'}>{rate}</Typography>
                                    </Button>)
                            }

                        </Grid>
                    </Popover>
                    <IconButton onClick={onToggleFullScreen} style={{ color: '#fff' }} className={classes.bottomIcons}>
                        <FullscreenIcon fontSize='large' />
                    </IconButton>
                </Grid>
            </Grid>
        </div>
    </>;
});

export default PlayerControls;
