import React from "react"

export const DUMMY_POSTS = [
    {
        id: "cdc-sleep-study",
        type: "news_story",
        author: "CDC Newsroom",
        image: "/digital-deception/assets/sleep/cdc-news-story/p0215-enough-sleep.jpeg",
        imageWidth: "75%",
        postDate: "1 Hour Ago",
        headline: "1 in 3 adults don't get enough sleep",
        storySummary: "More than a third of American adults are not getting enough sleep on a regular basis, " +
            "according to a new study in the Centers for Disease Control and Prevention’s (CDC) Morbidity and Mortality Weekly Report. " +
            "This is the first study to document estimates of self-reported healthy sleep duration (7 or more hours per day) " +
            "for all 50 states and the District of Columbia.",
        storySegments: [
            "More than a third of American adults are not getting enough sleep on a regular basis, " +
            "according to a new study in the Centers for Disease Control and Prevention’s (CDC) Morbidity and Mortality Weekly Report. " +
            "This is the first study to document estimates of self-reported healthy sleep duration (7 or more hours per day) for all 50 states and the District of Columbia.\n" ,
            "The American Academy of Sleep Medicine and the Sleep Research Society recommend that adults aged 18–60 years sleep at least 7 hours each night to promote optimal health and well-being." +
            " Sleeping less than seven hours per day is associated with an increased risk of developing chronic conditions " +
            "such as obesity, diabetes, high blood pressure, heart disease, stroke, and frequent mental distress." ,
            "“As a nation we are not getting enough sleep,” said Wayne Giles, M.D., director of CDC’s Division of Population Health. " +
            "“Lifestyle changes such as going to bed at the same time each night; rising at the same time each morning; " +
            "and turning off or removing televisions, computers, mobile devices from the bedroom, can help people get the healthy sleep they need.”" ,
            <div style={{fontWeight: "bold"}}>Prevalence of healthy sleep duration varies by geography, race/ethnicity, employment, marital status</div> ,
            "CDC researchers reviewed data from the 2014 Behavioral Risk Factor Surveillance System (BRFSS), a state-based, " +
            "random-digit–dialed telephone survey conducted collaboratively by state health departments and CDC." ,
            <div style={{fontWeight: "bold"}}>Key Findings:</div> ,
            <ul>
                <li>Healthy sleep duration was lower among Native Hawaiians/Pacific Islanders (54 percent), non-Hispanic blacks (54 percent),</li>
                <li>multiracial non-Hispanics (54 percent) and American Indians/Alaska Natives (60 percent) </li>
                <li>compared with non-Hispanic whites (67 percent), Hispanics (66 percent), and Asians (63 percent).</li>
                <li>The prevalence of healthy sleep duration varied among states and ranged from 56 percent in Hawaii to 72 percent in South Dakota.</li>
                <li>A lower proportion of adults reported getting at least seven hours of sleep per day in states clustered </li>
                <li>in the southeastern region of the United States and the Appalachian Mountains. Previous studies have </li>
                <li>shown that these regions also have the highest prevalence of obesity and other chronic conditions.</li>
                <li>People who reported they were unable to work or were unemployed had lower healthy sleep duration </li>
                <li>(51 percent and 60 percent, respectively) than did employed respondents (65 percent). </li>
                <li>The prevalence of healthy sleep duration was highest among people with a college degree or higher (72 percent).</li>
                <li>The percentage reporting a healthy sleep duration was higher among people who were married (67 percent)</li>
                <li>compared with those who were never married (62 percent) or divorced, widowed, or separated (56 percent).</li>
            </ul>,
            <div style={{fontWeight: "bold"}}>Healthy Sleep Tips:</div>,
            <ul>
                <li>Healthcare providers should routinely assess patients’ sleep patterns and discuss sleep-related problems such as snoring and excessive daytime sleepiness.</li>
                <li>Healthcare providers should also educate patients about the importance of sleep to their health.</li>
                <li>Individuals should make getting enough sleep a priority and practice good sleep habits.</li>
                <li>Employers can consider adjusting work schedules to allow their workers time to get enough sleep.</li>
                <li>Employers can also educate their shift workers about how to improve their sleep.</li>
                <li>For more information on CDC’s Sleep and Sleep Disorders Program, please visit www.cdc.gov/sleep.</li>
            </ul>
        ],
        replies: [
            {
                id: "1",
                type: "basic",
                author: "Ian Davis",
                postDate: "3 Minutes Ago",
                body: "Glad she's okay"
            },
            {
                id: "2",
                type: "basic",
                author: "Katie Larson",
                postDate: "7 Minutes Ago",
                body: "What a wild story!",
            }
        ]
    },
    {
        id: "distraction-sleep-deprivation-infographic-1",
        type: "single-image-view",
        image: "/digital-deception/assets/sleep/infographics/sleep-deprivation-infographic-combined-small.png",
        advertisementStyle: true,
        imageWidth: 480,
        imageHeight: 858
    },
    {
        id: "distraction-sleep-meme-cat",
        type: "single-image-view",
        image: "/digital-deception/assets/sleep/memes/sleep-meme-cat.jpeg",
        author: "Rachel Wong",
        postDate: "2 Hours Ago",
        imageWidth: 720,
        imageHeight: 694,
    },
    {
        id: "distraction-sleep-deprivation-infographic-2",
        type: "single-image-view",
        advertisementStyle: true,
        image: "/digital-deception/assets/sleep/infographics/sleep-deprivation-infographic-2-cropped.png",
        imageWidth: 450,
        imageHeight: 600
    },
    // {
    //     id: "margaret-thatcher-optical-illusion",
    //     type: "two-similar-pictures",
    //     imageOne: "/digital-deception/assets/distractions/margaret-thatcher/Thatcher-1.jpg",
    //     imageOneWidth: 400,
    //     imageOneHeight: 400,
    //     imageTwo: "/digital-deception/assets/distractions/margaret-thatcher/Thatcher-2.jpg",
    //     imageTwoWidth: 400,
    //     imageTwoHeight: 400,
    //     description: "While these images of Margaret Thatcher are both topsy turvy, are they identical? Look closely... Use the slider above to flip them around!",
    //     advertisementStyle: true,
    // },
    {
        id: "distraction-sleep-positive-infographic",
        type: "single-image-view",
        advertisementStyle: true,
        image: "/digital-deception/assets/sleep/infographics/SleepPositiveInfographic.png",
        imageWidth: 540,
        imageHeight: 1200,
    },
    {
        id: "distraction-sleep-negative-infographic",
        type: "single-image-view",
        advertisementStyle: true,
        image: "/digital-deception/assets/sleep/infographics/SleepNegativeInfographic.png",
        imageWidth: 540,
        imageHeight: 1200,
    },
    {
        id: "skywalker-resort-story",
        type: "news_story",
        author: "Beth Hartzler",
        postDate: "2 Hours Ago",
        image: "/digital-deception/assets/skywalker-resort/Skellig-Michael-Ireland.jpg",
        imageWidth: "75%",
        imageAlt: "Map of the Skywalker Resort Island",
        headline: "The force can be with you at the Skellig Islands",
        storySummary: "The Skellig Islands are more stunning and other-worldly than any of the special effects " +
            "of the past two Star Wars movies. Long before Luke Skywalker arrived on the scene, " +
            "the real-life towering rock outcroppings glimpsed in the closing moments of the 2015 film " +
            "The Force Awakens and now playing a starring role in the blockbuster, The Last Jedi, " +
            "have been a sacred place of retreat, pilgrimage and sanctuary.",
        storySegments: [
            "The Skellig Islands are more stunning and other-worldly than any of the special effects of recent Star Wars movies. Long before Luke Skywalker arrived on the scene, the real-life towering cliffs had been a sacred place of retreat, pilgrimage, and sanctuary.",
            "Although the Great Skellig, also known as Skellig Michael and Sceilig Mhichíl, and the Lesser (or Little) Skellig appear to be in a galaxy far, far away. They are in fact about eight miles off the southwest Atlantic coast of Ireland. ",
            "Trekking up 618 steps cut into the sea-bitten cliffs, a visitor arrives at Great Skellig’s ancient monastery near its 715-foot summit. Several structures have miraculously survived Viking raids, relentless wind, and the test of time. This retreat was inspired by the Coptic Church of Egypt and Libya, and St. Anthony in the Desert. The site was used by Gaelic Christian monks who sought extreme solitude here beginning sometime in the 6th to 8th centuries and lasting through the late 12th or early 13th century.",
            "There one can find the remains of an abbey, with a later medieval church built upon it. Alongside the church are two oratory chapels, and a cemetery with stone crosses. On the south of the two peaks, visitors may also find the remnants of a hermitage with three separate terraces. Six complete drystone dwelling houses were home to an estimated 12 monks and an abbot. The church, unlike the beehive dwellings, was erected with a mortar and dedicated at least in the 11th century to Saint Michael.",
            "Following the disbanding of the monasteries in 1578, the islands passed to the private ownership of the Butler family. The Irish Government took possession in the 1820s to erect two lighthouses. One became automated in the 1980s, maintaining a still much-needed beacon on the Atlantic side, where the seas are unpredictable and often turbulent. Since 1880, the Irish Office of Public Works took over the maintenance of the archaeological site.",
            "Little Skellig, where boats are not allowed to land, is a seabird sanctuary and home to one of the largest colonies in the world of northern gannets. The islands are also protected habitats for a number of other birds, but the area is best known for the colorful-beaked puffins.",
            "Thousands of puffins make their home on the island to nest and rear their young during a short summer season. Sturdy and looking like they sport a cap and cloak, the seabirds have short wings that are designed for swimming underwater, yet can also carry the puffin long distances in flight.",
            "The puffins of Skellig Michael are said to be the inspiration for those too-cute-by-far porgs, the indigenous inhabitants of Luke Skywalker’s island, named Ahch-To in the films. But the porgs have nothing on the comical puffin. ",
            "While inhabited for an incredibly lengthy period, the monastery was abandoned probably by the early 13th century, while remaining as a place of periodic penitence and continued pilgrimage. This relocation was also due to the monastic life in Ireland moving away from the ascetic Celtic model with its emphasis on solitude to the more engaged Augustinian Church.",
            "The enigmatic island of hermetic monks, devoted to a life of prayer and study, has been revered for many years. Since its founding, the monastery served as a place of sacred pilgrimage since the medieval period, and a site to study bird life without much human interference. But can Skellig Michael survive a new type of pilgrim, the legions of Star Wars fans?",
            "The island was designated a UNESCO World Heritage Site in 1996. Fragile both architecturally and topographically, visitor access has been limited and only licensed boat operators can bring passengers to disembark on the island.  Visitors must deal with restrictions, the distance from the mainland, and the difficulty of the often-rough seas and arduous climb only for the able-bodied (three tourists have fallen to their deaths since 1995). Despite these hurdles, the number of access permits has recently increased to accommodate demand. There are fears the remote location is becoming a “Disneyesque theme site.” Skellig Michael is now facing the not-uncommon issues of preservation versus the impact of popularity."
        ],
        replies: [
            {
                id: "1",
                type: "basic",
                author: "Ian Davis",
                postDate: "4 Minutes Ago",
                body: "Can't wait to go!",
            },
            {
                id: "2",
                type: "basic",
                author: "Leslie Blaha",
                postDate: "40 Minutes Ago",
                body: "Fascinating!",
            },
            {
                id: "3",
                type: "basic",
                author: "Kathleen Larson",
                postDate: "6 Hours Ago",
                body: "How Bizarre!",
            },
        ]
    },
    {
        id: "twister-story",
        type: "news_story",
        author: "Leslie Blaha",
        postDate: "Yesterday",
        image: "/digital-deception/assets/twister/twister-board-game.jpg",
        imageWidth: "75%",
        headline: "Twister, a questionable product for Milton Bradley",
        storySummary: "The original box for the game Twister was jarring in its conservatism. " +
            "Although the game was marketed mostly to kids and teens, emblazoned across the promotional material for its " +
            "1966 launch were cartoon adults wearing fancy clothes entirely impractical for playing the game. " +
            "Also inexplicably for a game premised on close contact, the adults left a healthy distance between their bodies." +
            "“The men are in full suits and ties, all the way up to their necks. The women have sweaters, buttoned up to their necks,” " +
            "explains the author of a new book about the history of toys. “There was no skin showing at all.”" +
            "That strange design existed for a reason.",
        storySegments: [
            "The original box for the game Twister was jarring in its conservatism. Although the game was marketed mostly to kids and teens, emblazoned across the promotional material for its 1966 launch were cartoon adults wearing fancy clothes entirely impractical for playing the game. Also inexplicably for a game premised on close contact, the adults left a healthy distance between their bodies.",
            "“The men are in full suits and ties, all the way up to their necks. The women have sweaters, buttoned up to their necks,” explains the author of a new book about the history of toys. “There was no skin showing at all.”",
            "That strange design existed for a reason. The original makers of Twister feared parents would deem the game inappropriate for kids because of the close physical proximity of its players. To deflect from concerns around sexual undertones, they packaged it as inoffensively as possible. Nothing screamed “sex!” less than overdressed cartoon adults.",
            "The game’s foremost champion was Milton Bradley’s development executive, who pushed Twister into the market even as others in his company said the game wasn’t worth the risk.",
            "Interviews with the development executive responsible for Twister revealed that he received quite a bit of flak from people internally at Milton Bradley. Most of that internal criticism took an exacting form—Milton Bradley’s brand revolved around making tabletop games, and Twister was a floor game—but a strand of it centered on the concerns that the game would be perceived as too sexual. The executive further shared that there were some people internally that thought it was a little risqué for kids.",
            "As he put it when interviewed shortly before his death, the development executive stated that, “When I showed it to my sales manager, he said: ‘What you're trying to do there is put sex in a box.’ He refused to play. He said it was too far out, kids wrapping themselves around each other like that.”",
            "The two inventors credited on the Twister patent were working at a Minnesota design firm when they developed the game. The initial spark began with the firm’s owner, who in 1964 envisioned the polka-dot board, and he tasked the inventors with turning it into a functioning game. Together, they decided that people should act as the pieces, and then crafted a board to accommodate this design.",
            "After filing the patent and bringing the idea to Milton Bradley, the owner of the design firm and concept originator feared the concern over the game’s undertones meant it would never be released. “They warned us that the idea of being that close to someone––especially someone of the opposite sex––was socially unacceptable,” he explained in a recent book. “The rule we were breaking almost broke the deal. Thankfully, Milton Bradley’s development executive was a rule breaker too.”",
            "When Milton Bradley did eventually distribute the game, those internal fears seemed to manifest. For weeks, few consumers would touch it. Sales flat-lined. At the annual Toy Fair in New York in 1966, even buyers from department stores across the United States expressed their skepticism. But most damning of all, Sears resisted stocking it because, their representative said, the game was “too risqué.”",
            "That decision could not have been more devastating. At the time, Sears had such a monopoly that if they said “we’re not buying this,” it could be the death of a game. After hearing the news, one of Twister’s inventers wrote that “Twister was dead.”",
            "Twister’s saving grace came when late-night host Johnny Carson and actress Eva Gabor to play Twister on Carson’s show in May 1966. The lasting image of the two contorting their bodies before a national audience sent sales skyrocketing, and by 1967, Milton Bradley had moved over 3 million copies. Sears started stocking it. Twister’s subversion of taboos around personal space, no longer fatal baggage, quickly became one of its biggest assets. Today, the game is a global sensation, with its new owner Hasbro citing it as one of its top sales performers in the first quarter of 2019 and the National Toy Hall of Fame honoring it as a 2015 inductee.",
        ],
        replies: [
            {
                id: "1",
                author: "Rachel Wong",
                type: "basic",
                postDate: "7 Hours Ago",
                body: "This is so funny! Ok Boomers!"
            },
            {
                id: "2",
                author: "Megan Morris",
                type: "basic",
                postDate: "12 Hours Ago",
                body: "How did this end up in my feed?"
            }
        ]
    },
    {
        id: "cuttlefish-story",
        type: "news_story",
        author: "Megan Morris",
        postDate: "Wednesday",
        image: "/digital-deception/assets/cuttlefish/cuttlefish-3d-glasses.jpg",
        imageWidth: "75%",
        headline: "The worlds strangest 3D cinema",
        storySummary: "One of the world’s strangest 3-D cinemas is tucked away in a research laboratory in Woods Hole, Massachusetts. " +
            "Its underwater interior lacks seats and aisles, and its screen measures only a few inches high. " +
            "The patrons are European cuttlefish (Sepia officinalis): stout-bodied, color-changing relatives of " +
            "squids and octopuses that deploy a pair of long, limber tentacles to snare their prey.",
        storySegments: [
            "One of the world’s strangest 3-D cinemas is tucked away in a research laboratory in Woods Hole, Massachusetts. Its underwater interior lacks seats and aisles, and its screen measures only a few inches high. The patrons are European cuttlefish (Sepia officinalis): stout-bodied, color-changing relatives of squids and octopuses that deploy a pair of long, limber tentacles to snare their prey.",
            "The film is in 3-D, though the rabbit-sized mollusks don’t take kindly to the blue and red glasses, says a visual ecologist at the University of Minnesota leading the study. To get the spectacles to stick, researchers superglue a patch of Velcro onto the skin between the cuttlefish’s eyes, then affix the glasses on top. On first wear, most of the study subjects reach up with one of their many arms and snatch the lenses right back off. Thanks to an abundance of grass shrimp treats though, the cuttlefish eventually learn to tolerate their new accessories and watch the researchers’ feature films. With this unusual setup, researchers have shown that cuttlefish perceive depth much like humans do: by comparing and combining the slightly offset images of the world that each of our eyes perceives.",
            "Though a far cry from a human, big-brained cuttlefish are good candidates for stereo vision. Unlike their octopus and squid cousins, they swivel both their camera-like eyes forward when they hunt, seemingly calculating the distance between themselves and their grass shrimp prey. The petite, lithe, and translucent crustaceans aren’t easy to snag, and misjudging the coordinates of a catch can leave a cuttlefish hungry. ",
            "The team of ecologists and biologists searched for stereovision in 11 cuttlefish by situating them in a 3-D cephalopod cinema, similar to early 3-D theaters for people. Glasses, outfitted with two filters of different colors, showed each of their eyes a separate image of a tasty shrimp on the screen. If the mollusks were using stereo vision, the colored images would combine in their minds to create the illusion of depth, allowing them to calculate the ideal distance from which to attack their apparently three-dimensional “prey.”",
            "Trained to treat the faux food as real, the bespectacled creatures struck out again and again. Depending on how close together the colored shrimp were, and the order they appeared in, the cuttlefish would either back up from the image or sidle up close—so much so that they’d often bash their tentacles against the screen itself.",
            "Then the researchers switched things up and instead of showing their subjects two colored images, they projected just one, effectively blinding one eye. Stripped of stereo vision, the cuttlefish took longer to position themselves in front of the screen. ",
            "Taken together, these experiments make for “a really compelling demonstration of cephalopod stereopsis,” comments another ecologist who wasn’t involved in the study. “I can’t think of any other explanation.”",
            "The team also presented the cephalopods with another set of shrimp projections, this time superimposed on backgrounds of colored patterns of dots, some bright, some dark. In humans, when one eye sees a pattern of bright and dark dots, and the other eye sees the inverse of the pattern—where the bright and dark dots are reversed—our brains have difficulty reconciling the differences, compromising depth perception. Remarkably, both praying mantises and cuttlefish are unfazed by these inverted background patterns. Rather than trying to come to grips with the conflicting intel, their brains just ignore it, and stereo vision proceeds unimpeded. ",
            "By filtering out some of the clutter in their surroundings, these invertebrates can focus on what’s important: their prey. Humans form a very complex image that gets refreshed over and over in the brain, whereas the cuttlefish and praying mantis just pick out the elements they need without getting bogged down in the details.",
            "And even more animals with these unusual abilities are likely out there. The research team’s previous work hints that predatory robber flies might use stereo vision, too. “For years, people thought that you could only do stereopsis if you had a very big [and complex] brain, because that’s how it is in humans,” but the behavior clearly isn’t as rare as once thought.",
            "Comparing the specifics of stereo vision in these creatures and others might someday help crack the molecular code that makes depth perception possible. “I think people should put more 3-D glasses on more animals,” says one of the researchers who helped pioneer the act in the praying mantis. “If that’s my lasting contribution to science, that’ll be good.”",
        ],
        replies: [
            {
                id: "1",
                author: "Beth Hartzler",
                type: "basic",
                postDate: "12 Hours Ago",
                body: "Should I show my goldfish a 3D movie?",
            },
            {
                id: "2",
                author: "Katie Larson",
                type: "basic",
                postDate: "16 Hours Ago",
                body: "My dog tried to eat the 3D glasses I gave her...",
            }
        ]
    },
    {
        id: "distraction-arc-de-triompe-postcards",
        type: "image-chooser",
        images: [
            "/digital-deception/assets/distractions/vintage-postcard-arc-de-triomphe/vintage-postcard-a.png",
            "/digital-deception/assets/distractions/vintage-postcard-arc-de-triomphe/vintage-postcard-b.png",
            "/digital-deception/assets/distractions/vintage-postcard-arc-de-triomphe/vintage-postcard-c.png",
            "/digital-deception/assets/distractions/vintage-postcard-arc-de-triomphe/vintage-postcard-d.png"
        ],
        imagesPerRow: 2,
        prompt: "Which vintage postcard represents an impossible image - A, B, C, or D?",
        advertisementStyle: true
    },
    {
        id: "goody-garlick-story",
        type: "news_story",
        author: "Ian Davis",
        postDate: "Monday",
        headline: "Avoiding a witch hunt with reason",
        storySummary: "Thirty-five years before the infamous events of Salem, claims of witchcraft and a subsequent trial rocked a small colonial village." +
            "The place was Easthampton, New York. Now a summer resort for the rich and famous—and spelled as two words, East Hampton—at the time it was an English settlement on the remote, eastern tip of Long Island." +
            "There, in February 1658, 16-year old Elizabeth Gardiner Howell, who had recently given birth to a child, fell ill.",
        storySegments: [
            "Thirty-five years before the infamous events of Salem, claims of witchcraft and a subsequent trial rocked a small colonial village.",
            "The place was Easthampton, New York. Now a summer resort for the rich and famous—and spelled as two words, East Hampton—at the time it was an English settlement on the remote, eastern tip of Long Island.",
            "There, in February 1658, 16-year old Elizabeth Gardiner Howell, who had recently given birth to a child, fell ill. As friends tended to her, she terrified them by suddenly shrieking: \"A witch! A witch! Now you are come to torture me because I spoke two or three words against you!” Her father, Lion Gardiner, a former military officer and the town’s most prominent citizen, was summoned. He found his daughter at the foot of her bed, screaming that the witch was in the room. \"What do you see?\" he asked her.",
            "\"A black thing at the bed's feet,\" she answered, flailing at an invisible adversary.",
            "A day later, Howell died—after having named her tormentor as one Elizabeth Garlick, a local resident who often quarreled with neighbors.",
            "A board of inquiry was formed, composed of three male magistrates. They listened to testimony from many of the town’s citizens, some of whom had known “Goody” Garlick since their days in Lynn, Massachusetts, where a number of Easthampton’s residents had lived before re-settling here (In Puritan society, the honorific Goody, short for Goodwife, was given to most women of what we would now call working class status).",
            "The Easthampton town records catalog a litany of accusations of supernatural behavior by Garlick, such as reports that she cast evil eyes and sent animal familiars out to do her bidding. Someone claimed that she picked up a baby and after putting it down, the child took sick and died. She was blamed for illnesses, disappearances, injuries, and the death of livestock.",
            "“These were people on edge,” explains a local East Hampton historian, who along with his wife has researched and written extensively about the Garlick case. “If you look at the court records before this started, people were constantly suing and arguing with each other about all kinds of things we might see as trivial today.”",
            "Still, the charges against Garlick went well beyond the “your-cow-broke-my-fence” accusations. Witchcraft was a capital offense—and Connecticut had a record of knowing exactly what to do with convicted witches; they had executed several unfortunate women in the previous years.",
            "But there was a new sheriff in town in 1658: John Winthrop, Jr. had recently been persuaded to take the position of Governor of the Hartford colony.  A regional historian explains that “Some people were far more skeptical about the role of the devil in magic, and about the ability of common people to practice magic.” In a stroke of good luck for Garlick, Junior was one of those skeptics and he was recruited to preside over her trial.",
            "Winthrop was dubious that your average farmer’s wife—or for that matter, anyone without his level of training or experience—could perform the kinds of magical acts attributed to witches. So he looked to another explanation for people like Goody Garlick and their alleged crimes; one that would likely put him in concert with sociologists and historians today.",
            "Winthrop’s court rendered a not-guilty verdict, and though the records of the trial do not exist, the court’s nuanced directive to the citizens of Easthampton does. It didn’t quite dismiss the idea that Goody Garlick might have been up to something fishy; nor did it come out and label the townspeople who had paraded their second and third-hand allegations against her a bunch of busybodies. It did however make perfectly clear what the court expected from both the Garlicks and the community of Easthampton:",
            "“It is desired and expected by this court that you should carry neighborly and peaceably without just offense, to Jos. Garlick and his wife, and that they should do the like to you.”",
            "Apparently, that’s exactly what happened. As far as can be told from the East Hampton town records, the Garlicks resumed their lives in the community, though chances are they weren’t invited to too many parties, but it was noted that their son later became the miller of the town—a fairly prominent position.",
            "Asked how Winthrop’s decision on the Garlick case affected the community, the East Hampton historian summed it up: “Did we have any more accusations of witchcraft in Easthampton after that? No. Did the town prosper and grow? Yes.”"
        ],
        replies: [
            {
                id: "1",
                author: "Katie Larson",
                postDate: "Tuesday",
                type: "basic",
                body: "I bet she really was a witch!"
            }
        ]
    },
    {
        id: "distraction-tiger-heads",
        type: "single-image-view",
        advertisementStyle: true,
        image: "/digital-deception/assets/distractions/tiger-distraction/tiger-distraction.png",
        prompt: "How many tiger faces can you find in this picture? 7? 14? 16? 19?",
        imageWidth: 1290,
        imageHeight: 830
    },
    {
        id: "irish-moss-story",
        type: "news_story",
        author: "Beth Hartzler",
        postDate: "A week ago",
        headline: "Irish Moss -- A seaweed frontier",
        storySummary: "A lot of us start our days with seaweed, whether or not we know it. From toothpaste to moisturizer to yogurt, " +
            "a compound derived from seaweed called carrageenan is responsible for adding smoothness and suspension to some of our favorite products. " +
            "Now a global industry, carrageenan production in the United States had its unlikely beginnings over 150 years ago. " +
            "At that time, an Irish immigrant spotted a familiar plant off the side of his sailboat.",
        storySegments: [
            "A lot of us start our days with seaweed, whether or not we know it. From toothpaste to moisturizer to yogurt, " +
            "a compound derived from seaweed called carrageenan is responsible for adding smoothness and suspension to some of our favorite products. " +
            "Now a global industry, carrageenan production in the United States had its unlikely beginnings over 150 years ago. " +
            "At that time, an Irish immigrant spotted a familiar plant off the side of his sailboat.",
            "Around 1847, Daniel Ward was sailing off the coast of Boston when he spotted gold—at least in seaweed form. " +
            "Ward had been working as a fisherman when he saw red algae beneath the ocean surface that he recognized as carrageen, or Irish moss. " +
            "Back home in Ireland, the Irish harvested this seaweed for several purposes like making pudding and clarifying beer. " +
            "Daniel immediately saw an opportunity to tap into this unknown resource in his new country and abandoned fishing. " +
            "He decided to settle on the beaches of a small coastal town called Scituate, midway between Boston and Plymouth.",
            "Irish moss, formally known as Chondrus crispus, grows on the surface of undersea rock formations. " +
            "Harvesting is traditionally done by hand, using a 12-foot rake to pry off the broccoli-like tops of the moss, " +
            "being sure not to rip out the stems or “holdfasts,” which would prevent the plant from growing back. " +
            "Mossers tended to travel alone in their small boats, usually for two hours before and after low tide. ",
            "The seasonal conditions of mossing also paved the way for a new occupation: lifesaving. " +
            "Harsh New England winters could destroy incoming boats, and crews often died from hypothermia. " +
            "In 1871, the United States Lifesaving Service was formed to rescue these shipwrecked sailors. " +
            "Since the peak season for mossing runs from June through September, mossers were free to join the " +
            "Lifesaving Service as “surfmen” during the perilous winter months, allowing them to save lives along with their paychecks.",
            "Demand grew when, thanks to widespread manufacturing during World War II, Irish moss found a whole slew of new applications, " +
            "such as stabilizing chocolate milk and being combined with ascorbic acid to form a preservative film over frozen foods. ",
            "The war also changed perceptions of who a mosser could be with more women joining the mossing industry. " +
            "While most working men were serving overseas, women picked up the rakes and began hauling harvests of their own.  " +
            "It is believed that the first female mosser got her start a few years before the war. " +
            "Mim Flynn rowed her own mossing dory at just nine years old as a way to make money for her family. " +
            "Dubbed the “Irish Mossing Queen,” Flynn became a sensation and was covered by newspapers as far away as Canada.",
            "Over the years, the price of moss rose from 1.75 cents per pound in 1960 to over 10 cents per pound by 1990. " +
            "But beneath this success, the game was quietly changing. Mechanical dryers (“Think of oversized clotheshangers,” says Ball) " +
            "were introduced; smaller companies merged to form larger ones. Most significantly, large companies started " +
            "getting their seaweed in farms that were popping up in the Philippines and other parts of Southeast Asia. " +
            "In this way, the rise and fall of Irish mossing in Scituate echoes the fates of so many other cottage industries in America. " +
            "Veteran mosser Hawk Hickman compares it to blacksmithing. “Like many manual industries, " +
            "there were a combination of factors that led to its demise—foreign competition, people unwilling to do it anymore,” he claims. ",
            "But even without a daily fleet of mossers, the effects of the industry are still palpable throughout Scituate. " +
            "The 2020 census showed that Scituate had the highest number of people claiming Irish ancestry than any other town in America. " +
            "The amount of Irish heritage has earned Scituate the nickname the “Irish Riviera.” Ball also manages Scituate’s Maritime and Mossing Museum," +
            " which opened two weeks after the mossing industry officially ended in 1997. ",
            "The museum hosts Irish mosser reunions, where veteran mossers come back to share stories and hear about the industry today. " +
            "Hickman even brings his old dory to complete the experience. On a graffiti wall inside the museum, mossers can write " +
            "their name and their record harvest for a single day. “Some of them lie about it, of course,” Ball tells me. " +
            "While Scituate has since found other industries and college students now look elsewhere for summer jobs, " +
            "Irish mossing undoubtedly leaves behind memories of its salt-crusted Golden Age. “Some people I mossed with went on to high profile careers,”" +
            " says Ball, “and they would still tell you the best job they ever had was mossing.”"
        ]
    },
    {
        id: "turtle-swimsuits-story",
        type: "news_story",
        author: "Rachel Wong",
        postDate: "A week ago",
        headline: "Turtles in Swimsuits",
        storySummary: "They're baby sea turtles. They're wearing swimsuits. What more do you need to know? Well a lot, actually. " +
            "As reported for National Geographic, though they're certainly adorable, these tiny tots could help researchers better " +
            "understand the impacts of light pollution on baby turtle survival after they make their break from the safety of their nest to the open ocean." +
            "Sea turtles build their nests right on the beach to give the itsy-bitsy hatchlings a fighting chance to flipper themselves into the ocean.",
        storySegments: [
            "They're baby sea turtles. They're wearing swimsuits. What more do you need to know? Well a lot, actually. As reported for National Geographic, though they're certainly adorable, these tiny tots could help researchers better understand the impacts of light pollution on baby turtle survival after they make their break from the safety of their nest to the open ocean.",
            "Sea turtles build their nests right on the beach to give the itsy-bitsy hatchlings a fighting chance to flipper themselves into the ocean. They have a lot of predators—gulls, crabs, raccoons, and more—that would love to gobble them up like tourists at a buffet, but if all goes well, a hatchling can make it into the ocean within a few minutes, likely drawn to the brightest light on the lowest horizon.",
            "But in this modern world, lights are everywhere, and the tiny reptiles can get disoriented and take a more circuitous route to find water. This exhausting venture can sometimes last hours. How does all that exercise affect the little creatures once they make it to water? Researchers at a Florida University decided to put some baby turtles to the test to figure it out.",
            "In a press release, one biologist participating in the research explained “We wanted to know if they would even be able to swim after crawling 1,640 feet or more, which could take them as long as seven hours to complete.” ",
            "So these researchers collected 150 newborn loggerhead and green sea turtles from Palm Beach County, Florida, and then exercised each turtle in the lab using a custom-built herp treadmill with a light suspended in front of the device to attract the little critters. In one test, they simulated the long distances disoriented animals might walk on the beach, keeping the babies marching for 656 feet. In another, they had them scramble for 1,640 feet.",
            "After the workout, the researchers then fitted the turtles into little swimsuits connected to a harness and put them in a tank of water, observing how they swam for two hours. Meanwhile, the researchers measured vital signs like oxygen consumption, glucose, plasma lactate levels as well as the number of swimming strokes they performed.",
            "The team also conducted field studies, following baby turtles on the beach and measuring the distances they traveled, how long it took them, and how often they rested to ensure their treadmill study simulated reality. They detailed their results this week in a study published last month in The Journal of Biology.",
            "What they found is that the tiny turtles are incredibly tough. “We were completely surprised by the results of this study. We were expecting that the hatchlings would be really tired from the extended crawling and that they would not be able to swim well.\" That turned out not to be the case. \"They are, in fact, crawling machines,\" one researcher explained. \"They crawl and rest, crawl and rest and that’s why they weren’t too tired to swim.”",
            "While that’s good news for the turtles, it doesn’t mean light pollution isn’t hurting them. The authors note that spending more time on the beach either walking or resting raises the potential that the turtles will be eaten by predators, lured into a swimming pool, or head into downtown Miami.",
            "The executive director of the Sea Turtle Conservancy, who was not involved in the study, explained that the study provides great new information but has some limitations. For instance, in Florida, once the turtles hit the ocean they need to make an epic 30-mile swim to reach the jet stream, where they are relatively safe.",
            "While the researchers were only allowed to observe the turtles for two hours post-workout before returning them to the beach, watching them for 24 hours might show different results. Researchers in the study agree that it would be beneficial to watch the turtles longer—and so do we. Any scientific reason for putting a bathing suit on a baby turtle is alright by us, especially if there's a webcam so we can watch.\n"
        ]
    },
    // {
    //     id: "distraction-brick-wall-cigar",
    //     type: "distraction-brick-wall-cigar",
    //     advertisementStyle: true,
    // },
];

