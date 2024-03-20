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
import CameraSDaiLover from './sdailover.camera';
import CamStorageSDaiLover from './sdailover.camstorage';
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import axios from 'axios';
import * as faceDetection from '@tensorflow-models/face-detection';

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
var SDAICamsorConfig = {
    csrfToken: false,
    player: {
        audio: false,
        video: {
            facingMode: 'user',
            width: { mobile: 360, desktop: 640 },
            height: { mobile: 270, desktop: 480 },
            frameRate: { ideal: 60 }
        }
    },
    thresholdValidation: 0.6,
    sddMobileNetOptions: null,
    detectorModelUrl: '/tfjs-models',
    mobileNetInputWidth: 224,
    mobileNetInputHeight: 224,
    reffScanFaceId: 0,
    minConfidence: 0.2,
    isResultFaceDetected: false,
    isCameraFaceScanning: false,
    isVideoPlaying: false
}

var SDAICamsorStore = {
    session: null,
    camera: null,
    mobilenet: null,
    tensormodel: null,
    detector: null
}

/**
 * SDaiLover AICamsor class.
 * 
 * @author    : Stephanus Bagus Saputra,
 *              ( 戴 Dai 偉 Wie 峯 Funk )
 * @email     : wiefunk@stephanusdai.web.id
 * @contact   : https://t.me/wiefunkdai
 * @support   : https://opencollective.com/wiefunkdai
 * @link      : https://www.stephanusdai.web.id
 */
export class AICamsorSDaiLover
{
    detectDevice = {
        isiOS: function() {
            return /Safari|iPhone|iPad|iPod/i.test(navigator.userAgent);
        },
        isAndroid: function() {
            return /Chrome|Android/i.test(navigator.userAgent);
        },
        isMobile: function() {
            return this.isAndroid() || this.isiOS();
        }          
    };

    constructor(config = {}) {
        this.config = Object.assign({}, SDAICamsorConfig, config);
        this.store = Object.assign({}, SDAICamsorStore);
    }

    hasFaceDetection() {
        return this.config.isResultFaceDetected;
    }

    async loadCanvasCamera() {
        var $this = this;
        if (!this.config.isCameraFaceScanning) {
            setTimeout(async function() {
                $this.store.camera.drawVideoToCanvas();
                $this.loadCanvasCamera();
            }, 1000 / $this.config.player.video.frameRate);
        }
    }

    async createFaceDetector() {
        if (this.store.camera!==null) {
            const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
            const tfjsModelUrl = this.config.detectorModelUrl;
            const detectorConfig = {
                runtime: 'tfjs',
                maxFaces: 1,
                detectorModelUrl: `${tfjsModelUrl}/face_detection_model-weights_manifest.json`
            }
            return await faceDetection.createDetector(model, detectorConfig);
        }
        return null;
    }

    async createFaceApi() {
        const faceApiLibrary = require('@vladmandic/face-api');
        const minConfidence = this.config.minConfidence;
        const tfjsModelUrl = this.config.detectorModelUrl;
        this.config.sddMobileNetOptions = new faceApiLibrary.SsdMobilenetv1Options({ minConfidence }); 
        await faceApiLibrary.loadSsdMobilenetv1Model(`${tfjsModelUrl}/ssd_mobilenetv1_model-weights_manifest.json`);
        await faceApiLibrary.loadFaceLandmarkModel(`${tfjsModelUrl}/face_landmark_68_model-weights_manifest.json`);
        await faceApiLibrary.loadFaceRecognitionModel(`${tfjsModelUrl}/face_recognition_model-weights_manifest.json`);
        await faceApiLibrary.nets.ageGenderNet.load(`${tfjsModelUrl}/age_gender_model-weights_manifest.json`);
        return faceApiLibrary;
    }

    async generateDescriptionPhoto(canvas) {
        var $this = this;
        return new Promise(async function(resolve, reject) {
            setTimeout(async function() {
                try {
                    const faceapi = await $this.createFaceApi();
                    const detections = await faceapi.detectAllFaces(canvas, $this.config.sddMobileNetOptions).withAgeAndGender();
                    detections.forEach(result => {
                        const { age, gender } = result;
                        resolve({ age, gender });
                    });
                } catch(error) {
                    reject(error);
                }
            }, 300);
        });
    }

    getAccuratePhoto() {
        if (this.store.session===null) {
            this.store.session = CamStorageSDaiLover.setupStorage('aicamsor');
        }
        return this.store.session.getItem('validface');
    }

    resetAccuratePhoto() {
        if (this.store.session===null) {
            this.store.session = CamStorageSDaiLover.setupStorage('aicamsor');
        }
        this.store.session.removeItem('validface');
        this.config.reffScanFaceId = 0;
    }

