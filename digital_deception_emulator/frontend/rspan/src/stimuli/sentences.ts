import {shuffle} from "../utils/array_shuffle";

export const sentences: Array<SentenceSetDescription> = [
    {sentence: "When I get up in the morning, the first thing I do is feed my dog.", expectedResponse: true},
    {sentence: "After yelling at the game, I knew I would have a tall voice.", expectedResponse: false},
    {sentence: "Mary was asked to stop at the new mall to pick up several items.", expectedResponse: true},
    {sentence: "When it is cold, my mother always makes me wear a cap on my head.", expectedResponse: true},
    {sentence: "All parents hope their list will grow up to be intelligent.", expectedResponse: false},
    {sentence: "When John and Amy moved to Canada, their wish had a huge garage sale.", expectedResponse: false},
    {sentence: "In the fall, my gift and I love to work together in the yard.", expectedResponse: false},
    {sentence: "At church yesterday morning, Jim's daughter made a terrible plum.", expectedResponse: false},
    {sentence: "Unaware of the hunter, the deer wandered into his shotgun range.", expectedResponse: true},
    {sentence: "Since it was the last game, it was hard to cope with the loss.", expectedResponse: true},
    {sentence: "Because she gets to knife early, Amy usually gets a good parking spot.", expectedResponse: false},
    {sentence: "The only furniture Steve had in his first bowl was his waterbed.", expectedResponse: false},
    {sentence: "Last year, Mike was given detention for running in the hall.", expectedResponse: true},
    {sentence: "The huge clouds covered the morning slide and the rain began to fall.", expectedResponse: false},
    {sentence: "After one date I knew that Linda's sister simply was not my type.", expectedResponse: true},
    {sentence: "Jason broke his arm when he fell from the tree onto the ground.", expectedResponse: true},
    {sentence: "Most people agree that Monday is the worst stick of the week.", expectedResponse: false},
    {sentence: "On warm sunny afternoons, I like to walk in the park.", expectedResponse: true},
    {sentence: "With intense determination he overcame all obstacles and won the race.", expectedResponse: true},
    {sentence: "A person should never be discriminated against based on his race.", expectedResponse: true},
    {sentence: "My mother has always told me that it is not polite to shine.", expectedResponse: false},
    {sentence: "The lemonade players decided to play two out of three sets.", expectedResponse: false},
    {sentence: "Raising children requires a lot of dust and the ability to be firm.", expectedResponse: false},
    {sentence: "The gathering crowd turned to look when they heard the gun shot.", expectedResponse: true},
    {sentence: "As soon as I get done taking this envy I am going to go home.", expectedResponse: false},
    {sentence: "Sue opened her purse and found she did not have any money.", expectedResponse: true},
    {sentence: "Jill wanted a garden in her backyard, but the soil was mostly clay.", expectedResponse: true},
    {sentence: "Stacey stopped dating the light when she found out he had a wife.", expectedResponse: false},
    {sentence: "I told the class that they would get a surprise if they were orange.", expectedResponse: false},
    {sentence: "Jim was so tired of studying, he could not read another page.", expectedResponse: true},
    {sentence: "Although Joe is sarcastic at times, he can also be very sweet.", expectedResponse: true},
    {sentence: "Carol will ask her sneaker how much the flight to Mexico will cost.", expectedResponse: false},
    {sentence: "The sugar could not believe he was being offered such a great deal.", expectedResponse: false},
    {sentence: "I took my little purple to the ice cream store to get a cone.", expectedResponse: false},
    {sentence: "Kristen dropped her parents off at the love for their annual vacation.", expectedResponse: false},
    {sentence: "The firefighters sour the kitten that was trapped in the big oak tree.", expectedResponse: false},
    {sentence: "Peter and Jack ruined the family carwash when they burned the turkey.", expectedResponse: false},
    {sentence: "Martha went to the concert, but ate to bring a thick sweater.", expectedResponse: false},
    {sentence: "Sara wanted her mother to read her a window before going to sleep.", expectedResponse: false},
    {sentence: "Our dog Sammy likes to greet new people by joyful on them.", expectedResponse: false},
    {sentence: "Wendy went to check her mail but all she received were cats.", expectedResponse: false},
    {sentence: "Realizing that she was late, Julia rushed to pick up her child from speaker.", expectedResponse: false},
    {sentence: "Paul likes to cry long distances in the park near his house.", expectedResponse: false},
    {sentence: "The sick boy had to stay home from school because he had a phone.", expectedResponse: false},
    {sentence: "The judge gave the boy community sweat for stealing the candy bar.", expectedResponse: false},
    {sentence: "Women fall in jump with their infants at first sight or even sooner.", expectedResponse: false},
    {sentence: "Jason's family likes to visit him in Atlanta during the cherry every year.", expectedResponse: false},
    {sentence: "The doctor told my aunt that she would feel better after getting happy.", expectedResponse: false},
    {sentence: "The printer sprinted when he tried to print out his report last night.", expectedResponse: false},
    {sentence: "Nick's hockey team won their final game this past weekend at the shoes.", expectedResponse: false},
    {sentence: "My mother and father have always wanted to live near the cup.", expectedResponse: false},
    {sentence: "The prom was only three days away, but neither girl had a dress yet.", expectedResponse: true},
    {sentence: "The children entered in a talent contest to win a trip to Disney World.", expectedResponse: true},
    {sentence: "They were worried that all of their luggage would not fit in the car.", expectedResponse: true},
    {sentence: "The seventh graders had to build a volcano for their science class.", expectedResponse: true},
    {sentence: "The college students went to New York in March and it snowed.", expectedResponse: true},
    {sentence: "She had to cancel the appointment because she caught the flu yesterday.", expectedResponse: true},
    {sentence: "Doug helped his family dig in their backyard for their new swimming pool.", expectedResponse: true},
    {sentence: "The dogs were very excited about going for a walk in the park.", expectedResponse: true},
    {sentence: "In the spring, the large birdfeeder outside my window attracts many birds.", expectedResponse: true},
    {sentence: "Before Katie left for the city, she took a self-defense class at the gym.", expectedResponse: true},
    {sentence: "Mary was excited about her new furniture that she had bought on sale.", expectedResponse: true},
    {sentence: "The class did not think the professor's lecture on history was very interesting.", expectedResponse: true},
    {sentence: "Jane forgot to bring her umbrella and got wet in the rain.", expectedResponse: true},
    {sentence: "Dan walked around the streets posting signs and looking for his lost puppy.", expectedResponse: true},
    {sentence: "The couple decided that they wanted to have a picnic in the park.", expectedResponse: true},
    {sentence: "The girls were very excited about moving into their new house next week.", expectedResponse: true},
    {sentence: "Joseph told his mother that he was probably going to fail sixth grade math.", expectedResponse: true},
    {sentence: "We like to eat eggs and bacon for breakfast in the morning.", expectedResponse: true},
    {sentence: "Harry plans to play a lot of golf when he retires from his job.", expectedResponse: true},
    {sentence: "His stereo was playing so loud that he blew out the speakers.", expectedResponse: true},
    {sentence: "It was a clear night, and we could see the stars in the sky.", expectedResponse: true},
    {sentence: "At the party, Randy got out the camera to take some pictures.", expectedResponse: true},
    {sentence: "Catherine dressed up as a scary witch for the Halloween pencil on Friday.", expectedResponse: false},
    {sentence: "Spring is her favorite time of year because flowers begin to bloom.", expectedResponse: true},
    {sentence: "John wants to be a football player when he gets older.", expectedResponse: true},
    {sentence: "The boys knew they would have to hurry to make it to the apple on time.", expectedResponse: false},
    {sentence: "He wrecked his car because he was going too fast in the rain.", expectedResponse: true},
    {sentence: "The tornado came out of nowhere and destroyed our raisin.", expectedResponse: false},
    {sentence: "After being ill, Suzy hoped to catch up on her work over the weekend.", expectedResponse: true},
    {sentence: "Even though she was in trouble, she managed to go to the dice and shop.", expectedResponse: false},
]

export interface SentenceSetDescription {
    sentence: string;
    expectedResponse: boolean;
}

export function generateSentenceSets(setLengths: Array<number>): Array<Array<SentenceSetDescription>> {
    console.debug("Generating sentence sets");
    let sets: Array<Array<SentenceSetDescription>> = [];
    let tempSentences = shuffle(sentences);
    let currentOffset = 0;
    // let card = this.props.board.cards[(i * this.props.cardsPerRow) + j];

    for (let i = 0; i < setLengths.length; i++) {
        let setLength = setLengths[i];
        let set: Array<SentenceSetDescription> = [];

        for (let j = 0; j < setLength; j++) {
            console.debug("currentOffset: " + currentOffset);
            console.debug("sentence: " + tempSentences[currentOffset].sentence);
            set.push(tempSentences[currentOffset]);
            currentOffset++;
        }

        sets.push(set);
    }

    return sets;
}
