let currentSection = '';
let currentClass = '';
let currentSubject = '';
let currentChapter = '';
let history = [];

const subjectsMap = {
    PCM: ["Physics", "Chemistry", "Maths"],
    PCB: ["Physics", "Chemistry", "Biology"],
};

function showClasses(section) {
    history.push("main-menu");
    currentSection = section;
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("class-menu").style.display = "block";
}

function showSubjects(classSelected) {
    history.push("class-menu");
    currentClass = classSelected;
    const subjectsDiv = document.getElementById("subjects");
    subjectsDiv.innerHTML = subjectsMap[currentSection]
        .map(
            (subject) =>
                `<button onclick="showChapters('${subject}')">${subject}</button>`
        )
        .join("");
    document.getElementById("class-menu").style.display = "none";
    document.getElementById("subject-menu").style.display = "block";
}

function showChapters(subject) {
    history.push("subject-menu");
    currentSubject = subject;
    const chaptersDiv = document.getElementById("chapters");
    chaptersDiv.innerHTML = Array.from({ length: 13 }, (_, i) => i + 1)
        .map(
            (chapter) =>
                `<button onclick="selectChapter(${chapter})">Chapter ${chapter}</button>`
        )
        .join("");
    document.getElementById("subject-menu").style.display = "none";
    document.getElementById("chapter-menu").style.display = "block";
}

function selectChapter(chapter) {
    history.push("chapter-menu");
    currentChapter = chapter;
    document.getElementById("chapter-menu").style.display = "none";
    document.getElementById("questions-menu").style.display = "block";
    loadQuestions();  // Load the questions when a chapter is selected
}

function loadQuestions() {
    // Clear previous questions before loading new ones
    const questionsDiv = document.getElementById("questions");
    questionsDiv.innerHTML = "";

    fetch("data/questions.json")
        .then((response) => response.json())
        .then((data) => {
            const filteredQuestions = data.filter(
                (q) =>
                    q.section === currentSection &&
                    q.class === currentClass &&
                    q.subject === currentSubject &&
                    q.chapter === currentChapter
            );

            if (filteredQuestions.length === 0) {
                questionsDiv.innerHTML = "<p>No questions available for this chapter.</p>";
                return;
            }

            questionsDiv.innerHTML = filteredQuestions
                .map(
                    (q, index) =>
                        `<div class="question-block">
                            <p><strong>Q${index + 1}:</strong> ${q.question}</p>
                            <button onclick="toggleAnswer(${index})">Show Answer</button>
                            <p id="answer-${index}" style="display: none;">${q.answer}</p>
                        </div>`
                )
                .join("");
        });
}

function toggleAnswer(index) {
    const answerElement = document.getElementById(`answer-${index}`);
    if (answerElement.style.display === "none") {
        answerElement.style.display = "block";
    } else {
        answerElement.style.display = "none";
    }
}

function goBack() {
    const previousMenu = history.pop();
    if (previousMenu) {
        document.querySelectorAll("main section").forEach((section) => {
            section.style.display = "none";
        });
        document.getElementById(previousMenu).style.display = "block";
    }
}
