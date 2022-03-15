import argparse
import json
import re


def load_survey_data(qualtrics_survey_filepath):
    with open(qualtrics_survey_filepath, "r") as qualtrics_survey_file:
        survey_data = json.load(qualtrics_survey_file)

    return survey_data


def get_survey_elements(survey_data):
    return survey_data["SurveyElements"]


def get_element_type(survey_element):
    return survey_element["Element"]


def get_element_primary_attribute(survey_element):
    return survey_element["PrimaryAttribute"]


def get_element_secondary_attribute(survey_element):
    return survey_element["SecondaryAttribute"]


def get_survey_question_id(survey_element):
    return get_element_primary_attribute(survey_element)


def get_payload(survey_element):
    return survey_element["Payload"]


def is_question_element(survey_element):
    return get_element_type(survey_element) == "SQ"


def is_block_list_element(survey_element):
    return get_element_type(survey_element) == "BL"


def get_survey_questions(survey_data):
    return filter(is_question_element, get_survey_elements(survey_data))


def get_question_text(survey_question):
    return clean_html(get_payload(survey_question)["QuestionText"])


def get_question_texts(survey_questions):
    return map(get_question_text, survey_questions)


def get_survey_blocks(survey_data):
    for element in get_survey_elements(survey_data):
        if is_block_list_element(element):
            return get_payload(element).values()

    return {}


def get_block_description(survey_block):
    return survey_block["Description"]


def get_block_elements(survey_block):
    return survey_block["BlockElements"]


def get_block_element_type(survey_block_element):
    return survey_block_element["Type"]


def get_block_element_question_id(survey_block_element):
    return survey_block_element["QuestionID"]


def block_element_is_question(survey_block_element):
    return get_block_element_type(survey_block_element) == "Question"


def get_block_question_elements(survey_block):
    return filter(block_element_is_question, get_block_elements(survey_block))


def get_block_question_ids(survey_block):
    return map(get_block_element_question_id, get_block_question_elements(survey_block))


def find_question_by_id(question_id, survey_questions):
    for question in survey_questions:
        if get_element_primary_attribute(question) == question_id:
            return question

    print("Could not find question with id " + question_id)
    return None


def map_block_questions(survey_block, survey_questions):
    return map(
        lambda block_element: find_question_by_id(
            get_block_element_question_id(block_element),
            survey_questions),
        get_block_question_elements(survey_block))


def map_blocks_to_questions(survey_blocks, survey_questions):
    blocks_to_questions = {}

    for survey_block in survey_blocks:
        survey_texts = list(get_question_texts(filter_timing_questions(map_block_questions(survey_block, survey_questions))))
        blocks_to_questions[get_block_description(survey_block)] = survey_texts

    return blocks_to_questions


def is_timing_question(survey_question):
    return get_element_secondary_attribute(survey_question) == "Timing"


def filter_timing_questions(survey_questions):
    return filter(lambda question: not is_timing_question(question), survey_questions)


def find_blocks_with_description(survey_blocks, description):
    return filter(lambda block: get_block_description(block).startswith(description), survey_blocks)


clean_html_regex = re.compile('<.*?>')


def clean_html(raw_html):
    clean_text = re.sub(clean_html_regex, '', raw_html)
    return clean_text


def main(qualtrics_survey_filepath):
    survey_data = load_survey_data(qualtrics_survey_filepath)
    survey_questions = list(get_survey_questions(survey_data))
    survey_blocks = get_survey_blocks(survey_data)
    story_blocks = find_blocks_with_description(survey_blocks, "Story-")
    blocks_to_questions = map_blocks_to_questions(story_blocks, survey_questions)

    with open("output_json.json", "w") as output_file:
        json.dump(blocks_to_questions, output_file, sort_keys=True, indent=4, separators=(",", ": "))


if __name__ == "__main__":
    parser = argparse.ArgumentParser("Script to facilitate parsing a qualtrics export json file and spitting out the data needed by the emulator.")
    parser.add_argument("qualtrics_survey_export_file")
    args = parser.parse_args()
    main(args.qualtrics_survey_export_file)
