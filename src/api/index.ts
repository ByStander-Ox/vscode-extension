import * as request from 'request-promise-native';
import config from '../config'
import {Commit} from '../types'
import {getStore} from '../store';
const {version} = require('../../package.json');
import * as os from 'os';
import * as vscode from 'vscode';

const {apiHost} = config;

const getURI = (path: string) => apiHost + path;

const getCommonHeaders = (): object => ({
    'X-GD-Extension-Version': version,
    'X-GD-OS': `${os.platform()} ${os.release()}`,
    'X-GD-IDE': vscode.env.appName,
});

async function get({path, qs = {}, getFullResponse = false}: { path: string, qs?: object, getFullResponse?: boolean }): Promise<object> {
    const authToken = getStore().getAuthToken();
    const headers = {...getCommonHeaders(), ...(authToken ? {Authorization: authToken}: {})};

    return request({
        method: 'GET',
        uri: getURI(path),
        resolveWithFullResponse: getFullResponse,
        qs: qs,
        json: true,
        headers,
    });
}

async function post({path, body, getFullResponse = false}: { path: string, body?: object, getFullResponse?: boolean }): Promise<object> {
    const authToken = getStore().getAuthToken();
    const headers = {...getCommonHeaders(), ...(authToken ? {Authorization: authToken}: {})};


    return request({
        method: 'POST',
        uri: getURI(path),
        json: true,
        body: body,
        resolveWithFullResponse: getFullResponse,
        headers,
    });
}

async function addCommits({id, commits = [], snippets = []}: { id: string, commits?: Commit[], snippets?: object[] }) {
    return post({
        path: `/coding-sessions/${id}/commits`,
        body: {
            commits,
            snippets,
        }
    })
}


export {
    addCommits,
}
