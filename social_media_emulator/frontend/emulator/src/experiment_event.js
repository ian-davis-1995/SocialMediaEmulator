import $ from "jquery";

export class ExperimentTestRecord {
    constructor(timestamp = null, subject_id = null, id = null, posts = null) {
        this.id = id;

        if (timestamp !== null) {
            this.timestamp = timestamp;
            this.iso_timestamp = new Date(this.timestamp).toISOString();
        } else {
            this.timestamp = 0;
            this.iso_timestamp = "";
        }

        this.emulator_version = window.appVersion;
        this.subject_id = subject_id;
        this.posts = posts;
    }

    fromJSON(event_record) {
        if (event_record.id !== undefined) {
            this.id = event_record.id;
        }

        this.iso_timestamp = new Date(event_record.timestamp).toISOString();
        this.timestamp = new Date(event_record.timestamp).getTime();
        this.subject_id = event_record.subject_id;
        this.posts = event_record.posts;
        this.emulator_version = event_record.version;
    }

    toJSON() {
        if (this.id !== null) {
            return {
                "id": this.id,
                "timestamp": this.iso_timestamp,
                "subject_id": this.subject_id,
                "emulator_version": this.emulator_version,
                "posts": this.posts,
            };
        }

        return {
            "timestamp": this.iso_timestamp,
            "subject_id": this.subject_id,
            "emulator_version": this.emulator_version,
            "posts": this.posts,
        }
    }
}

export class ExperimentEventRecord {
    constructor(timestamp = null,
        event_type = null,
        event_data = null,
        id = null) {
        this.id = id;

        if (timestamp !== null) {
            this.timestamp = timestamp;
            this.iso_timestamp = new Date(this.timestamp).toISOString();
        } else {
            this.timestamp = 0;
            this.iso_timestamp = "";
        }

        this.event_type = event_type;

        if (event_data !== null) {
            this.event_data = event_data;
        } else {
            this.event_data = {};
        }
    }

    fromJSON(event_record) {
        if (event_record.id !== undefined) {
            this.id = event_record.id;
        }

        this.iso_timestamp = new Date(event_record.timestamp).toISOString();
        this.timestamp = new Date(event_record.timestamp).getTime();
        this.event_type = event_record.event_type;
        this.event_data = event_record.event_data;
    }

    toJSON(test_id) {
        if (this.id !== null) {
            return {
                "id": this.id,
                "timestamp": new Date(this.timestamp).toISOString(),
                "event_type": this.event_type,
                "event_data": this.event_data,
                "test_id": test_id,
            };
        }

        return {
            "timestamp": new Date(this.timestamp).toISOString(),
            "event_type": this.event_type,
            "event_data": this.event_data,
            "test_id": test_id,
        };
    }
}

export class MouseClickedElementRecord extends ExperimentEventRecord {
    constructor(timestamp = null, element = null) {
        let id = null;

        if (element !== null) {
            id = element.id;
        }

        super(timestamp, "mouse_clicked_element", {
            "element_id": id,
        });
    }
}

export class MouseMoveEvent extends ExperimentEventRecord {
    constructor(timestamp = null, x = null, y = null) {
        super(timestamp, "mouse_move_event", {
            "x": x,
            "y": y,
        });
    }
}

export class MouseEnteredElementRecord extends ExperimentEventRecord {
    constructor(timestamp = null, element = null) {
        let id = null;

        if (element !== null) {
            id = element.id;
        }

        super(timestamp, "mouse_entered_element", {
            "element_id": id,
        });
    }
}

export class MouseLeftElementRecord extends ExperimentEventRecord {
    constructor(timestamp = null, element = null, timestamp_entered = null) {
        let id = null;

        if (element !== null) {
            id = element.id;
        }

        let iso_timestamp_entered = null;

        if (timestamp_entered != null) {
            iso_timestamp_entered = new Date(timestamp_entered).toISOString()
        }

        super(timestamp, "mouse_left_element", {
            "element_id": id,
            "timestamp_entered": iso_timestamp_entered,
        });
    }

    fromJSON(event_record) {
        super.fromJSON(event_record);
        this.event_data.timestamp_entered = new Date(event_record.event_data.timestamp_entered).getTime();
        this.event_data.timestamp_left = new Date(event_record.event_data.timestamp_left).getTime();
    }
}

export class UserScrolledFeedEventRecord extends ExperimentEventRecord {
    constructor(timestamp = null, time_offset = null, offset_x = null, offset_y = null) {
        super(timestamp, "user_scrolled_feed", {
            "time_offset": time_offset,
            "offset_x": offset_x,
            "offset_y": offset_y,
        });
    }
}

export class UserScrolledPopupEventRecord extends ExperimentEventRecord {
    constructor(timestamp = null,
        time_offset = null,
        offset_x = null,
        offset_y = null) {
        super(timestamp, "user_scrolled_popup", {
            "time_offset": time_offset,
            "offset_x": offset_x,
            "offset_y": offset_y,
        });
    }
}

export class UserScrolledRepliesEventRecord extends ExperimentEventRecord {
    constructor(timestamp = null, time_offset = null, offset_x = null, offset_y = null) {
        super(timestamp, "user_scrolled_replies", {
            "time_offset": time_offset,
            "offset_x": offset_x,
            "offset_y": offset_y,
        });
    }
}

