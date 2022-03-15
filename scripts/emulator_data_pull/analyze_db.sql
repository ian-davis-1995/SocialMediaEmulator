SELECT *
FROM ExperimentTests;
SELECT *
from ExperimentEvents
where test_id = 15
    and event_type != "mouse_move_event"
    and event_type != "mouse_entered_element"
    and event_type != "mouse_left_element";