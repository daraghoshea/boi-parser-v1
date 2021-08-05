
/**
 * @param action String - the action to perform
 * @param payload Object
 * @param state Object
 * @param expectedMutations Array[{type: String, payload: Object}]
 * @param done Function
 *
 * @returns Object
 */
const testAction = (action, payload, state) => {
    let commits = [], dispatches = [];

    // mock commit
    const commit = (type, payload) => {
        commits.push({type,payload});
    };

    // mock dispatch
    const dispatch = (type, payload, options) => {
        dispatches.push({ type, payload, options })
    };

    // call the action with mocked store and arguments
    // TODO any other arguments to mock?
    action({ commit, state, dispatch }, payload);

    return {
        commits,
        dispatches
    }
};

module.exports = {
    testAction
};