export class PostCameIntoViewEventRecord extends ExperimentEventRecord {
    constructor(timestamp = null, element = null) {
        let id = null;

        if (element != null) {
            id = element.id;
        }

        super(timestamp, "post_came_into_view", {
            "element_id": id,
        });
    }
}

export class PostLeftViewEventRecord extends ExperimentEventRecord {
    constructor(timestamp = null, element = null, timestamp_entered = null) {
        let id = null;

        if (element != null) {
            id = element.id;
        }

        super(timestamp, "post_left_view", {
            "element_id": id,
            "timestamp_entered": timestamp_entered,
        });
    }

    fromJSON(event_record) {
        super.fromJSON(event_record);
        this.event_data.timestamp_entered = new Date(event_record.event_data.timestamp_entered).getTime();
    }
}

export class PostRepliesOpened extends ExperimentEventRecord {
    constructor(timestamp = null, element_id = null) {
        super(timestamp, "post_replies_opened", {
            "element_id": element_id,
        });
    }
}

export class PostRepliesClosed extends ExperimentEventRecord {
    constructor(timestamp = null, element_id = null) {
        super(timestamp, "post_replies_closed", {
            "element_id": element_id,
        });
    }
}

export class ReplyCameIntoView extends ExperimentEventRecord {
    constructor(timestamp = null, element = null) {
        let id = null;

        if (element != null) {
            id = element.id;
        }

        super(timestamp, "reply_came_into_view", {
            "element_id": id,
        });
    }
}

export class ReplyLeftView extends ExperimentEventRecord {
    constructor(timestamp = null, element = null, timestamp_entered = null) {
        let id = null;

        if (element != null) {
            id = element.id;
        }

        super(timestamp, "reply_left_view", {
            "element_id": id,
            "timestamp_entered": timestamp_entered,
        });
    }

    fromJSON(event_record) {
        super.fromJSON(event_record);
        this.event_data.timestamp_entered = new Date(event_record.event_data.timestamp_entered).getTime();
    }
}

export class MultiChoiceAnswerChanged extends ExperimentEventRecord {
    constructor(timestamp = null, post_id = null, answer = null) {
        super(timestamp, "multi_choice_answer_changed", {
            "post_id": post_id,
            "answer": answer,
        });
    }
}

export class PriorKnowledgeAnswerChanged extends ExperimentEventRecord {
    constructor(timestamp = null, post_id = null, answer = null) {
        super(timestamp, "prior_knowledge_answer_changed", {
            "post_id": post_id,
            "answer": answer,
        });
    }
}

export class RequiredResponseCriteriaMet extends ExperimentEventRecord {
    constructor(timestamp = null) {
        super(timestamp, "required_response_criteria_met", {});
    }
}

export class UnhandledError extends ExperimentEventRecord {
    constructor(timestamp = null, message = null, source_script = null, line_number = null, column_number = null) {
        super(timestamp, "unhandled_error", {
            "message": message,
            "source_script": source_script,
            "line_number": line_number,
            "column_number": column_number,
            "app_version": navigator.appVersion,
            "user_agent": navigator.userAgent,
            "browser_width": $(window).width(),
            "browser_height": $(window).height(),
        });

        this.message = message;
        this.source_script = source_script;
        this.line_number = line_number;
        this.column_number = column_number;
    }

    fromJSON(event_record) {
        super.fromJSON(event_record);
        this.message = this.event_data.message;
        this.source_script = this.event_data.source_script;
        this.line_number = this.event_data.line_number;
        this.column_number = this.event_data.column_number;
    }
}

export class StorySegmentRead extends ExperimentEventRecord {
    constructor(timestamp = null, storyId = null, segmentNumber = -1, readTime = null) {
        super(timestamp, "story_segment_read", {
            "read_time_millis": readTime,
            "story_id": storyId,
            "segment_number": segmentNumber,
        });

        this.readTime = readTime;
        this.storyId = storyId;
        this.segmentNumber = segmentNumber;
    }

    fromJSON(event_record) {
        super.fromJSON(event_record);
        this.readTime = this.event_data.read_time_millis;
        this.storyId = this.event_data.story_id;
        this.segmentNumber = this.event_data.segment_number;
    }
}

export class PriorKnowledgeAnswered extends ExperimentEventRecord {
    constructor(timestamp = null, storyId = null, answer = null, readTime = null) {
        super(timestamp, "prior_knowledge_answered", {
            "read_time_millis": readTime,
            "story_id": storyId,
            "answer": answer,
        });

        this.readTimeMillis = readTime;
        this.storyId = storyId;
        this.answer = answer;
    }

    fromJSON(event_record) {
        super.fromJSON(event_record);
        this.readTimeMillis = this.event_data.read_time_millis;
        this.storyId = this.event_data.story_id;
        this.answer = this.event_data.answer;
    }
}

export class ExperimentFinishedEvent extends ExperimentEventRecord {
    constructor(timestamp = null) {
        super(timestamp, "experiment_finished_event", {});
    }
}