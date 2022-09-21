import puppeteer from 'puppeteer';
import fs from 'fs';

export const readDictionary = async () => {

    let words : string[] = [];

    try {
        const data = fs.readFileSync('words.txt', 'utf8');
        words = JSON.parse(data);
      } catch (err) {
        console.error(err);
      }

    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true, 'headless': true, env: { LANGUAGE: "fi_fi" }
    });
    const browserPage = await browser.newPage();

    await browserPage.goto("https://www.suomisanakirja.fi", {
        waitUntil: 'networkidle2'
    });

    await browserPage.evaluate(() => {
        document.getElementsByTagName("button")[2].click();
    });

    browserPage.on('console', msg => console.log('PAGE LOG:', msg.text()));

    for (let i = 0; i < letters.length; i++) {

        let letter = letters[i];
        let page = 0;
        let letterWords: string[] = [];

        console.log("Waiting..");
        await browserPage.waitForTimeout(2000);

        while (true) {

            try {
                await browserPage.goto(getUrl(letter, page), {
                    waitUntil: 'networkidle2',
                });
            

            console.log("Waiting..");
            await browserPage.waitForTimeout(2000);

            console.log("Crawling letter '" + letter + "' through page " + page + "..");
            const pageWords = await browserPage.evaluate(() => {
                const retArr = [];

                try {

                    const wordDivs = document.getElementById("main")?.getElementsByTagName("div");
                    if (!wordDivs || wordDivs.length === 0) return undefined;

                    for (let i = 0; i < wordDivs?.length; i++) {
                        const decodedWord = wordDivs[i].innerText.replaceAll(/\(|\)|\d/ig,"").trim();
                        if( decodedWord !== '' && retArr.indexOf(decodedWord) === -1 )   
                            retArr.push(decodedWord);
                    }

                }
                catch (err) {
                    console.log("Page error: " + err);
                }

                return retArr;
            });

            console.log(`Found ${pageWords?.length} words`)
            
            if (pageWords && pageWords.length > 0)
                letterWords.push(...pageWords);
            else
                break;

            page++;
        } catch (err) { console.log("GOTO ERROR: " + err) }
        }

        words.push(...letterWords);
    }

    console.log("Got words");
    words.forEach(word => console.log(word));
    console.log("Writing to file...");
    fs.writeFileSync('words.txt', JSON.stringify(words));
}

const getUrl = (letter: string, page: number) =>
    `https://www.suomisanakirja.fi/selaa.php?k=${letter}&p=${page}`;

const letters = [
    //    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','y','z','ä','ö'
    // -f
    'l'
];
