//This decoding module does not seem to support AAC and M4A.
//It only support MP3 and Ogg?
// Run the loadBuffer function on arrayBuffer data

//Is the audio in ogg format?
var isOgg = false;
var request = new XMLHttpRequest();
// Request audio
request.open('GET', 'mario.mp3', true);
request.responseType = 'arraybuffer';
request.send()
request.onload = function () {
    var gRequest;
    //save request
    gRequest = request;
    console.log(gRequest)
    init()
    //Decode arrayBuffer
    loadBuffer(gRequest.response)
};

function init() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new window.AudioContext();
}

function loadBuffer(buffer) {
    let audioWorker = new Worker('lib/workers/audio-worker.js');
    audioWorker.addEventListener('error', () => {
        reject(Error("Audio Worker failed to convert track"));
    }, false);
    audioWorker.addEventListener('message', e => {
        let decoded = e.data;
        audioWorker.terminate();
        if (decoded.error) {
            console.log(new Error(decoded.error));
            return;
        }
        let audio = this.audioBufFromRaw(decoded.rawAudio);
        this.playBuffer(audio)
    }, false);
    // transfer the buffer to save time
    audioWorker.postMessage({
        buffer: buffer,
        ogg: this.isOgg
    }, [buffer]);

}
//play audio
function playBuffer(decodedBuffer) {
    var sourceNode = this.context.createBufferSource();
    sourceNode.buffer = decodedBuffer;
    sourceNode.connect(this.context.destination);
    sourceNode.start(0);
}
// Converts continuous PCM array to Web Audio API friendly format
function audioBufFromRaw(raw) {
    let buffer = raw.array;
    let channels = raw.channels;
    let samples = buffer.length / channels;
    let audioBuf = this.context.createBuffer(channels, samples, raw.sampleRate);
    for (let i = 0; i < channels; i++) {
        // Offset is in bytes, length is in elements
        let channel = new Float32Array(buffer.buffer, i * samples * 4, samples);
        // Most browsers
        if (typeof audioBuf.copyToChannel === "function") {
            audioBuf.copyToChannel(channel, i, 0);
        } else { // Safari, Edge sometimes
            audioBuf.getChannelData(i).set(channel);
        }
    }
    return audioBuf;
}