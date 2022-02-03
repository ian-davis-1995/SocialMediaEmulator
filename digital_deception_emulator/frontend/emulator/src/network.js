import {
    ExperimentTestRecord,
    MouseClickedElementRecord,
    MouseEnteredElementRecord,
    MouseLeftElementRecord,
    MouseMoveEvent, PostCameIntoViewEventRecord,
    PostLeftViewEventRecord, PostRepliesClosed, PostRepliesOpened, ReplyCameIntoView, ReplyLeftView,
    UserScrolledFeedEventRecord,
    UserScrolledPopupEventRecord, UserScrolledRepliesEventRecord
} from "./experiment_event";
import { HeatmapRecord } from "./experiment_playback";

const API_KEY = "9463d2d2-8560-40ea-8f4e-739ac9afed2c";
const BASE_URL = "/digital-deception";

class JSONAPIDriver {
    put(request_url, data) {
        let url = BASE_URL + "/" + request_url;
        let payload = JSON.stringify(data);

        console.debug("Network driver sending put request to url: " + url);
        console.debug("Payload: " + payload);

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Length": payload.length,
                "Content-Type": "application/json",
                "X-HTTP-APIKEY": API_KEY,
            },
            body: payload,
        }

        return fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(response);
                }
            });
    }

    get(request_url) {
        let url = BASE_URL + "/" + request_url;

        const requestOptions = {
            method: "GET",
            headers: {
                "X-HTTP-APIKEY": API_KEY,
            },
        };

        return fetch(url, requestOptions).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        })
    }
}

export class DigitalDeceptionDriver extends JSONAPIDriver {
    testDriverPutResult() {
    }

    putExperimentEventRecords(events, test_id) {
        let jsonRecords = [];

        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            jsonRecords.push(event.toJSON(test_id));
        }

        return this.put("api/event", jsonRecords);
    }

    getAllExperimentTests() {
        return this.get("api/test").then(data => {
            let experiment_tests = [];

            for (let i = 0; i < data.length; i++) {
                let record = data[i];
                let entity = new ExperimentTestRecord();
                entity.fromJSON(record);
                experiment_tests.push(entity);
            }

            return experiment_tests;
        });
    }

    getHeatmapRecords(test_id) {
        return this.get("api/event?test_id=" + test_id + "&event_type=heatmap_mouse_event").then(data => {
            console.debug("Got Heatmap records from server: " + data);

            let heatmap_records = [];

            for (let i = 0; i < data.length; i++) {
                let record = data[i];
                let entity = new HeatmapRecord();
                entity.fromJSON(record);
                heatmap_records.push(entity);
            }

            return heatmap_records;
        });
    }

    getExperimentEventRecords(test_id) {
        return this.get("api/event?test_id=" + test_id).then(data => {
            console.debug("Got experiment event records from server: " + data);

            let experiment_event_records = [];

            for (let i = 0; i < data.length; i++) {
                let record = data[i];
                let entity;
                let event_type = record["event_type"];
                let logPrefix = "[DIGITAL_DECEPTION_DRIVER][getExperimentEventRecords] - ";

                if (event_type === "heatmap_mouse_event") {
                    console.debug(logPrefix + "heatmap_mouse_event");
                    entity = new HeatmapRecord();
                } else if (event_type === "mouse_entered_element") {
                    console.debug(logPrefix + "mouse_entered_element");
                    entity = new MouseEnteredElementRecord();
                } else if (event_type === "mouse_left_element") {
                    console.debug(logPrefix + "mouse_left_element");
                    entity = new MouseLeftElementRecord();
                } else if (event_type === "post_left_view") {
                    console.debug(logPrefix + "post_left_view");
                    entity = new PostLeftViewEventRecord();
                } else if (event_type === "mouse_clicked_element") {
                    console.debug(logPrefix + "mouse_clicked_element");
                    entity = new MouseClickedElementRecord();
                } else if (event_type === "mouse_move_event") {
                    console.debug(logPrefix + "mouse_move_event");
                    entity = new MouseMoveEvent();
                } else if (event_type === "user_scrolled_feed") {
                    console.debug(logPrefix + "user_scrolled_feed");
                    entity = new UserScrolledFeedEventRecord();
                } else if (event_type === "user_scrolled_popup") {
                    console.debug(logPrefix + "user_scrolled_popup");
                    entity = new UserScrolledPopupEventRecord();
                } else if (event_type === "user_scrolled_replies") {
                    console.debug(logPrefix + "user_scrolled_replies");
                    entity = new UserScrolledRepliesEventRecord();
                } else if (event_type === "post_came_into_view") {
                    console.debug(logPrefix + "post_came_into_view");
                    entity = new PostCameIntoViewEventRecord();
                } else if (event_type === "post_replies_opened") {
                    console.debug(logPrefix + "post_replies_opened");
                    entity = new PostRepliesOpened();
                } else if (event_type === "post_replies_closed") {
                    console.debug(logPrefix + "post_replies_closed");
                    entity = new PostRepliesClosed();
                } else if (event_type === "reply_came_into_view") {
                    console.debug(logPrefix + "reply_came_into_view");
                    entity = new ReplyCameIntoView();
                } else if (event_type === "reply_left_view") {
                    console.debug(logPrefix + "reply_left_view");
                    entity = new ReplyLeftView();
                }

                entity.fromJSON(record);
                experiment_event_records.push(entity);
            }

            return experiment_event_records;
        });
    }

    putExperimentEventRecord(event, test_id) {
        console.debug("pushing event record with test id " + test_id);
        let data = event.toJSON(test_id);
        console.debug("Posting experiment event record " + JSON.stringify(data));
        return this.put("api/event", data);
    }

    putExperimentTest(test) {
        console.debug("[NETWORK_DRIVER][PUT_EXPERIMENT_TEST] - " + test.toJSON());
        return this.put("api/test", [test.toJSON()]);
    }

    putHeatmapRecords(records, test_id) {
        console.debug("Pushing heatmap record with test id " + test_id);

        let events = [];

        for (let i = 0; i < records.length; i++) {
            let record = records[i];
            events.push(record.toJSON(test_id));
        }

        return this.put("api/event", events);
    }
}

