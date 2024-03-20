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
import Spinner from 'react-bootstrap/Spinner';
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

export interface SDLoadingDialogProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    text?: string;
    wrapperClassName?: string;
    frameClassName?: string;
    tagName?: string;
    visible?: boolean;
}

const propTypes = {
    tagName: PropTypes.elementType,
    className: PropTypes.string,
    text: PropTypes.string, 
    wrapperClassName: PropTypes.string,
    frameClassName: PropTypes.string,
    visible: PropTypes.bool
}

/**
 * SDaiLover Loading Dialog Component class.
 * 
 * @author    : Stephanus Bagus Saputra,
 *              ( 戴 Dai 偉 Wie 峯 Funk )
 * @email     : wiefunk@stephanusdai.web.id
 * @contact   : https://t.me/wiefunkdai
 * @support   : https://opencollective.com/wiefunkdai
 * @link      : https://www.stephanusdai.web.id
 */
export class SDLoadingDialog extends React.Component<SDLoadingDialogProps> {
    static displayName = 'SDLoadingDialog';
    static propTypes = propTypes;
    
    static defaultProps = {
        tagName: 'div',
        className: 'sd-overlay position-absolute',
        text: 'Loading...',
        wrapperClassName: 'loading-wrap position-absolute',
        frameClassName: 'loading-frame position-absolute bg-light rounded-sm opacity-50',
        visible: true
    }

    constructor(props: SDLoadingDialogProps) {
        super(props);
    }

    render() {
        const renderSpanHTML = (rawHTML?: string) => React.createElement("span", { dangerouslySetInnerHTML: { __html: rawHTML }, className: 'visually-hidden' });
        const Component = this.props.tagName as React.ElementType;

        return (
            <Component className={this.props.className} hidden={this.props.hidden || !this.props.visible}>
                <div className={this.props.frameClassName}></div>
                <div className={this.props.wrapperClassName}>
                    <Spinner animation="border" role="status">
                        {renderSpanHTML(this.props.text)}
                    </Spinner>
                </div>
            </Component>
        );
    }
}

SDLoadingDialog.displayName = 'SDLoadingDialog';
SDLoadingDialog.propTypes = propTypes;

export default SDLoadingDialog;