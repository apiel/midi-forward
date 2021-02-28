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
        midiInput.onmidimessage = onMIDIMessage(midiInput.id);
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
        ).innerHTML += `<option value="${midiInput.id}">${midiInput.name}</option>`;
    });
}

function onMIDIFailure(error) {
    console.error(
        "No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim ",
        error,
    );
}

function onMIDIMessage(id) {
    return ({ data }) => {
        const val = document.getElementById('input').value;
        if (val === 'all' || id === val) {
            const { value: key } = document.getElementById('output');
            const output = midi.outputs.get(key);
            output.send(data);
        }
    };
}
