import * as module from "../../../src/store/modules/processor";
import {testAction} from "../../utils";

const actions = module.actions;

beforeEach(() => {
    jest.resetModules();
});

// TODO get working when figure out how to do async mocking..
describe.skip('processor workflow', () => {
    test.skip('it reads a pdf file and parses transactions', () => {
        const id = 1;
        const file = {
            id,
            file: 'file'
        };

        jest.doMock("../../../src/store/modules/processor/upload", () => {
            return {
                __esModule: true,
                default: jest.fn(() => {
                    return new Promise((resolve) => {
                        resolve({
                            result: 'data'
                        })
                    })
                })
            };
        });
        return import('../moduleName').then(moduleName => {
            expect(moduleName.default).toEqual('default1');
            expect(moduleName.foo).toEqual('foo1');
        });

        const result = testAction(actions.PROCESS_PDF_FILE, { file });

        console.log(result);

        const expectedCommits = [
            { type: 'START_PROCESSING', payload: { file } },
            { type: 'SAVE_PROGRESS', payload: { id, type: 'started' } },
            { type: 'SAVE_PROGRESS', payload: { id, type: 'read' } },
            { type: 'SAVE_PROGRESS', payload: { id, type: 'loaded' } },
            { type: 'SAVE_PROGRESS', payload: { id, type: 'extracted' } }
        ];

        const expectedDispatches = [
            { type: 'transactions/ADD_MULTIPLE', payload: { transactions: [], meta: {} }, options: { root: true } }
        ];

        expect(result.commits.length).toEqual(expectedCommits.length);
        expect(result.dispatches.length).toEqual(expectedDispatches.length);
    })
})