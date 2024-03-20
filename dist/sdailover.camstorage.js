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
 * SDaiLover Session Storage class.
 * 
 * @author    : Stephanus Bagus Saputra,
 *              ( 戴 Dai 偉 Wie 峯 Funk )
 * @email     : wiefunk@stephanusdai.web.id
 * @contact   : https://t.me/wiefunkdai
 * @support   : https://opencollective.com/wiefunkdai
 * @link      : https://www.stephanusdai.web.id
 */
export class CamStorageSDaiLover
{
    constructor(nameKey) {
        this.nameKey = `sdailover-${nameKey}-session`;
    }

    getItem(key) {
        if (typeof window != 'undefined') {
            let sessionItems = JSON.parse(window.sessionStorage.getItem(this.nameKey));
            if (sessionItems!=null) {
                if (sessionItems.hasOwnProperty(key)) {
                    return sessionItems[key];
                }
            }
        }
        return null;
    }

    setItem(key, value) {
        if (typeof window != 'undefined') {
            let sessionItems = JSON.parse(window.sessionStorage.getItem(this.nameKey));
            if (sessionItems==null) {
                sessionItems = {};
            }
            let prepaireItems = {};
            prepaireItems[key] = value;
            window.sessionStorage.setItem(this.nameKey, JSON.stringify(Object.assign({}, sessionItems, prepaireItems)));
        }
    }

    removeItem(key) {
        if (typeof window != 'undefined') {
            let sessionItems = JSON.parse(window.sessionStorage.getItem(this.nameKey));
            if (sessionItems!=null) {
                if (sessionItems.hasOwnProperty(key)) {
                    delete sessionItems[key];
                    window.sessionStorage.setItem(this.nameKey, JSON.stringify(Object.assign({}, sessionItems)));
                }
            }
        }
    }
    
    static setupStorage(nameKey) {
        return new CamStorageSDaiLover(nameKey);
    }
}

export default CamStorageSDaiLover;