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
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

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

export interface SDErrorDialogProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    titleClassName?: string;
    titleText?: string;
    messageClassName?: string;
    messageText?: string;
    iconImage?: string;
    iconClassName?: string;
    tagName?: string;
    buttonLabel?: string;
    buttonClassName?: string;
    onButtonClick?: any;
    visible?: boolean;
}

const propTypes = {
    tagName: PropTypes.elementType,
    className: PropTypes.string,
    titleClassName: PropTypes.string, 
    titleText: PropTypes.string, 
    messageClassName: PropTypes.string,
    messageText: PropTypes.string,
    iconImage: PropTypes.string,
    iconClassName: PropTypes.string,
    buttonLabel: PropTypes.string,
    buttonClassName: PropTypes.string,
    onButtonClick: PropTypes.func,
    visible: PropTypes.bool
}

/**
 * SDaiLover Error Dialog Component class.
 * 
 * @author    : Stephanus Bagus Saputra,
 *              ( 戴 Dai 偉 Wie 峯 Funk )
 * @email     : wiefunk@stephanusdai.web.id
 * @contact   : https://t.me/wiefunkdai
 * @support   : https://opencollective.com/wiefunkdai
 * @link      : https://www.stephanusdai.web.id
 */
export class SDErrorDialog extends React.Component<SDErrorDialogProps> {
    static displayName = 'SDErrorDialog';
    static propTypes = propTypes;
    
    static defaultProps = {
        tagName: 'div',
        className: 'position-relative p-5 text-center text-muted bg-body border border-dashed rounded-5',
        titleClassName: 'text-body-emphasis',
        titleText: 'No Camera',
        messageText: 'Please activate the camera feature or try using another browser or device that has a camera device.',
        messageClassName: 'col-lg-6 mx-auto mb-4',
        iconClassName: 'mt-5 mx-auto d-block mb-3',
        buttonLabel: 'Try Again',
        buttonClassName: 'btn btn-primary px-5 mb-5',
        visible: true
    }

    constructor(props: SDErrorDialogProps) {
        super(props);
    }

    render() {
        const renderHTML = (rawHTML: string) => React.createElement("span", { dangerouslySetInnerHTML: { __html: rawHTML } });
        const Component = this.props.tagName as React.ElementType;
        let iconImageResult;
        if (this.props.iconImage) {
            iconImageResult = (
                <>
                    <img src={this.props.iconImage} height={32} className={this.props.iconClassName} />
                </>
            )
        } else {
            iconImageResult = (
                <svg className={this.props.iconClassName} xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                    <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z"/>
                </svg>
            )
        }

        return (
            <Component className={this.props.className} hidden={this.props.hidden || !this.props.visible}>
                {iconImageResult}
                <h1 className={this.props.titleClassName}>{this.props.titleText}</h1>
                <p className={this.props.messageClassName}>
                    {this.props.messageText}
                </p>
                <Button onClick={this.props.onButtonClick} variant="primary" className={this.props.buttonClassName}>
                    {parse(this.props.buttonLabel??'')}
                </Button>
            </Component>
        );
    }
}

SDErrorDialog.displayName = 'SDErrorDialog';
SDErrorDialog.propTypes = propTypes;

export default SDErrorDialog;