import json

import requests
from bs4 import BeautifulSoup

parser = BeautifulSoup(
"""
<html lang="en"><head><meta property="article:modified_time" content="2019-01-16T04:00:00-05:00"><title>Finally, A Personality Quiz Backed By Science | FiveThirtyEight</title><meta property="og:title" content="Finally, A Personality Quiz Backed By Science"><meta property="og:description" content="The Big Five is the way most psychologists test personality. See your score on different traits like extraversion and agreeableness and then find how your personality compares with that of the average American."><meta name="description" content="The Big Five is the way most psychologists test personality. See your score on different traits like extraversion and agreeableness and then find how your personality compares with that of the average American."><link rel="canonical" href="https://projects.fivethirtyeight.com/personality-quiz/"><meta property="og:url" content="https://projects.fivethirtyeight.com/personality-quiz/"><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta property="og:type" content="article"><meta property="og:site_name" content="FiveThirtyEight"><meta property="og:locale" content="en_US"><meta property="og:image" content="https://fivethirtyeight.com/wp-content/uploads/2019/01/538_FINAL_16x9CROP.jpg?w=1200&amp;q=90"><meta property="article:published_time" content="2019-01-16T04:00:00-05:00"><meta property="article:publisher" content="https://www.facebook.com/FiveThirtyEight"><meta property="article:author" content=""><meta property="fb:app_id" content="797620670264818"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="application-name" content="FiveThirtyEight"><meta name="author" content="Maggie Koerth Baker and Julia Wolfe"><meta name="twitter:image:src" content="https://fivethirtyeight.com/wp-content/uploads/2019/01/538_FINAL_16x9CROP.jpg?w=1200&amp;q=90"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:widgets:csp" content="on"><meta name="twitter:maxage" content="300"><meta name="twitter:site" content="FiveThirtyEight"><meta name="twitter:site:id" content="2303751216"><meta name="twitter:creator"><meta name="twitter:creator:id"><link rel="author" href=""><link rel="search" type="application/opensearchdescription+xml" href="https://fivethirtyeight.com/osd.xml" title="FiveThirtyEight"><link rel="search" type="application/opensearchdescription+xml" href="https://wordpress.com/opensearch.xml" title="WordPress.com"><link rel="shortcut icon" type="image/x-icon" href="https://projects.fivethirtyeight.com/shared/favicon.ico"><link rel="icon" type="image/x-icon" href="https://projects.fivethirtyeight.com/shared/favicon.ico"><link rel="apple-touch-icon" href="https://projects.fivethirtyeight.com/shared/apple-touch-icon.png"><link rel="mask-icon" href="https://projects.fivethirtyeight.com/shared/safari-pinned-tab.svg" color="#ed713a"><link rel="dns-prefetch" href="fivethirtyeight.com"><link rel="dns-prefetch" href="secure.espn.com"><link rel="dns-prefetch" href="s.abcnews.com"><script async="" type="text/javascript" src="https://cdn.taboola.com/libtrc/abcnews-fivethirtyeight/loader.js" id="tb_loader_script"></script><script async="" type="text/javascript" src="https://s.abcnews.com/assets/js/s_code_538.js?v=20200624"></script><script src="https://tags.bkrtx.com/js/bk-coretag.js"></script><script async="" src="https://www.googletagservices.com/tag/js/gpt.js"></script><script async="" src="https://www.googletagmanager.com/gtm.js?id=GTM-KLHT6T2"></script><script async="" src="https://sb.scorecardresearch.com/beacon.js"></script><script async="" src="https://cdn-gl.imrworldwide.com/conf/PF2155097-E1B7-4900-A8F3-22BADF34DBC6.js#name=nlsnInstance&amp;ns=NOLBUNDLE"></script><script async="" type="text/javascript" src="https://static.chartbeat.com/js/chartbeat.js"></script><script async="" type="text/javascript" src="https://static.chartbeat.com/js/chartbeat_mab.js"></script><script async="" src="https://www.google-analytics.com/analytics.js"></script><script type="text/javascript">var trackingConfig = {
  postId: "199728",
  section: "science",
  primaryTag: "personality-tests",
  pageName: "personality-quiz",
  title: "Finally, A Personality Quiz Backed By Science",
  author: "Maggie Koerth Baker and Julia Wolfe",
  authorSlug: "baker_koerth_maggie",
  fullUrl: "https://projects.fivethirtyeight.com/personality-quiz/",
  path: "personality-quiz/",
  twitterText: "Most Personality Quizzes Are Junk Science. Take One That Isn’t.",
  publishTime: "2019-01-16 9:00"
};</script><link rel="stylesheet" href="/personality-quiz/css/app.css?v=df457b2c69ef87b24fa5b99e7e4da577"><script type="text/javascript">var staticUrl = '/personality-quiz';</script><script src="/personality-quiz/js/bundle.js?v=a115b0d2825478c2d428e614502ab450" defer="defer"></script></head><body data-gr-c-s-loaded="true"><header class="page-header vertical-science"><div class="header-wrapper"><a class="logo" href="https://fivethirtyeight.com"><img width="158" height="20" alt="FiveThirtyEight" src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MjEgNTMuNzYiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojMDEwMTAxO308L3N0eWxlPjwvZGVmcz48dGl0bGU+QXJ0Ym9hcmQgOTU8L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTAgMGgyNXY4SDl2MTBoMTV2OEg5djE3SDBWMHpNMzEgMzZoNVYxOGgtNXYtOGgxM3YyNmg0djdIMzF6bTUtMzZoOHY4aC04ek0xNzkgMzZoNVYxOGgtNXYtOGgxM3YyNmg0djdoLTE3em01LTM2aDh2OGgtOHpNMzE2IDM2aDVWMThoLTV2LThoMTN2MjZoNHY3aC0xN3ptNS0zNmg4djhoLTh6TTU0IDI3VjEwaDh2MTVsNCA5Ljk4aDFMNzEgMjVWMTBoOHYxN2wtNyAxNkg2MWwtNy0xNnpNMTExIDQzSDk3LjQyQzg5LjIzIDQzIDg1IDM5LjE5IDg1IDMxLjE3VjIyYzAtNy41NyA0LjMtMTMgMTMtMTMgOS4zMyAwIDEzIDUuMDcgMTMgMTR2N0g5NHYxLjc0YzAgMi42MiAxIDQuMjYgMy40MiA0LjI2SDExMXpNOTQgMjNoOHYtMS41NWMwLTIuNjItMS4wNi01LjQ1LTQuMTMtNS40NS0yLjc5IDAtMy44NyAyLjItMy44NyA1LjQ1ek0xMjUgOGgtMTBWMGgyOXY4aC0xMHYzNWgtOVY4ek0yMDIgNDNWMTBoOHY0YzEuMTQtMi40NSAzLjc1LTQgNy4yMi00SDIyMHY4aC02Yy0yLjg0IDAtNCAuOTQtNCAzLjlWNDN6TTI0NSA0M2gtNC44NEMyMzMuMDUgNDMgMjMwIDM5LjMxIDIzMCAzMS44NVYxOGgtNnYtOGg2VjNoOHY3aDd2OGgtN2wtLjA3IDEzLjkzYzAgMi4yMi45MyA0LjA3IDMuNjYgNC4wN0gyNDV6TTQyMSA0M2gtNC44NEM0MDkuMDUgNDMgNDA2IDM5LjMxIDQwNiAzMS44NVYxOGgtNnYtOGg2VjNoOHY3aDd2OGgtN2wtLjA3IDEzLjkzYzAgMi4yMi45MyA0LjA3IDMuNjYgNC4wN0g0MjF6TTI1NC4yNiA1My43Nmw0LjYxLTkuNUwyNTEgMjdWMTBoOHYxNWw0IDEwaDFsNC0xMFYxMGg4djE3bC0xMi4zIDI2Ljc2aC05LjQ0ek0yODQgMGgyNXY4aC0xNnY5aDE1djhoLTE1djEwaDE2djhoLTI1VjB6TTMzNyA0OHYtMmgxNi4xYzIgMCAyLjktLjE4IDIuOS0xLjI3di0uMzRjMC0xLjA4LS45MS0xLjM5LTIuOS0xLjM5SDM0MHYtNWw1LTVjLTUuMjktMS40OC04LTUuNDMtOC0xMXYtMWMwLTcuNTYgNC40NC0xMiAxNC0xMmEyMS45MyAyMS45MyAwIDAgMSA1Ljk1IDFMMzYxIDRsNSAzLTQgNmMxLjM3IDEuOTMgMyA0LjkzIDMgOHYxYzAgNy0zLjMgMTAuNjYtMTIgMTFsLTMgNGg2YzUuOTIgMCA5IDIuNjIgOSA3LjY4di4xMWMwIDUuMDYtMi43MSA4LjIxLTguNjIgOC4yMWgtMTNjLTQuMjkgMC02LjM4LTEuODQtNi4zOC01em0xOS0yNXYtM2MwLTMuMy0xLjMzLTQtNS00cy01IC43LTUgNHYzYzAgMy4zIDEuMzkgNCA1IDRzNS0uNyA1LTR6TTM4MCA0M2gtOFYwaDh2MTRjMS4xNC0yLjY3IDMuNC00IDctNCA2LjI2IDAgOSAzLjA4IDkgMTAuNzZWNDNoLThWMjJjMC0zLjEzLTEuMDctNS00LTVzLTQgMS44Ny00IDV6TTE1NyA0M2gtOFYwaDh2MTRjMS4xNC0yLjY3IDMuOTEtNCA3LjQ5LTQgNi4yNiAwIDguNTEgMy4xMyA4LjUxIDEwLjgxVjQzaC04VjIxYzAtMy4xMy0xLjA3LTQuNDQtNC00LjQ0cy00IDIuMjYtNCA1LjM5eiIvPjwvc3ZnPg=="></a><div class="social-links"><a class="social share-twitter" id="twitter-sharer" href="#" target="_blank"><div class="icon icon-twitter"></div></a><a class="social share-facebook" id="facebook-sharer" href="#" target="_blank"><div class="icon icon-facebook"></div></a></div></div></header><div id="header-spacer"></div><main class="main" id="main-content"><div class="container container-full-width container-intro"><div id="ad"><div id="div-gpt-ad-1558036340566-0"></div></div><div class="intro" id="intro"><div class="top-image"><img class="header-img" src="/personality-quiz/images/header-img.jpg?v=440e1a5dee409fcdc6532210f48b6d3c" alt="Header illustration"></div><div class="timestamp-container"><p class="timestamp">PUBLISHED Jan. 16, 2019, at 9:00 AM</p></div><h1>Most Personality Quizzes Are Junk Science. Take One That Isn’t.</h1><h2 class="article-subtitle">Compare your results to those of your friends and family.</h2><p class="byline">By <a class="author" href="https://fivethirtyeight.com/contributors/maggie-koerth-baker/">Maggie Koerth</a> and <a class="author" href="https://fivethirtyeight.com/contributors/julia-wolfe">Julia Wolfe</a></p></div><div class="container-lede container"><h3 class="group-title-intro"></h3><div class="group-list dialogue-box hidden"><h2 class="group-title">Your groups</h2><h4 class="group-title-dek">You’re part of the ${group} group. Its members are taking a personality quiz to see how they compare to the group’s average. Once you’ve taken the quiz, your score will be added to the group average.</h4><form class="groups"></form></div><p class="article-text">What’s your personality, and what can it tell you about your true self? Those questions have launched a thousand online personality quizzes. But you can do better than those specious — yet irresistible — quizzes. You can take a personality quiz backed by science.</p><p class="article-text">Meet the Big Five, the way most psychologists measure and test personality. It’s a system built on decades of research about how people describe one another and themselves. (You can read more about it in <a href="https://fivethirtyeight.com/features/most-personality-quizzes-are-junk-science-i-found-one-that-isnt/">this article</a> we published last year.) There are a couple of things that make it — and this quiz — different.</p><p class="article-text">First, the Big Five doesn’t put people into neat personality “types,” because that’s not how personalities really work. Instead, the quiz gives you a score on five different traits: extraversion, agreeableness, conscientiousness, negative emotionality and openness to experience. For each of those traits, you’re graded on a scale from 0 to 100, depending on how strongly you associate with that trait. So, for example, this quiz won’t tell you whether you’re an extravert or an introvert — instead, it tells you your propensity toward extraversion. Every trait is graded on a spectrum, with a few people far out on the extremes and a lot of people in the middle.</p><p class="article-text">The other thing that makes the Big Five different is it lets you easily compare your score to others’. We’re going to show you how your personality compares with that of the average American. And once you get your results, you can invite friends and relatives to compare your personality to theirs. (In the meantime, you’ll be stuck comparing yourself to the average FiveThirtyEight staffer.)</p><p class="article-text">So what are you waiting for? Find out who you really are — take the quiz for yourself!</p></div></div><div class="container container-full-width container-quiz" id="container-quiz"> <div class="container-results"> </div>
<section class="view question js-question question-quiet is-displayed is-visible" id="quiet">
  <h2 class="question-dek">I tend to be quiet.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="quiet-0" data-index="0" name="quiet">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="quiet-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="quiet-1" data-index="1" name="quiet">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="quiet-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="quiet-2" data-index="2" name="quiet">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="quiet-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="quiet-3" data-index="3" name="quiet">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="quiet-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="quiet-4" data-index="4" name="quiet">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="quiet-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-compassionate is-visible" id="compassionate">
  <h2 class="question-dek">I am compassionate and have a soft heart.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="compassionate-0" data-index="0" name="compassionate">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="compassionate-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="compassionate-1" data-index="1" name="compassionate">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="compassionate-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="compassionate-2" data-index="2" name="compassionate">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="compassionate-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="compassionate-3" data-index="3" name="compassionate">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="compassionate-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="compassionate-4" data-index="4" name="compassionate">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="compassionate-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-disorganized is-visible" id="disorganized">
  <h2 class="question-dek">I tend to be disorganized.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="disorganized-0" data-index="0" name="disorganized">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="disorganized-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="disorganized-1" data-index="1" name="disorganized">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="disorganized-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="disorganized-2" data-index="2" name="disorganized">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="disorganized-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="disorganized-3" data-index="3" name="disorganized">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="disorganized-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="disorganized-4" data-index="4" name="disorganized">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="disorganized-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-Worries is-visible" id="Worries">
  <h2 class="question-dek">I worry a lot.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="Worries-0" data-index="0" name="Worries">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="Worries-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="Worries-1" data-index="1" name="Worries">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="Worries-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="Worries-2" data-index="2" name="Worries">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="Worries-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="Worries-3" data-index="3" name="Worries">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="Worries-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="Worries-4" data-index="4" name="Worries">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="Worries-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-art is-visible" id="art">
  <h2 class="question-dek">I am fascinated by art, music or literature.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="art-0" data-index="0" name="art">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="art-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="art-1" data-index="1" name="art">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="art-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="art-2" data-index="2" name="art">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="art-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="art-3" data-index="3" name="art">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="art-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="art-4" data-index="4" name="art">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="art-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-dominant is-visible" id="dominant">
  <h2 class="question-dek">I am dominant and act as a leader.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="dominant-0" data-index="0" name="dominant">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="dominant-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="dominant-1" data-index="1" name="dominant">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="dominant-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="dominant-2" data-index="2" name="dominant">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="dominant-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="dominant-3" data-index="3" name="dominant">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="dominant-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="dominant-4" data-index="4" name="dominant">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="dominant-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-rude is-visible" id="rude">
  <h2 class="question-dek">I am sometimes rude to others.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="rude-0" data-index="0" name="rude">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="rude-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="rude-1" data-index="1" name="rude">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="rude-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="rude-2" data-index="2" name="rude">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="rude-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="rude-3" data-index="3" name="rude">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="rude-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="rude-4" data-index="4" name="rude">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="rude-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-started is-visible" id="started">
  <h2 class="question-dek">I have difficulty getting started on tasks.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="started-0" data-index="0" name="started">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="started-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="started-1" data-index="1" name="started">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="started-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="started-2" data-index="2" name="started">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="started-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="started-3" data-index="3" name="started">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="started-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="started-4" data-index="4" name="started">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="started-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-depressed is-visible" id="depressed">
  <h2 class="question-dek">I tend to feel depressed and blue.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="depressed-0" data-index="0" name="depressed">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="depressed-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="depressed-1" data-index="1" name="depressed">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="depressed-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="depressed-2" data-index="2" name="depressed">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="depressed-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="depressed-3" data-index="3" name="depressed">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="depressed-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="depressed-4" data-index="4" name="depressed">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="depressed-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-abstract is-visible" id="abstract">
  <h2 class="question-dek">I have little interest in abstract ideas.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="abstract-0" data-index="0" name="abstract">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="abstract-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="abstract-1" data-index="1" name="abstract">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="abstract-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="abstract-2" data-index="2" name="abstract">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="abstract-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="abstract-3" data-index="3" name="abstract">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="abstract-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="abstract-4" data-index="4" name="abstract">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="abstract-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-energy is-visible" id="energy">
  <h2 class="question-dek">I am full of energy.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="energy-0" data-index="0" name="energy">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="energy-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="energy-1" data-index="1" name="energy">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="energy-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="energy-2" data-index="2" name="energy">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="energy-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="energy-3" data-index="3" name="energy">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="energy-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="energy-4" data-index="4" name="energy">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="energy-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-best is-visible" id="best">
  <h2 class="question-dek">I assume the best about people.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="best-0" data-index="0" name="best">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="best-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="best-1" data-index="1" name="best">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="best-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="best-2" data-index="2" name="best">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="best-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="best-3" data-index="3" name="best">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="best-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="best-4" data-index="4" name="best">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="best-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-reliable is-visible" id="reliable">
  <h2 class="question-dek">I am reliable and can always be counted on.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="reliable-0" data-index="0" name="reliable">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="reliable-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="reliable-1" data-index="1" name="reliable">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="reliable-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="reliable-2" data-index="2" name="reliable">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="reliable-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="reliable-3" data-index="3" name="reliable">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="reliable-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="reliable-4" data-index="4" name="reliable">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="reliable-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-stable is-visible" id="stable">
  <h2 class="question-dek">I am emotionally stable and not easily upset.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="stable-0" data-index="0" name="stable">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="stable-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="stable-1" data-index="1" name="stable">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="stable-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="stable-2" data-index="2" name="stable">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="stable-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="stable-3" data-index="3" name="stable">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="stable-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="stable-4" data-index="4" name="stable">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="stable-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-original is-visible" id="original">
  <h2 class="question-dek">I am original and come up with new ideas.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="original-0" data-index="0" name="original">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="original-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="original-1" data-index="1" name="original">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="original-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="original-2" data-index="2" name="original">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="original-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="original-3" data-index="3" name="original">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="original-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="original-4" data-index="4" name="original">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="original-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-outgoing is-visible" id="outgoing">
  <h2 class="question-dek">I am outgoing and sociable.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="outgoing-0" data-index="0" name="outgoing">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="outgoing-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="outgoing-1" data-index="1" name="outgoing">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="outgoing-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="outgoing-2" data-index="2" name="outgoing">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="outgoing-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="outgoing-3" data-index="3" name="outgoing">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="outgoing-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="outgoing-4" data-index="4" name="outgoing">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="outgoing-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-cold is-visible" id="cold">
  <h2 class="question-dek">I can be cold and uncaring.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="cold-0" data-index="0" name="cold">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="cold-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="cold-1" data-index="1" name="cold">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="cold-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="cold-2" data-index="2" name="cold">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="cold-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="cold-3" data-index="3" name="cold">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="cold-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="cold-4" data-index="4" name="cold">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="cold-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-neat is-visible" id="neat">
  <h2 class="question-dek">I keep things neat and tidy.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="neat-0" data-index="0" name="neat">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="neat-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="neat-1" data-index="1" name="neat">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="neat-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="neat-2" data-index="2" name="neat">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="neat-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="neat-3" data-index="3" name="neat">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="neat-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="neat-4" data-index="4" name="neat">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="neat-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-relaxed is-visible" id="relaxed">
  <h2 class="question-dek">I am relaxed and handle stress well.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="relaxed-0" data-index="0" name="relaxed">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="relaxed-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="relaxed-1" data-index="1" name="relaxed">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="relaxed-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="relaxed-2" data-index="2" name="relaxed">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="relaxed-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="relaxed-3" data-index="3" name="relaxed">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="relaxed-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="relaxed-4" data-index="4" name="relaxed">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="relaxed-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-artistic is-visible" id="artistic">
  <h2 class="question-dek">I have few artistic interests.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="artistic-0" data-index="0" name="artistic">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="artistic-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="artistic-1" data-index="1" name="artistic">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="artistic-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="artistic-2" data-index="2" name="artistic">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="artistic-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="artistic-3" data-index="3" name="artistic">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="artistic-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="artistic-4" data-index="4" name="artistic">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="artistic-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-charge is-visible" id="charge">
  <h2 class="question-dek">I prefer to have others take charge.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="charge-0" data-index="0" name="charge">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="charge-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="charge-1" data-index="1" name="charge">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="charge-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="charge-2" data-index="2" name="charge">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="charge-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="charge-3" data-index="3" name="charge">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="charge-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="charge-4" data-index="4" name="charge">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="charge-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-respectful is-visible" id="respectful">
  <h2 class="question-dek">I am respectful and treat others with respect.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="respectful-0" data-index="0" name="respectful">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="respectful-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="respectful-1" data-index="1" name="respectful">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="respectful-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="respectful-2" data-index="2" name="respectful">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="respectful-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="respectful-3" data-index="3" name="respectful">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="respectful-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="respectful-4" data-index="4" name="respectful">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="respectful-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-persistent is-visible" id="persistent">
  <h2 class="question-dek">I am persistent and work until the task is finished.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="persistent-0" data-index="0" name="persistent">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="persistent-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="persistent-1" data-index="1" name="persistent">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="persistent-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="persistent-2" data-index="2" name="persistent">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="persistent-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="persistent-3" data-index="3" name="persistent">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="persistent-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="persistent-4" data-index="4" name="persistent">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="persistent-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-secure is-visible" id="secure">
  <h2 class="question-dek">I feel secure and comfortable with myself.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="secure-0" data-index="0" name="secure">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="secure-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="secure-1" data-index="1" name="secure">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="secure-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="secure-2" data-index="2" name="secure">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="secure-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="secure-3" data-index="3" name="secure">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="secure-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="secure-4" data-index="4" name="secure">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="secure-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-complex is-visible" id="complex">
  <h2 class="question-dek">I am complex and a deep thinker.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="complex-0" data-index="0" name="complex">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="complex-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="complex-1" data-index="1" name="complex">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="complex-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="complex-2" data-index="2" name="complex">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="complex-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="complex-3" data-index="3" name="complex">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="complex-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="complex-4" data-index="4" name="complex">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="complex-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-active is-visible" id="active">
  <h2 class="question-dek">I am less active than other people.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="active-0" data-index="0" name="active">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="active-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="active-1" data-index="1" name="active">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="active-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="active-2" data-index="2" name="active">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="active-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="active-3" data-index="3" name="active">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="active-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="active-4" data-index="4" name="active">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="active-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-fault is-visible" id="fault">
  <h2 class="question-dek">I tend to find fault with others.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="fault-0" data-index="0" name="fault">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="fault-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="fault-1" data-index="1" name="fault">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="fault-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="fault-2" data-index="2" name="fault">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="fault-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="fault-3" data-index="3" name="fault">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="fault-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="fault-4" data-index="4" name="fault">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="fault-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-careless is-visible" id="careless">
  <h2 class="question-dek">I can be somewhat careless.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="careless-0" data-index="0" name="careless">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="careless-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="careless-1" data-index="1" name="careless">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="careless-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="careless-2" data-index="2" name="careless">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="careless-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="careless-3" data-index="3" name="careless">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="careless-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="careless-4" data-index="4" name="careless">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="careless-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-temperamental is-visible" id="temperamental">
  <h2 class="question-dek">I am temperamental and get emotional easily.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="temperamental-0" data-index="0" name="temperamental">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="temperamental-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="temperamental-1" data-index="1" name="temperamental">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="temperamental-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="temperamental-2" data-index="2" name="temperamental">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="temperamental-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="temperamental-3" data-index="3" name="temperamental">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="temperamental-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="temperamental-4" data-index="4" name="temperamental">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="temperamental-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section>
<section class="view question js-question question-creativity is-visible" id="creativity">
  <h2 class="question-dek">I have little creativity.</h2>
  <form class="choices">
    <div class="choice" tab-index="0">
      <input class="choice-input js-choice-input" type="radio" id="creativity-0" data-index="0" name="creativity">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="creativity-0" data-index="0"><span class="choice-text">Disagree strongly</span></label>
    </div>
    <div class="choice" tab-index="1">
      <input class="choice-input js-choice-input" type="radio" id="creativity-1" data-index="1" name="creativity">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="creativity-1" data-index="1"><span class="choice-text">Disagree a little</span></label>
    </div>
    <div class="choice" tab-index="2">
      <input class="choice-input js-choice-input" type="radio" id="creativity-2" data-index="2" name="creativity">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="creativity-2" data-index="2"><span class="choice-text">Neutral</span></label>
    </div>
    <div class="choice" tab-index="3">
      <input class="choice-input js-choice-input" type="radio" id="creativity-3" data-index="3" name="creativity">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="creativity-3" data-index="3"><span class="choice-text">Agree a little</span></label>
    </div>
    <div class="choice" tab-index="4">
      <input class="choice-input js-choice-input" type="radio" id="creativity-4" data-index="4" name="creativity">
      <div class="choice-background"></div>
      <label class="choice-label button js-choice-label" for="creativity-4" data-index="4"><span class="choice-text">Agree strongly</span></label>
    </div>
  </form>
  <hr class="question-link">
</section><section class="view js-results results is-visible"></section><div class="status-wrap">
<p class="status"> <span class="status-num">0</span> of <span class="status-num">30</span> questions completed</p></div></div><div class="group-maker dialogue-box hidden"><h2 class="group-title">Share with family and friends</h2><h4 class="group-maker-dek">No matter how extraverted you are, this quiz is more fun when you can compare yourself with people you know! To start sharing your results, create a group below.</h4><div class="input-wrapper"><h5 class="input-desc">Name your group</h5><input class="group-name" placeholder="My annoying co-workers" maxlength="21"></div><button class="button button-ui disabled" id="group">Create group</button></div></main><div class="container container-credits"><div id="footer"><p class="notes"></p><div class="additional-credits"><p>Additional design and development by <a href="https://fivethirtyeight.com/contributors/rachael-dottle/">Rachael Dottle</a></p></div><div class="additional-credits credits-illustrator"><p>Illustration by <a href="https://sonniekozlover.com/">Sonnie Kozlover</a></p></div><div class="sources"><p>Big Five Inventory-2 items copyright 2015 by Oliver John and Christopher J. Soto. Reprinted with permission.</p></div><div class="sources"><p></p></div></div></div><div class="container clearfix" id="related" style="display:none;"><h3 class="subhead-fte-module">Related Stories</h3><div class="related one" id="related-1"><a href="http://fivethirtyeight.com/features/most-personality-quizzes-are-junk-science-i-found-one-that-isnt/"><img src="https://fivethirtyeight.com/wp-content/uploads/2017/12/fivethirtyeight-junk-science-a-4-3.jpg?quality=90&amp;strip=info&amp;w=400" srcset="https://fivethirtyeight.com/wp-content/uploads/2017/12/fivethirtyeight-junk-science-a-4-3.jpg?quality=90&amp;strip=info&amp;w=400 400w, https://fivethirtyeight.com/wp-content/uploads/2017/12/fivethirtyeight-junk-science-a-4-3.jpg?quality=90&amp;strip=info&amp;w=200 200w, https://fivethirtyeight.com/wp-content/uploads/2017/12/fivethirtyeight-junk-science-a-4-3.jpg?quality=90&amp;strip=info&amp;w=100 100w" sizes="(max-width: 767px) 100px, 200px" alt="Most Personality Quizzes Are Junk Science. I Found One That Isn’t."></a><h2><a href="http://fivethirtyeight.com/features/most-personality-quizzes-are-junk-science-i-found-one-that-isnt/">Most Personality Quizzes Are Junk Science. I Found One That Isn’t.</a></h2></div><div class="related two" id="related-2"><a href="http://fivethirtyeight.com/features/this-algorithm-knows-you-better-than-your-facebook-friends-do/"><img src="https://fivethirtyeight.com/wp-content/uploads/2015/01/ap120112075763.jpg?quality=90&amp;strip=info&amp;w=400" srcset="https://fivethirtyeight.com/wp-content/uploads/2015/01/ap120112075763.jpg?quality=90&amp;strip=info&amp;w=400 400w, https://fivethirtyeight.com/wp-content/uploads/2015/01/ap120112075763.jpg?quality=90&amp;strip=info&amp;w=200 200w, https://fivethirtyeight.com/wp-content/uploads/2015/01/ap120112075763.jpg?quality=90&amp;strip=info&amp;w=100 100w" sizes="(max-width: 767px) 100px, 200px" alt="This Algorithm Knows You Better Than Your Facebook Friends Do"></a><h2><a href="http://fivethirtyeight.com/features/this-algorithm-knows-you-better-than-your-facebook-friends-do/">This Algorithm Knows You Better Than Your Facebook Friends Do</a></h2></div><div class="related three" id="related-3"></div><div class="related four" id="related-4"></div><div class="related five" id="related-5"></div></div><div class="comments fte-expandable container"><h3 class="subhead-fte-module subhed-fte-comments" id="fte-expandable-title">Comments<span class="fte-expandable-icon"></span>	</h3><div class="entry-comments-content fte-expandable-content" id="entry-comments-content" style="display: none;"><div class="fb-comments fb_iframe_widget" id="fb-comments" data-href="https://projects.fivethirtyeight.com/personality-quiz/" data-numposts="5" data-colorscheme="light" data-width="100%" data-order-by="reverse_time"></div></div></div><div class="taboola-placeholder taboola-recommendations" id="taboola-199728"></div><div class="site-footer js" id="colophon"><div class="site-wrapper footer-main-content"><div class="footer-section-get-more">Get more FiveThirtyEight</div><div class="footer-section-primary-links"><ul class="footer-menu"><li class="footer-menu-item"><a href="https://fivethirtyeight.com/newsletter/">Newsletter</a></li><li class="footer-menu-item"><a href="https://fivethirtyeight.com/videos/">Videos</a></li><li class="footer-menu-item"><a href="https://fivethirtyeight.com/tag/fivethirtyeight-podcasts/">Podcasts</a></li><li class="footer-menu-item"><a href="https://twitter.com/fivethirtyeight">Twitter</a></li><li class="footer-menu-item"><a href="https://www.facebook.com/fivethirtyeight">Facebook</a></li><li class="footer-menu-item"><a href="https://data.fivethirtyeight.com/">Data</a></li><li class="footer-menu-item"><a href="https://fivethirtyeight.com/datalab/fear-not-readers-we-have-rss-feeds/">RSS</a></li></ul></div><div class="footer-section-secondary-links"><ul class="footer-menu"><li class="footer-menu-item"><a href="https://fivethirtyeight.com/contact/">Contact</a></li><li class="footer-menu-item"><a href="https://fivethirtyeight.com/jobs/">Jobs</a></li><li class="footer-menu-item"><a href="https://fivethirtyeight.com/masthead/">Masthead</a></li><li class="footer-menu-item"><a href="http://priv-policy.imrworldwide.com/priv/browser/us/en/optout.html">About Nielsen Measurement</a></li></ul></div><div class="footer-section-tertiary-links"><ul class="footer-menu"><li class="footer-menu-item"><a href="https://disneytermsofuse.com/">Terms of Use</a></li><li class="footer-menu-item"><a href="https://disneyprivacycenter.com/">Privacy Policy</a></li><li class="footer-menu-item"><a href="https://privacy.thewaltdisneycompany.com/en/dnsmi/" target="_blank" rel="noopener noreferrer">Do Not Sell My Info</a></li><li class="footer-menu-item"><a href="https://disneyprivacycenter.com/notice-to-california-residents/">Your California Privacy Rights</a></li><li class="footer-menu-item"><a href="https://disneyprivacycenter.com/kids-privacy-policy/english/">Children's Online Privacy Policy</a></li><li class="footer-menu-item"><a href="https://preferences-mgr.truste.com/?type=abcnews&amp;affiliateId=11&amp;cid=clicksource_4380645_footer_interestbasedads">Interest-Based Ads</a></li></ul><p>© 2018 ABC News Internet Ventures. All rights reserved.</p></div></div></div><script src="/bundled/js/bundled2.js" defer=""></script><link href="/bundled/css/bundled2.css" rel="stylesheet"><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KLHT6T2" width="0" height="0" style="display: none !important;" hidden=""></iframe></body></html>
""", 'html.parser')
container = parser.find(name="div", id="container-quiz")

questions = []
question_id = 1

for answer_section in container.find_all("section"):
    if not answer_section.h2:
        print("Ignoring {0} question because no h2".format(answer_section))
        continue

    question = answer_section.h2.text
    answers = []

    for label in answer_section.find_all("label"):
        answers.append({
            "text": label.text,
        })

    questions.append({
        "id": question_id,
        "title": question,
        "answers": answers,
    })

    question_id += 1

print(json.dumps(questions, indent=4, separators=(", ", ": ")))
