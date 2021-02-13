// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator
        .requestMIDIAccess({
            // sysex: true,
        })
        .then(onMIDISuccess, onMIDIFailure);
} else {
    alert('No MIDI support in your browser.');
}

let midi;

function onMIDISuccess(midiAccess) {
    midi = midiAccess;
    midiAccess.inputs.forEach((midiInput) => {
        console.log('midiInput', midiInput.name, midiInput);
        midiInput.onmidimessage = onMIDIMessage;
    });

    midiAccess.outputs.forEach((midiOutput, key) => {
        console.log('midiOutput', midiOutput.name, midiOutput);
        document.getElementById(
            'output',
        ).innerHTML += `<option value="${key}">${midiOutput.name}</option>`;
    });

    midiAccess.inputs.forEach((midiInput, key) => {
        console.log('midiInput', midiInput.name, midiInput);
        document.getElementById(
            'input',
        ).innerHTML += `<li>${midiInput.name}</li>`;
    });
}

function onMIDIFailure(error) {
    console.error(
        "No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim ",
        error,
    );
}

function onMIDIMessage({ data }) {
    // console.log('MIDI data', data);
    const { value: key } = document.getElementById('output');
    const output = midi.outputs.get(key);
    output.send(data);
}
