import { std } from 'mathjs';

export class SentenceResult {
    public sentences: Array<String> = [];
    public responses: Array<boolean> = [];
    public expectedResponses: Array<boolean> = [];
    public readingTimes: Array<number> = [];
    public averageRTMillis: number = 0;
    public numberCorrect: number = 0;

    addInput(sentence: String, response: boolean, expectedResponse: boolean, readTimeMillis: number) {
        this.sentences.push(sentence);
        this.responses.push(response);
        this.expectedResponses.push(expectedResponse);
        this.readingTimes.push(readTimeMillis);

        if (response === expectedResponse) {
            this.numberCorrect++;
        } else {
            console.debug("You got this one wrong");
            console.debug(sentence);
        }

        if (this.averageRTMillis === 0) {
            this.averageRTMillis = readTimeMillis;
        } else {
            this.averageRTMillis = (this.averageRTMillis + readTimeMillis) / 2;
        }
    }

    percentCorrect(): number {
        console.debug("numberCorrect: " + this.numberCorrect);
        console.debug("total sentences: " + this.sentences.length);
        return (this.numberCorrect / this.sentences.length) * 100;
    }

    meanReadTime(): number {
        let sum = 0;

        for (let i = 0; i < this.readingTimes.length; i++) {
            let readingTime = this.readingTimes[i];
            sum += readingTime;
        }

        return sum / this.readingTimes.length;
    }

    maxReadingTime(): number {
        console.debug(`[SENTENCE_PRACTICE][SENTENCE_MAX] - AVERAGE READING TIME = ${this.meanReadTime()}`);
        console.debug(`[SENTENCE_PRACTICE][SENTENCE_MAX] - STANDARD DEVIATION = ${std(this.readingTimes)}`);
        // The max reading time is defined as 2.5 times the standard deviation of the reading times.
        return this.meanReadTime() + (2.5 * std(this.readingTimes));
    }
}
