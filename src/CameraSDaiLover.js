/**
 * SDaiLover AICamsor for ReactJS Framework.
 * 
 * Machine Learning for Image Photo Classification
 * Data with using ReactJS Framework.
 * 
 * @link      https://www.sdailover.com
 * @email     teams@sdailover.com
 * @copyright Copyright (c) ID 2024 SDaiLover. All rights reserved.
 * @license   https://www.sdailover.com/license.html
 * This software using Yii Framework has released under the terms of the BSD License.
 */

/**
 * Copyright (c) ID 2024 SDaiLover (https://www.sdailover.com).
 * All rights reserved.
 *
 * Licensed under the Clause BSD License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.sdailover.com/license.html
 *
 * This software is provided by the SDAILOVER and
 * CONTRIBUTORS "AS IS" and Any Express or IMPLIED WARRANTIES, INCLUDING,
 * BUT NOT LIMITED TO, the implied warranties of merchantability and
 * fitness for a particular purpose are disclaimed in no event shall the
 * SDaiLover or Contributors be liable for any direct,
 * indirect, incidental, special, exemplary, or consequential damages
 * arising in anyway out of the use of this software, even if advised
 * of the possibility of such damage.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * SDaiLover Camera class.
 * 
 * @author    : Stephanus Bagus Saputra,
 *              ( 戴 Dai 偉 Wie 峯 Funk )
 * @email     : wiefunk@stephanusdai.web.id
 * @contact   : https://t.me/wiefunkdai
 * @support   : https://opencollective.com/wiefunkdai
 * @link      : https://www.stephanusdai.web.id
 */
export class CameraSDaiLover
{
    constructor(player, channel) {
        this.videoRecordFileUrl = null;
        this.video = player;
        this.canvas = channel;
        this.graph = this.canvas.getContext('2d');
    }
    
    static async setupCamera(video, canvas, params, recording=false) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error(
                'Browser API navigator.mediaDevices.getUserMedia not available');
        }
        
        const stream = await navigator.mediaDevices.getUserMedia(params);

        const camera = new CameraSDaiLover(video, canvas);
        camera.video.srcObject = stream;
        let streamSize = stream.getVideoTracks()[0].getSettings();
            
        const videoWidth = streamSize.width;
        const videoHeight = streamSize.height;
        camera.video.width = videoWidth;
        camera.video.height = videoHeight;
    
        camera.canvas.width = videoWidth;
        camera.canvas.height = videoHeight;

        camera.graph.translate(videoWidth, 0);
        camera.graph.scale(-1, 1);

        camera.video.addEventListener('loadeddata', function() {
            camera.video.play();
        });

        if (recording) {
            let videoFileRecorded = [];
            cameraRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            cameraRecorder.addEventListener('dataavailable', function(e) {
                videoFileRecorded.push(e.data);
            });
            cameraRecorder.addEventListener('stop', function() {
                camera.videoRecordFileUrl = URL.createObjectURL(new Blob(videoFileRecorded, { type: 'video/webm' }));
            });

            camera.video.addEventListener('stop', function() {
                cameraRecorder.stop();
            });

            cameraRecorder.start(1000);
        }

        return camera;
    }

    async scanFaceCamera(detector, boundingBox=true, keypoints=true, callback) {
        if (detector == null) {
            throw new Error(
                'Browser API SupportedModels.MediaPipeFaceDetector not available!');
        }

        if (this.video.readyState < 2) {
            await new Promise((resolve) => {
                this.video.onloadeddata = () => {
                    resolve(this.video);
                };
            });
        }

        let faces = null;

        if (detector != null) {
            try {
                faces = await detector.estimateFaces(this.video, {flipHorizontal: false});
            } catch (error) {
                detector.dispose();
                detector = null;
                console.error(error);
            }
        }

        this.drawGraphicBackgroundRemoval();

        if (faces && faces.length > 0) {
            this.drawFaceResults(faces, boundingBox, keypoints);
        }
        return new Promise(function(resolve) {
            resolve(faces);
        });
    }

    drawVideoToCanvas(canvasthumb=null) {
        if (!canvasthumb || canvasthumb==null) {
            this.graph.drawImage(
                this.video, 0, 0, this.video.width, this.video.height);
        } else {
            let graphCanvas = canvasthumb.getContext('2d');         
            canvasthumb.width = this.video.width;
            canvasthumb.height = this.video.height;
            graphCanvas.translate(this.video.width, 0);
            graphCanvas.scale(-1, 1);  
            graphCanvas.drawImage(
                this.video, 0, 0, this.video.width, this.video.height);
        }
    }

    cloneVideoCanvas(canvasSource=null, canvasTarget=null) {
        if (!canvasSource || canvasSource==null) {
            canvasSource = this.video;
        }
        if (!canvasTarget || canvasTarget==null) {
            this.graph.drawImage(
                canvasSource, 0, 0, this.video.width, this.video.height);
        } else {
            let graphCanvas = canvasTarget.getContext('2d');         
            canvasTarget.width = this.video.width;
            canvasTarget.height = this.video.height;
            graphCanvas.translate(this.video.width, 0);
            graphCanvas.scale(-1, 1);  
            graphCanvas.drawImage(
                canvasSource, 0, 0, this.video.width, this.video.height);
        }
    }

    drawGraphicBackgroundRemoval() {
        this.graph.drawImage(this.video, 0, 0, this.video.width, this.video.height);
        const frame = this.graph.getImageData(0, 0, this.video.width, this.video.height);
        const data = frame.data;
      
        for (let i = 0; i < data.length; i += 4) {
          const red = data[i + 0];
          const green = data[i + 1];
          const blue = data[i + 2];
          if (green > 100 && red > 100 && blue < 43) {
            data[i + 3] = 0;
          }
        }
        this.graph.putImageData(frame, 0, 0);
    }

    drawGraphicPath(points, closePath) {
        const region = new Path2D();
        region.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            region.lineTo(point[0], point[1]);
        }
      
        if (closePath) {
            region.closePath();
        }
        this.graph.stroke(region);
    }

    drawFaceResults(faces, boundingBox, showKeypoints) {
        faces.forEach((face) => {
            const keypoints =
                face.keypoints.map((keypoint) => [keypoint.x, keypoint.y]);
        
            if (boundingBox) {
                this.graph.strokeStyle = '#FF2C35';
                this.graph.lineWidth = 1;
            
                const box = face.box;
                this.drawGraphicPath(
                    [
                        [box.xMin, box.yMin-30], [box.xMax, box.yMin-30], [box.xMax, box.yMax-15],
                        [box.xMin, box.yMax-15]
                    ],
                    true);
            }
        
            if (showKeypoints) {
                this.graph.fillStyle = '#32EEDB';
                for (let i = 0; i < 6; i++) {
                    const x = keypoints[i][0];
                    const y = keypoints[i][1];
            
                    this.graph.beginPath();
                    this.graph.arc(x, y, 3, 0, 2 * Math.PI);
                    this.graph.fill();
                }
            }
        });
    }
}

export default CameraSDaiLover;