    async validAndSavePhoto(canvasPreview, apiLink=null, methodType = 'encoded', asThumbnail=false) {
        var $this = this;
        if (this.store.camera.video.readyState < 2) {
            await new Promise(function(resolve) {
                this.store.camera.video.addEventListener('loadeddata', function() {
                    resolve(this.store.camera.video);
                });
            });                
        }
        const threshold = this.config.thresholdValidation;
        this.store.camera.drawVideoToCanvas(canvasPreview);
        return new Promise(async function(resolve, reject) {
            setTimeout(async function() {
                try {
                    const extractFaces = await $this.extractFaceFromPhoto(canvasPreview);
                    if (extractFaces.length > 0) {
                        extractFaces.forEach(async (canvasExtract) => {  
                            if (asThumbnail!==false) {
                                const graphCanvas = canvasExtract.getContext('2d');
                                const faceapi = await $this.createFaceApi();
                                faceapi.matchDimensions(canvasPreview, { 
                                    width: graphCanvas.width, height: graphCanvas.height
                                });
    
                                $this.store.camera.cloneVideoCanvas(canvasExtract, canvasPreview);
                            }
                            
                            if ($this.store.session !== null) {
                                const faceapi = await $this.createFaceApi();
                                let isValidPhoto = [];
                                let descriptors = { trainPhoto: null, validPhoto: null };
                                let trainDataStorage = [];
                                descriptors['validPhoto'] = await faceapi.computeFaceDescriptor(canvasExtract);
                                if ($this.getCapturePhoto() != null) {
                                    trainDataStorage = $this.getCapturePhoto();
                                }

                                trainDataStorage.forEach(async (trainPhoto) => {
                                    var trainPhotoImage = new Image();
                                    trainPhotoImage.src = trainPhoto.thumbnail;
                                    descriptors['trainPhoto'] = await faceapi.computeFaceDescriptor(trainPhotoImage);
                                    const distance = faceapi.utils.round(
                                        faceapi.euclideanDistance(descriptors.trainPhoto, descriptors.validPhoto)
                                    )
                                    isValidPhoto.push(distance < threshold);        
                                });

                                Promise.all(isValidPhoto).then(() => {
                                    let checker = arr => arr.every(Boolean);
                                    if (checker(isValidPhoto)) {
                                        const validDataStorage = {
                                            photo: canvasPreview.toDataURL('image/jpeg'),
                                            thumbnail: canvasExtract.toDataURL('image/jpeg')
                                        };
                                        $this.store.session.setItem('validface', validDataStorage);

                                        if (!apiLink) {                            
                                            resolve('Image Validation is Susccessfull.');
                                        } else {
                                            let dataPost = [];
                                            if (methodType == 'json') {
                                                dataPost = {
                                                    '_token': $this.config.csrfToken,
                                                    'photo': canvasPreview.toDataURL('image/jpeg'),
                                                    'thumbnail': canvasExtract.toDataURL('image/jpeg')
                                                };
                                            } else {
                                                dataPost = new FormData();
                                                dataPost.append('_token', $this.config.csrfToken);
                                                dataPost.append('photo', canvasPreview.toDataURL('image/jpeg'));
                                                dataPost.append('thumbnail', canvasExtract.toDataURL('image/jpeg'));
                                            }
                                            try {
                                                const response = axios.post(apiLink, dataPost, {
                                                    'Content-Type': 'application/x-www-form-urlencoded'
                                                });
                                                resolve(response)
                                            } catch(error) {
                                                reject(error)
                                            }
                                        }
                                    } else {
                                        reject(new Error('Face is not valid, please try again.'));
                                    }
                                });
                            }
                            return false;
                        });
                    } else {
                        reject(new Error('Face not detected, please try again.'));
                    }
                } catch(error) {
                    reject(error);
                }
            }, 300);
        });
    }

    getCapturePhoto() {
        if (this.store.session===null) {
            this.store.session = CamStorageSDaiLover.setupStorage('aicamsor');
        }
        return this.store.session.getItem('takeface');
    }

    resetCapturePhoto() {
        if (this.store.session===null) {
            this.store.session = CamStorageSDaiLover.setupStorage('aicamsor');
        }
        this.store.session.removeItem('takeface');
        this.config.reffScanFaceId = 0;
    }

