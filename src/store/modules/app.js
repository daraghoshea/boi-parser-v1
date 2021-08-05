const state = {
    sidebar: {
        show: true
    }
};

const getters = {
    SHOW_SIDEBAR: state => state.sidebar.show
};

const mutations = {
    TOGGLE_SIDEBAR: state => state.sidebar.show = ! state.sidebar.show,
    SHOW_SIDEBAR: state => state.sidebar.show = true,
    HIDE_SIDEBAR: state => state.sidebar.show = false,
};

const actions = {};

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
};