
/* Copyright (c) 2015 William Toohey <will@mon.im>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var window = self;
importScripts('../audio-min.js');

var deinterleave = function(buffer, asset) {
    var channels = asset.format.channelsPerFrame,
        len = buffer.length / channels;

    var result = new Float32Array(len * channels);

    for(var sample = 0; sample < len; sample++) {
        for(var channel = 0; channel < channels; channel++) {
            result[channel*len + sample] = buffer[(sample)*channels + channel];
        }
    }
    return result;
}

self.addEventListener('message', function(e) {
    //decode Ogg
    if(e.data.ogg) {
        importScripts('../ogg.js', '../vorbis.js');
    }
    
    var arrayBuffer = e.data.buffer;
    
    var asset = AV.Asset.fromBuffer(arrayBuffer);
    
    // On error we still want to restore the audio file
    asset.on("error", function(error) {
        self.postMessage({arrayBuffer : arrayBuffer,
            error: String(error)},
            [arrayBuffer]);
    });
    
    asset.decodeToBuffer(function(buffer) {
        var fixedBuffer = deinterleave(buffer, asset);
        var raw = {array: fixedBuffer,
                   sampleRate: asset.format.sampleRate,
                   channels: asset.format.channelsPerFrame}
        self.postMessage({rawAudio : raw,
                          arrayBuffer : arrayBuffer},
                          // transfer objects to save a copy
                          [fixedBuffer.buffer, arrayBuffer]);
    });

}, false);