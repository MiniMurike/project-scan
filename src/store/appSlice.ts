import { createSlice } from '@reduxjs/toolkit'

const dataInitState = {
    windowWidth: 0,
    searchFields: {
    },
    submited: false,
    companyData: {
        summary: [],
        documents: {
            pendingId: 0,
            ids: [],
            data: []
        }
    }
};
// const dataInitState = {
//     windowWidth: 0,
//     searchFields: {
//         inn: 7710137066,
//         documents_count: 65,
//         key: "any",
//         "date-from": "2020-05-20",
//         "date-to": "2024-05-23",
//         maxFullness: true,
//         mention: true,
//         onlyMainRole: true,
//         onlyWithRiskFactors: false,
//         includeTechNews: false,
//         excludeAnnouncements: true,
//     },
//     submited: true,
//     companyData: {
//         summary: [],
//         documents: {
//             pendingId: 0,
//             ids: [],
//             data: []
//         }
//     }
// };

export const appSlice = createSlice({
    name: 'app',
    initialState: dataInitState,
    reducers: {
        updateSearchArgs: (state, action) => {
            return {
                ...state,
                searchFields: {
                    ...state.searchFields,
                    [action.payload.name]: action.payload.value
                }
            }
        },
        resetSearchArgs: (state, action) => {
            return dataInitState;
        },
        setSubmited: (state, action) => {
            return {
                ...state,
                searchFields: {
                    ...state.searchFields
                },
                submited: true
            }
        },
        pushSummary: (state, action) => {
            return {
                ...state,
                companyData: {
                    ...state.companyData,
                    summary: [
                        ...state.companyData.summary,
                        action.payload
                    ]
                }
            }
        },
        setDocumentsIds: (state, action) => {
            return {
                ...state,
                companyData: {
                    ...state.companyData,
                    documents: {
                        ...state.companyData.documents,
                        pendingId: 0,
                        ids: [
                            ...state.companyData.documents.ids,
                            ...action.payload
                        ],
                        data: []
                    }
                }
            }
        },
        updateLastLoadedId: (state, action) => {
            const lastId =
                state.companyData.documents.pendingId + 10 >
                state.companyData.documents.ids.length ?
                state.companyData.documents.ids.length - 1 :
                state.companyData.documents.pendingId + 10
            return {
                ...state,
                companyData: {
                    ...state.companyData,
                    documents: {
                        ...state.companyData.documents,
                        pendingId: lastId,
                    }
                }
            }
        },
        pushDocuments: (state, action) => {
            return {
                ...state,
                companyData: {
                    ...state.companyData,
                    documents: {
                        ...state.companyData.documents,
                        data: [
                            ...state.companyData.documents.data,
                            ...action.payload
                        ]
                    }
                }
            }
        },
        updateWindowWidth: (state, action) => {
            return {
                ...state,
                windowWidth: action.payload
            }
        },
    },
})

export const {
    updateSearchArgs,
    setSubmited,
    resetSearchArgs,
    pushSummary,
    setDocumentsIds,
    updateLastLoadedId,
    pushDocuments,
    updateWindowWidth,
} = appSlice.actions

export default appSlice.reducer

