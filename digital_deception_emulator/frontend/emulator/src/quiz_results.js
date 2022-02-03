import React from "react";
import Chart from "react-apexcharts";

const postData = require("./stimuli/post_data");


class QuizResults extends React.Component {
    constructor(props) {
        super(props);

        // let answers = props.chosenAnswers;

        // let E = 20 + answers[1] - answers[6] + answers[11] - answers[16] + answers[21] - answers[26] + answers[31] - answers[36] + answers[41] - answers[46];
        // let A = 14 - answers[2] + answers[7] - answers[12] + answers[17] - answers[22] + answers[27] - answers[32] + answers[37] + answers[42] + answers[47];
        // let C = 14 + answers[3] - answers[8] + answers[13] - answers[18] + answers[23] - answers[28] + answers[33] - answers[38] + answers[43] + answers[48];
        // let N = 38 - answers[4] + answers[9] - answers[14] + answers[19] - answers[24] - answers[29] - answers[34] - answers[39] - answers[44] - answers[49];
        // let O = 8 + answers[5] - answers[10] + answers[15] - answers[20] + answers[25] - answers[30] + answers[35] + answers[40] + answers[45] + answers[50];

        let E = 85;
        let A = 25;
        let C = 35;
        let N = 78;
        let O = 92;

        this.state = {
            questions: postData.DUMMY_QUIZ_QUESTIONS,
            chosenAnswers: props.chosenAnswers,
            options: {
                chart: {
                    id: "basic-radar"
                },
                fill: {
                    opacity: 0.5,
                },
                xaxis: {
                    categories: ["Agreeableness", "Openness To Experience", "Extraversion", "Negative Emotionality", "Conscientiousness"]
                }
            },
            series: [
                {
                    name: "Result",
                    data: [A, O, E, N, C]
                }
            ],
            labels: ["Agreeableness", "Openness To Experience", "Extraversion", "Negative Emotionality", "Conscientiousness"],
        }
    }

    render() {
        return (
            <Chart
                options={this.state.options}
                series={this.state.series}
                labels={this.state.labels}
                type="radar"
                width="800"
            />
        );
    }
}

export default QuizResults;