export class DummyDigitalDeceptionDriver extends DigitalDeceptionDriver {
    constructor() {
        super();

        this.currentTestId = 0;
        this.currentExperimentEventId = 0;
        this.currentSubjectId = 0;
    }

    putExperimentEventRecords(events, test_id) {
        // console.debug("[DUMMY_DRIVER][PUT_EXPERIMENT_EVENT_RECORDS] - " + events);
        return Promise.resolve([]);
    }

    putExperimentTest(test) {
        console.debug("[DUMMY_DRIVER][PUT_EXPERIMENT_TEST] - " + test);
        test.id = ++this.currentTestId;
        test.subject_id = (++this.currentSubjectId).toString();
        return Promise.resolve([
            test.toJSON()
        ]);
    }

    putHeatmapRecords(records, test_id) {
        console.debug("[DUMMY_DRIVER][PUT_HEATMAP_RECORDS] - " + records);
        let heatmapRecords = [];

        for (let i = 0; i < records.length; i++) {
            let record = records[i];
            record.id = ++this.currentExperimentEventId;
            heatmapRecords.push(record.toJSON(test_id));
        }

        return Promise.resolve(heatmapRecords);
    }

    putExperimentEventRecord(event, test_id) {
        console.debug("[DUMMY_DRIVER][PUT_EXPERIMENT_EVENT_RECORD] - " + event);
        return this.putExperimentEventRecords([event], test_id);
    }

    getAllExperimentTests() {
        return Promise.resolve([
            new ExperimentTestRecord(Date.now(), "123", 1),
            new ExperimentTestRecord(Date.now(), "456", 2),
            new ExperimentTestRecord(Date.now(), "678", 2),
            new ExperimentTestRecord(Date.now(), "789", 2),
            new ExperimentTestRecord(Date.now(), "890", 2),
            new ExperimentTestRecord(Date.now(), "243", 2),
        ]);
    }

    getHeatmapRecords(test_id) {
        return Promise.resolve([
            new HeatmapRecord(500, 157, 269),
            new HeatmapRecord(600, 158, 269),
            new HeatmapRecord(723, 160, 269),
            new HeatmapRecord(767, 165, 269),
            new HeatmapRecord(789, 256, 254),
            new HeatmapRecord(826, 278, 267),
            new HeatmapRecord(900, 290, 263),
            new HeatmapRecord(965, 300, 243),
        ]);
    }
}
