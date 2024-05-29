import React from "react";
import {connect} from "react-redux";
import {RootState} from "../store/store";
import SearchPage from "./SearchPage";

import * as styles from "../styles/resultpage.module.scss";
import Carousel from "./Carousel";
import {resetSearchArgs, pushSummary, setDocumentsIds, updateLastLoadedId, pushDocuments} from "../store/appSlice";
import axios from "axios";
import Document from "./Document";

function CompanyDataPage(props) {
    if (!localStorage.getItem("token")) {
        window.location.replace("/login");
    }

    let objectsearchParams = {};

    React.useEffect(() => {
        if (props.documents.ids.length) props.resetSearchArgs();
        if (props.app.submited) {
            objectsearchParams = {
                "issueDateInterval": {
                    "startDate": new Date(props.app.searchFields["date-from"]).toISOString(),
                    "endDate": new Date(props.app.searchFields["date-to"]).toISOString()
                },
                "searchContext": {
                    "targetSearchEntitiesContext": {
                        "targetSearchEntities": [
                            {
                                "type": "company",
                                "sparkId": null,
                                "entityId": null,
                                "inn": props.searchFilters.inn,
                                "maxFullness": props.searchFilters.maxFullness,
                                "inBusinessNews": null
                            }
                        ],
                        "onlyMainRole": props.searchFilters.onlyMainRole,
                        "tonality": props.searchFilters.tonality,
                        "onlyWithRiskFactors": props.searchFilters.onlyWithRiskFactors,
                        "riskFactors": {
                            "and": [],
                            "or": [],
                            "not": []
                        },
                        "themes": {
                            "and": [],
                            "or": [],
                            "not": []
                        }
                    },
                    "themesFilter": {
                        "and": [],
                        "or": [],
                        "not": []
                    }
                },
                "searchArea": {
                    "includedSources": [],
                    "excludedSources": [],
                    "includedSourceGroups": [],
                    "excludedSourceGroups": []
                },
                "attributeFilters": {
                    "excludeTechNews": props.searchFilters.excludeTechNews,
                    "excludeAnnouncements": props.searchFilters.excludeAnnouncements,
                    "excludeDigests": props.searchFilters.excludeDigests
                },
                "similarMode": "duplicates",
                "limit": props.searchFilters.documents_count,
                "sortType": "sourceInfluence",
                "sortDirectionType": "desc",
                "intervalType": "month",
                "histogramTypes": [
                    "totalDocuments",
                    "riskFactors"
                ]
            }
            getCompanyData();
            getCompanyDocumentsIds();
        }
    }, [props.app.submited])

    React.useEffect(() => {
        if (!props.app.submited) return;
        if (!props.documents.ids.length) return;
        if (props.documents.data.length) return;
        getCompanyDocumentContent();
    }, [props.documents])

    const getCompanyData = () => {
        const apiLink = "https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms";
        axios.post(apiLink,objectsearchParams,
            {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            },
        ).then(response => {
            response.data.data[0].data.map((item, index) => {
                const pushData = {
                    date: item.date,
                    totalDocuments: item.value,
                    riskFactors: response.data.data[1].data[index].value
                }
                props.pushSummary(pushData);
            })
        }).catch(response => {
            console.error(response);
        })
    }

    const getCompanyDocumentsIds = () => {
        const apiLink = "https://gateway.scan-interfax.ru/api/v1/objectsearch";
        axios.post(apiLink, objectsearchParams, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            const documentsId = []
            response.data.items.map(item => {
                documentsId.push(item.encodedId)
            })
            props.setDocumentsIds(documentsId);
        }).catch(response => {
            console.error(response);
        })
    }

    const getCompanyDocumentContent = () => {
        const apiLink = "https://gateway.scan-interfax.ru/api/v1/documents";
        axios.post(apiLink, {
            ids: [
                ...props.documents.ids.slice(props.documents.pendingId, props.documents.pendingId + 10)
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            props.pushDocuments(response.data)
            props.updateLastLoadedId();
        }).catch(response => {
            console.error(response)
        })
    }

    return (
        <>
            {props.app.submited ?
                <main className={styles.main}>
                    {props.summary.length ?
                        <>
                            <div className={styles["content-block"]}>
                                <p className={styles["content-title"]}>Общая сводка</p>
                                <p className={styles["content-description"]}>Найдено {props.summary.length} результатов</p>
                                <Carousel>
                                    {props.summary.map((data, index) =>
                                        <Carousel.Item
                                            key={index}
                                            data={data}
                                            divider={props.summary.length - 1 != index}
                                        />
                                    )}
                                </Carousel>
                            </div>
                            {props.documents.data.length ?
                                <div className={styles["documents-block"]}>
                                    <p className={styles["documents-title"]}>Список документов</p>
                                    <div className={styles["documents-content"]}>
                                        {props.documents.data.map((item, index) =>
                                            <Document
                                                key={index}
                                                data={item.ok}
                                            />)}
                                    </div>
                                    <div className={styles["btn-container"]}>
                                        <button
                                            onClick={getCompanyDocumentContent}
                                            hidden={props.documents.ids.length == props.documents.data.length}
                                        >Показать больше</button>
                                    </div>
                                </div>:""}
                        </>:
                        <div className={styles.loader}>
                            <p className={styles.title}>Ищем. Скоро</p>
                            <p className={styles.title}>будут результаты</p>
                            <p className={styles.description}>Поиск может занять некоторое время,</p>
                            <p className={styles.description}>просим сохранять терпение</p>
                        </div>}
                </main>:
                <SearchPage />
            }
        </>
    )
}

export default connect(
    (state: RootState) => ({
        app: state.app,
        searchFilters: state.app.searchFields,
        summary: state.app.companyData.summary,
        documents: state.app.companyData.documents
    }), {resetSearchArgs, pushSummary, setDocumentsIds, updateLastLoadedId, pushDocuments}
)(CompanyDataPage);