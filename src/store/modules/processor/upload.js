import Reader from "./filereader";

export default async function(file, commit) {
    return new Promise((resolve, reject) => {
        const reader = new Reader;

        reader.listen({
            loadstart: (e) => {
                commit('SAVE_UPLOAD_START', {id: file.id, bytes: e.loaded});
            },
            progress: (e) => {
                commit('SAVE_UPLOAD_PROGRESS', {id: file.id, bytes: e.loaded});
            },
            loadend: (e) => {
                commit('SAVE_UPLOAD_END', {id: file.id, bytes: e.loaded});
                resolve(reader.reader);
            },
            error: () => {
                const message = `There was an error uploading the file ${file.info.name}`;
                commit('SAVE_UPLOAD_END', {id: file.id, message});
                reject(message);
            },
            abort: () => {
                const message = `The file upload was cancelled: ${file.info.name}`;
                commit('SAVE_UPLOAD_END', {id: file.id, message});
                reject(message);
            }
        });

        try {
            reader.readAsArrayBuffer(file.file);
        }
        catch(e) {
            reject(e.message)
        }
    })
}