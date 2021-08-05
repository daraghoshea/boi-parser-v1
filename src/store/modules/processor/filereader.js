import {isObject} from 'lodash'

export default class Reader {
    reader;

    constructor() {
        this.reader = new FileReader()
    }

    listen(listeners) {
        if( ! isObject(listeners) ) {
            throw new Error(`Invalid use of Reader listeners`);
        }

        const events = [
            'loadstart', 'load', 'loadend',
            'progress', 'abort', 'error'
        ];

        events.forEach(event => {
            listeners[event] && this.reader.addEventListener(event, listeners[event])
        })
    }

    readAsArrayBuffer(blob) {
        return this.reader.readAsArrayBuffer(blob)
    }

    readAsBinaryString(blob){
        return this.reader.readAsBinaryString(blob)
    }

    readAsDataURL(blob){
        return this.reader.readAsDataURL(blob)
    }

    readAsText(blob){
        return this.reader.readAsText(blob)
    }

    abort() {
        return this.reader.abort()
    }
}