export const DUMMY_QUIZ_QUESTIONS = [
    {
        "id": "tend-quiet",
        "title": "I tend to be quiet.",
        "answers": [
            {
                "id": "disagree-strongly",
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 2,
        "title": "I am compassionate and have a soft heart.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 3,
        "title": "I tend to be disorganized.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 4,
        "title": "I worry a lot.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 5,
        "title": "I am fascinated by art, music or literature.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 6,
        "title": "I am dominant and act as a leader.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 7,
        "title": "I am sometimes rude to others.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 8,
        "title": "I have difficulty getting started on tasks.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 9,
        "title": "I tend to feel depressed and blue.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 10,
        "title": "I have little interest in abstract ideas.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 11,
        "title": "I am full of energy.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 12,
        "title": "I assume the best about people.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 13,
        "title": "I am reliable and can always be counted on.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 14,
        "title": "I am emotionally stable and not easily upset.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 15,
        "title": "I am original and come up with new ideas.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 16,
        "title": "I am outgoing and sociable.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 17,
        "title": "I can be cold and uncaring.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 18,
        "title": "I keep things neat and tidy.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 19,
        "title": "I am relaxed and handle stress well.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 20,
        "title": "I have few artistic interests.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 21,
        "title": "I prefer to have others take charge.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 22,
        "title": "I am respectful and treat others with respect.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 23,
        "title": "I am persistent and work until the task is finished.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 24,
        "title": "I feel secure and comfortable with myself.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 25,
        "title": "I am complex and a deep thinker.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 26,
        "title": "I am less active than other people.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 27,
        "title": "I tend to find fault with others.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 28,
        "title": "I can be somewhat careless.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 29,
        "title": "I am temperamental and get emotional easily.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    },
    {
        "id": 30,
        "title": "I have little creativity.",
        "answers": [
            {
                "text": "Disagree strongly"
            },
            {
                "text": "Disagree a little"
            },
            {
                "text": "Neutral"
            },
            {
                "text": "Agree a little"
            },
            {
                "text": "Agree strongly"
            }
        ]
    }
];

console.debug(JSON.stringify(DUMMY_POSTS, null, 4));
