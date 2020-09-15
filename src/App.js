import React, { useState, useEffect } from 'react';
import './App.css';
import { ReactComponent as DeleteSVG } from './img/delete.svg';
import { ReactComponent as PlaySVG } from './img/play.svg';
import { ReactComponent as BackspaceSVG } from './img/backspace.svg';
const sounds = [
	{ key: 'Q', name: 'agogo.mp3' },
	{ key: 'W', name: 'cabasa.mp3' },
	{ key: 'E', name: 'conga.mp3' },
	{ key: 'A', name: 'conga2.mp3' },
	{ key: 'S', name: 'conga_clean.mp3' },
	{ key: 'D', name: 'conga_clean_higher.mp3' },
	{ key: 'Z', name: 'conga_clean_low.mp3' },
	{ key: 'X', name: 'conga_clean_lower.mp3' },
	{ key: 'C', name: 'conga_clean_lowest.mp3' },
	{ key: ' ', name: 'break' }
];

function App() {
	const [ currentSoundName, setCurrentSoundName ] = useState('');
	const [ sequence, setSequence ] = useState([]);

	// Initializing: fill array with audio objects
	useEffect(() => {
		const audioTags = document.querySelectorAll('audio');
		sounds.map((sound, i) => (sound.audio = audioTags[i]));
	}, []);

	// Add eventlistener to keys after rerender to always refer to current state
	useEffect(
		() => {
			document.addEventListener('keydown', keyDownHandler);
			return () => document.removeEventListener('keydown', keyDownHandler);
		},
		[ sequence ]
	);

	const keyDownHandler = (e) => {
		sounds.forEach((sound, i) => {
			// Apply to QWERTZ and QWERTY keyboard
			if (e.key.toUpperCase() === 'Y') {
				addSound(6);
			} else if (sound.key === e.key.toUpperCase()) {
				addSound(i);
			}
		});
	};

	// Play and store choosen sound after typing or clicking
	const addSound = (i) => {
		playSound(i);
		addToSequence(i);
	};

	// Add to sound sequence and format displayed soundname
	const addToSequence = (i) => {
		setSequence([ ...sequence, i === 9 ? '&nbsp;' : sounds[i].key ]);
	};

	// Play sound if the is no break
	const playSound = (i) => {
		i !== 9 && sounds[i].audio.play();
		setCurrentSoundName(sounds[i].name);
	};

	// Play each sound sequencely after timeout
	const playSequence = () => {
		sequence.forEach((item, i) => {
			setTimeout(() => {
				sounds.forEach((sound, j) => sound.key === item && playSound(j));
			}, 300 * i);
		});
	};

	// Remove last input
	const handleSequencePop = () => {
		setSequence(sequence.slice(0, -1));
	};

	// Remove all
	const handleRemoveSequence = () => {
		setSequence([]);
		setCurrentSoundName('');
	};

	// Creating drum elements apart from 'space'
	const pads = sounds.map((sound, i) => {
		return i < sounds.length - 1 ? (
			<div className="drum-pad" id={sound.key} key={sound.key} onClick={() => addSound(i)}>
				<div className="drum-pad-text">{sound.key}</div>
				<audio className="clip" id={sound.key} src={require('./audio/' + sound.name)} />
			</div>
		) : null;
	});

	return (
		<div className="App" id="drum-machine">
			<div className="App-header">
				<div className="btn-delete btn-container" onClick={handleRemoveSequence}>
					<DeleteSVG />
				</div>
				<h1>Conga Machine</h1>
				<div className="btn-play btn-container" onClick={playSequence}>
					<PlaySVG />
				</div>
			</div>
			<div className="sound-display" id="display">
				{sounds.map((sound, i) => (
					<span key={sound.key} className={`sound-text ${sound.name === currentSoundName ? 'show' : ''}`}>
						{currentSoundName.replace('.mp3', ' ').replaceAll('_', ' ')}
					</span>
				))}
			</div>
			<div className="wrapper">
				<div className="sequence-display">
					<div className="sequence-text" dangerouslySetInnerHTML={{ __html: sequence.join('') }} />
					<div className="btn-backspace" onClick={handleSequencePop}>
						<BackspaceSVG />
					</div>
				</div>
				<div className="drum-pads">
					{pads.map((pad) => pad)}
					<div className="drum-pad-space" id="break" onClick={() => addToSequence(9)} />
				</div>
			</div>
		</div>
	);
}

export default App;
