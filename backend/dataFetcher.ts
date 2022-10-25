import puppeteer from 'puppeteer';
import { WordImagePuzzle } from './types';
import fs from 'fs';

let browser: puppeteer.Browser;
let browserPage: puppeteer.Page;
let words: string[];
let isFirstSearch = true;

const loadDictionary = () => {
    try {
        const data = fs.readFileSync('words.txt', 'utf8');
        words = JSON.parse(data);
    } catch (err) {
        console.error(err);
    }
}

const getRandomWord = () => {
    const idx = Math.floor(Math.random() * words.length);
    return words[idx];
}

const initBrowser = async () => {
    if (browser) return;

    browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true, 'headless': true, env: { LANGUAGE: "fi_fi" }
    });
    browserPage = await browser.newPage();
    await browserPage.goto("https://www.google.com/", {
        waitUntil: 'networkidle2',
    });

    //browserPage.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await browserPage.$$eval('button', buttons => {
        const button = buttons[3] as HTMLButtonElement;
        if( button )
            button.click();
    });
}

export const retrievePuzzles = async (): Promise<WordImagePuzzle[]> => {

    loadDictionary();

    let puzzles: WordImagePuzzle[] = [];
    await initBrowser();
    
    for(let i = 0; i < 3; i++) {
        const word = getRandomWord();
        const images = await retrieveImages(word);
        if( images.length === 4 )
            puzzles.push({ word: word, imageUrls: images });    
        else
            i--;
    }

    return puzzles;
}

export const closeBrowser = () => {
    console.log("Closing browser..");
    browser.close();
}

const retrieveImages = async (word: string) => {

    await browserPage.evaluate((word) => {

        const isFirstSearch = !location.href.startsWith("https://www.google.com/search");
        const inputs = document.getElementsByTagName("input");
        inputs[0].value = word;

        //console.log("Location : " + location.href);

        if (isFirstSearch) {
            //console.log("Already searched");
            inputs[3].click();
        }
        else {
            //console.log("First search");
            document.getElementsByTagName("button")[0].click();
        }

    }, word);

    const start = new Date().getTime();
    //console.log("waiting..");
    await browserPage.waitForTimeout(2000);

    // Move to image search
    if( isFirstSearch ) {
        //console.log("First search, moving to image search...");
        await browserPage.evaluate(() => {
            try {
                const a7 = document.getElementsByTagName("a")[7];
                if( !a7.href.startsWith("https://maps") ) 
                    a7.click();
                else
                    document.getElementsByTagName("a")[8].click();
            }
            catch(e) { 
                console.log("Failed to move to image search: "+e);
            }
        });

        //console.log("waiting..");
        await browserPage.waitForTimeout(1600);
    }

    isFirstSearch = false;

    //await browserPage.waitForSelector('g-inner-card div div img');
    const totalWaittime = new Date().getTime() - start;
    //console.log("Waited for " + totalWaittime + "ms");

    console.log("searching for images..");

    const imageUrls = await browserPage.evaluate( () => {
        let imgSrcs: string[] = [];
        const imgs = document.getElementsByTagName("h2")[0]?.parentElement?.getElementsByTagName("img");
        if( !imgs ) return [];

        for(let i = 0; i < imgs.length && i < 4; i++) {
            imgSrcs.push(imgs[i].src);
        }

        return imgSrcs;
    });

    console.log(`Found ${imageUrls.length} images for word ${word}`);
    return imageUrls;
    //await browser.close();
}

export const getNextWord = () => {
    return "Talo";
}

export const getSentences = () => {
    return ["Talo"];
};