    async saveCapturePhoto(canvasPreview, apiLink=null, methodType = 'encoded', asThumbnail=false) {
        var $this = this;
        if (this.store.camera.video.readyState < 2) {
            await new Promise(function(resolve) {
                this.store.camera.video.addEventListener('loadeddata', function() {
                    resolve(this.store.camera.video);
                });
            });                
        }

        this.store.camera.drawVideoToCanvas(canvasPreview);
        return new Promise(async function(resolve, reject) {
            setTimeout(async function() {
                try {
                    const extractFaces = await $this.extractFaceFromPhoto(canvasPreview);
                    if (extractFaces.length > 0) {            
                        extractFaces.forEach(async (canvasExtract) => {  
                            if (asThumbnail!==false) {
                                const graphCanvas = canvasExtract.getContext('2d');
                                const faceapi = await $this.createFaceApi();
                                faceapi.matchDimensions(canvasPreview, { 
                                    width: graphCanvas.width, height: graphCanvas.height
                                });
    
                                $this.store.camera.cloneVideoCanvas(canvasExtract, canvasPreview);
                            }

                            if ($this.store.session !== null) {
                                let trainDataStorage = [];
                                if ($this.getCapturePhoto() != null) {
                                    trainDataStorage = $this.getCapturePhoto();
                                }
                                trainDataStorage.push({
                                    photo: canvasPreview.toDataURL('image/jpeg'),
                                    thumbnail: canvasExtract.toDataURL('image/jpeg')
                                });
                                $this.store.session.setItem('takeface', trainDataStorage);
                                $this.config.reffScanFaceId++;
                            }

                            if (!apiLink) {                            
                                resolve('Save Image Training is Susccessfull.');
                            } else {
                                let dataPost = [];
                                if (methodType == 'json') {
                                    dataPost = {
                                        '_token': $this.config.csrfToken,
                                        'photo': canvasPreview.toDataURL('image/jpeg'),
                                        'thumbnail': canvasExtract.toDataURL('image/jpeg')
                                    };
                                } else {
                                    dataPost = new FormData();
                                    dataPost.append('_token', $this.config.csrfToken);
                                    dataPost.append('photo', canvasPreview.toDataURL('image/jpeg'));
                                    dataPost.append('thumbnail', canvasExtract.toDataURL('image/jpeg'));
                                }
                                try {
                                    const response = axios.post(apiLink, dataPost, {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    });
                                    resolve(response)
                                } catch(error) {
                                    reject(error)
                                }
                            }
                            return false;
                        });           
                    } else {
                        reject(new Error('Face not detected, please try again.'));
                    }
                } catch(error) {
                    reject(error);
                }
            }, 300);
        });
    }


    async extractFaceFromPhoto(canvas) {
        var $this = this;
        return new Promise(async function(resolve, reject) {
            setTimeout(async function() {
                try {
                    const faceapi = await $this.createFaceApi();
                    const detections = await faceapi.detectAllFaces(canvas, $this.config.sddMobileNetOptions);
                    const faceExtracts = await faceapi.extractFaces(canvas, detections);
                    resolve(faceExtracts);
                } catch(error) {
                    reject(error);
                }
            }, 300);
        });
    }

    async scanFaceCamera() {
        var $this = this;
        this.config.isCameraFaceScanning = true;

        if (this.store.camera!==null) {
            let faces = await this.store.camera.scanFaceCamera($this.store.detector, true, false);
            this.config.isResultFaceDetected = (faces && faces.length > 0 && 
                faces[0].box.width >= 150 && faces[0].box.height >= 150 && 
                faces[0].box.yMin > 0 && faces[0].box.xMin > 0);
            setTimeout(async function() {
                $this.scanFaceCamera();
            }, 1000 / this.config.player.video.frameRate);
        }       
    }

    async run(video, canvas) {
        var $this = this;
        return new Promise(async function(resolve, reject) {
            setTimeout(async function() {
                if (video==null || canvas==null || $this.config.isVideoPlaying!=false) {
                    resolve('Camera has been registered!');
                }
                try { 
                    if (typeof $this.config.player.video.width=='object') {
                        $this.config.player.video.width = $this.detectDevice.isMobile() ? 
                            $this.config.player.video.width.mobile : $this.config.player.video.width.desktop;
                    }
                    if (typeof $this.config.player.video.height=='object') {
                        $this.config.player.video.height = $this.detectDevice.isMobile() ? 
                            $this.config.player.video.height.mobile : $this.config.player.video.height.desktop;
                    }
                    if ($this.store.session===null) {
                        $this.store.session = CamStorageSDaiLover.setupStorage('aicamsor');
                    }
                    $this.store.camera = await CameraSDaiLover.setupCamera(video, canvas, $this.config.player);
                    $this.store.detector = await $this.createFaceDetector();

                    $this.store.camera.video.addEventListener('play', async function() {
                        $this.config.isVideoPlaying = true;
                        $this.loadCanvasCamera();
                        resolve('Camera media is ready to scan face dan take capturing!');
                    });
                } catch(error) {
                    reject(error);
                }
            }, 300);
        });
    }
}

export default AICamsorSDaiLover;