/** 
 * RECOMMENDATION
 * 
 * To test your code, you should open "tester.html" in a web browser.
 * You can then use the "Developer Tools" to see the JavaScript console.
 * There, you will see the results unit test execution. You are welcome
 * to run the code any way you like, but this is similar to how we will
 * run your code submission.
 * 
 * The Developer Tools in Chrome are available under the "..." menu, 
 * futher hidden under the option "More Tools." In Firefox, they are 
 * under the hamburger (three horizontal lines), also hidden under "More Tools." 
 */


/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results.
 * */


// Change escaped sequences to their actual characters in text.
function preprocessTextSegment(textSegment) {
    return textSegment
    .replace(/\\'/g, "'")   // Change \' to ' (single quote)
    .replace(/\\"/g, '"')   // Change \" to " (double quote)
    .replace(/\\n/g, '\n')  // Change \n to newline
    .replace(/\\t/g, '\t'); // Change \t to tab
}

function findSearchTermInBooks(searchTerm, scannedTextObj) {
     // Check if searchTerm is valid non-empty string.
    if (typeof searchTerm !== 'string' || searchTerm === '') {
        throw new Error('Invalid search term. Provide non-empty string.');
    }
    // Check if scannedTextObj is array.
    if (!Array.isArray(scannedTextObj)) {
        throw new Error('Invalid scanned text object. Must be array.');
    }
    
     // Create results object to store search results.
    const results = { SearchTerm: searchTerm, Results: [] };

    // Iterate through each book in scannedTextObj.
    scannedTextObj.forEach(book => {
        // Check if book.Content is an array.
        if (!Array.isArray(book.Content)) return;

        // Loop through book content.
        for (let i = 0; i < book.Content.length; i++) {
            const content = book.Content[i];

            // Check if content contains page, line, and text attributes.
            if (!content.Page || !content.Line || typeof content.Text !== 'string') continue;

            // Prepare text segment for processing.
            let textSegment = preprocessTextSegment(content.Text);

            // Concatenate text segment.
            let concatenatedWords = textSegment;

            // Check if line ends with hyphen and handle. 
            if (textSegment.endsWith('-')) {
                const nextContent = book.Content[i + 1];
                if (nextContent && typeof nextContent.Text === 'string') {
                    // Extract the word preceding the hyphen.
                    const hyphenatedWord = textSegment.split(' ').pop().slice(0, -1);

                    // Concatenate if search term contains hyphenated word.
                    if (searchTerm.startsWith(hyphenatedWord)) {
                        concatenatedWords = textSegment.slice(0, -1) + preprocessTextSegment(nextContent.Text);
                        console.log(concatenatedWords)
                    }
                }
            }

            // Use regex to find whole word matches.
            const regex = new RegExp(`\\b${searchTerm}\\b`);
            if (regex.test(concatenatedWords)) {
                results.Results.push({ ISBN: book.ISBN, Page: content.Page, Line: content.Line });
            }
        }
    });
    
    // Display results on console.
    console.log(results)

    // Return results object with search term and matches.
    return results;
}

/** Example input object. */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            } 
        ] 
    }
]
    
/** Example output object. */
const twentyLeaguesOut = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}

/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

/* We have provided two unit tests. They're really just `if` statements that 
 * output to the console. We've provided two tests as examples, and 
 * they should pass with a correct implementation of `findSearchTermInBooks`. 
 * 
 * Please add your unit tests below.
 * */

/** We can check that, given a known input, we get a known output. */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1: Function produces expected results for given input.");
} else {
    console.log("FAIL: Test 1: Function does not produce expected results for given input.");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn); 
if (test2result.Results.length == 1) {
    console.log("PASS: Test 2: Function correctly produces expected number of results.");
} else {
    console.log("FAIL: Test 2: Function produces an unexpected number of results.");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}

// Test checks if function can correctly identify and concatenate term that is split and hyphenated across 2 lines.
// Test ensures that words like "dark-" at end of 1 line and "ness" (e.g. "dark-ness") at start of next line are correctly combined.
const resultForHyphenatedTerm = findSearchTermInBooks('darkness', twentyLeaguesIn);

if (resultForHyphenatedTerm.Results.length > 0) {
    console.log("PASS: Test 3: Function successfully identifies and concatenates hyphenated terms split across lines.");
} else {
    console.log("FAIL: Test 3: Function fails to properly identify or concatenate hyphenated terms split across lines.");
    console.log(`Expected at least 1 result, but received ${resultForHyphenatedTerm.Results.length} results.`);
}


// Test checks if function can find terms that have special characters such as apostrophes.
const resultForEscapedCharacterTerm = findSearchTermInBooks("Canadian's", twentyLeaguesIn);

if (resultForEscapedCharacterTerm.Results.length > 0) {
    console.log("PASS: Test 4: Function correctly finds terms with escaped characters.");
} else {
    console.log("FAIL: Test 4: Function has trouble with terms containing escaped characters.");
    console.log(`Expected at least 1 result, but received ${resultForEscapedCharacterTerm.Results.length} results.`);
}


// Test checks if function differentiates between lowercase and uppercase search terms.
const resultForLowerCase = findSearchTermInBooks('darkness', twentyLeaguesIn);
const resultForUpperCase = findSearchTermInBooks('Darkness', twentyLeaguesIn);

if (resultForLowerCase.Results.length > 0 && resultForUpperCase.Results.length === 0) {
    console.log("PASS: Test 5: Function is correctly case-sensitive.");
} else {
    console.log("FAIL: Test 5: Function has issue with case sensitivity.");
    console.log(`Expected 1 result for 'darkness' and 0 for 'Darkness'. Received ${resultForLowerCase.Results.length} for 'darkness' and ${resultForUpperCase.Results.length} for 'Darkness'.`);
}


// Test checks if function returns no results for term that is not present in book.
const resultForNonexistentTerm = findSearchTermInBooks('nonexistentTerm', twentyLeaguesIn);

if (resultForNonexistentTerm.Results.length === 0) {
    console.log("PASS: Test 6: Function correctly returns no results for non-existent term.");
} else {
    console.log("FAIL: Test 6: Function should return no results for non-existent term.");
    console.log(`Expected 0 results but received ${resultForNonexistentTerm.Results.length} results.`);
}

// Test checks function's response to invalid input--empty search term.
try {
    findSearchTermInBooks('', twentyLeaguesIn);
    console.log("FAIL: Test 7: Function should not accept empty search term.");
} catch (error) {
    console.log("PASS: Test 7: Function correctly rejects empty search term.");
    console.log("Error message:", error.message);
}

// Test checks function's response to another invalid input--null scanned text object.
try {
    findSearchTermInBooks('term', null);
    console.log("FAIL: Test 8: Function should not accept null scanned text object.");
} catch (error) {
    console.log("PASS: Test 8: Function correctly rejects null scanned text object.");
    console.log("Error message:", error.message);
}
