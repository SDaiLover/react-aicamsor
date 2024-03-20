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

export interface SDSuccessDialogProps extends React.HTMLAttributes<HTMLElement> {
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
 * SDaiLover Success Dialog Component class.
 * 
 * @author    : Stephanus Bagus Saputra,
 *              ( 戴 Dai 偉 Wie 峯 Funk )
 * @email     : wiefunk@stephanusdai.web.id
 * @contact   : https://t.me/wiefunkdai
 * @support   : https://opencollective.com/wiefunkdai
 * @link      : https://www.stephanusdai.web.id
 */
export class SDSuccessDialog extends React.Component<SDSuccessDialogProps> {
    static displayName = 'SDSuccessDialog';
    static propTypes = propTypes;
    
    static defaultProps = {
        tagName: 'div',
        className: 'position-relative p-5 text-center text-muted bg-body border border-dashed rounded-5',
        titleClassName: 'text-body-emphasis',
        titleText: 'Successfull!',
        messageText: 'Take selfie photo for data absence has been record.',
        messageClassName: 'col-lg-6 mx-auto mb-4',
        iconClassName: 'mt-5 mx-auto d-block mb-3',
        buttonLabel: 'Continue <i className="bi bi-arrow-right-circle-fill"></i>',
        buttonClassName: 'btn btn-primary px-5 mb-5',
        visible: true
    }

    constructor(props: SDSuccessDialogProps) {
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
                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
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

SDSuccessDialog.displayName = 'SDSuccessDialog';
SDSuccessDialog.propTypes = propTypes;

export default SDSuccessDialog;