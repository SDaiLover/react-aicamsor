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
import React from 'react';
import PropTypes from 'prop-types';

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

export interface SDCamsorProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    videoRef?: any;
    canvasRef?: any;
    thumbRef?: any;
    videoId?: any;
    canvasId?: any;
    thumbId?: any;
    videoClassName: string;
    canvasClassName: string;
    thumbClassName: string;
    tagName?: string;
    visible?: boolean;
}

const propTypes = {
    videoRef: PropTypes.any,
    canvasRef: PropTypes.any,
    thumbRef: PropTypes.any,
    className: PropTypes.string,
    videoId: PropTypes.string,
    canvasId: PropTypes.string,
    thumbId: PropTypes.string,
    videoClassName: PropTypes.string,
    canvasClassName: PropTypes.string,
    thumbClassName: PropTypes.string,
    tagName: PropTypes.elementType,
    visible: PropTypes.bool
}

/**
 * SDaiLover SDCamsor Component class.
 * 
 * @author    : Stephanus Bagus Saputra,
 *              ( 戴 Dai 偉 Wie 峯 Funk )
 * @email     : wiefunk@stephanusdai.web.id
 * @contact   : https://t.me/wiefunkdai
 * @support   : https://opencollective.com/wiefunkdai
 * @link      : https://www.stephanusdai.web.id
 */
export class SDCamsor extends React.Component<SDCamsorProps> {
    static displayName = 'SDCamsor';
    static propTypes = propTypes;
    
    static defaultProps = {
        tagName: 'div',
        videoId: 'sdaloverVideo',
        canvasId: 'sdaloverCanvas',
        thumbId: 'sdaloverPreview',
        className: 'video-camera-player canvas-wrapper',
        canvasClassName: 'canvas-camera',
        videoClassName: 'silhouetteVideo video-camera',
        thumbClassName: 'canvas-preview',
        visible: true
    }

    constructor(props: SDCamsorProps) {
        super(props);
    }

    render() {
        const Component = this.props.tagName as React.ElementType;
        return (
            <Component className={this.props.className} hidden={this.props.hidden || !this.props.visible}>
                <canvas id={this.props.thumbId} key={this.props.thumbId} ref={this.props.thumbRef} className={this.props.thumbClassName}></canvas>
                <canvas id={this.props.canvasId} key={this.props.canvasId} ref={this.props.canvasRef} className={this.props.canvasClassName}></canvas>
                <video id={this.props.videoId} key={this.props.videoId} ref={this.props.videoRef} className={this.props.videoClassName} autoPlay={true} playsInline={true} muted={true} />
            </Component>
        );
    }
}

SDCamsor.displayName = 'SDCamsor';
SDCamsor.propTypes = propTypes;
export default SDCamsor;