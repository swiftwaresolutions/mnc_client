export const showMenuAction = (data: any) => {
    return {
        type: "SHOW_MENU",
        payload: data
    }
}

export const clearShowMenuAction = () => {
    return {
        type: 'CLEAR_SHOW_MENU',
        payload: null
    }
}